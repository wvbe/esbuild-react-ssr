import { CacheProvider } from '@emotion/react';
import path from 'path';
import fs from 'fs/promises';
import createEmotionServer from '@emotion/server/create-instance';
import esbuild from 'esbuild';
import React, { FunctionComponent } from 'react';
import * as Server from 'react-dom/server';
import { cache, key } from './styleCache';

import App from '../client/index';
type AppProps = typeof App extends FunctionComponent<infer P> ? P : unknown;

const { extractCritical } = createEmotionServer(cache);

/**
 * Use esbuild to transform a Typescript codebase into a browser JS module
 */
async function createBundle() {
	const { outputFiles } = await esbuild.build({
		// When piping esbuild output into node, __dirname is lost:
		entryPoints: ['system/clientBundleEntry.ts'],
		write: false,
		bundle: true,

		// @TODO make these configurable
		minify: true,
		sourcemap: true
	});
	return outputFiles
		.map(outputFile => new TextDecoder().decode(outputFile.contents))
		.join('\n')
		.replace('</script>', '</scr" + "ipt>');
}

/**
 * Use React SSR, emotion's cache and some other functions to generate a full HTML+CSS that hydrates itself.
 */
async function createHtml({ bundle }: { bundle: string }, data: AppProps) {
	const emotion = extractCritical(
		Server.renderToString(
			React.createElement(CacheProvider, { value: cache }, React.createElement(App, data))
		)
	);
	return ((htmls: TemplateStringsArray, ...inputs: string[]) =>
		htmls.reduce((flat, html, i) => flat + html.replace(/\n\t*/g, '') + (inputs[i] || ''), ''))`
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta http-equiv="X-UA-Compatible" content="ie=edge" />
				<style data-emotion="${key} ${emotion.ids.join(' ')}">
					${emotion.css}
				</style>
			</head>
			<body>
				<div id="container">${emotion.html}</div>
			</body>
			<script type="text/javascript">
				window.$$$r = ${JSON.stringify({
					hydration: data
				})};
				${bundle};
			</script>
		</html>
	`;
}

type BuildOptions = {
	distLocation: string;
};

type SystemTools = {
	createPage: (path: string, data: AppProps) => Promise<void>;
};

export async function createSite<Component>(
	{ distLocation }: BuildOptions,
	callback: (tools: SystemTools) => Promise<void>
) {
	const bundle = await createBundle();
	const systemTools: SystemTools = {
		createPage: async (url, data) => {
			await fs.mkdir(path.join(distLocation, url), { recursive: true });
			await Promise.all([
				// The page with precomputed HTML and its hydration data:
				fs.writeFile(
					path.join(distLocation, url, 'index.html'),
					await createHtml({ bundle }, data)
				),
				// The hydration data to an AJAXable JSON:
				fs.writeFile(
					path.join(distLocation, url, 'data.json'),
					JSON.stringify(data, null, '\t')
				)
			]);
		}
	};

	console.log('Script start:    ' + new Date().toLocaleTimeString());
	console.time('Script duration');

	// Clean out the build location
	// await fs.rmdir(distLocation, { recursive: true });
	await fs.mkdir(distLocation, { recursive: true });

	// Run the build configuration
	try {
		await callback(systemTools);
	} catch (error) {
		console.group('Encountered an error, build process stopped:');
		console.error(
			error.stack
				.split('\n')
				.map((line: string) => '|  ' + line)
				.join('\n')
		);
		console.groupEnd();
	}

	console.log('Script stop:     ' + new Date().toLocaleTimeString());
	console.timeEnd('Script duration');
}
