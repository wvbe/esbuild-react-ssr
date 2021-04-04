import { CacheProvider } from '@emotion/react';
import path from 'path';
import fs from 'fs/promises';
import createEmotionServer from '@emotion/server/create-instance';
import esbuild from 'esbuild';
import React, { FunctionComponent } from 'react';
import * as Server from 'react-dom/server';
import { cache, key } from '../shared/styleCache';

const { extractCritical } = createEmotionServer(cache);

/**
 * Use esbuild to transform a Typescript codebase into a browser JS module
 */
async function createBundle(scriptLocation: string) {
	const { outputFiles } = await esbuild.build({
		entryPoints: [scriptLocation],
		write: false,
		bundle: true,
		minify: true,
		sourcemap: false
	});
	return outputFiles
		.map(outputFile => new TextDecoder().decode(outputFile.contents))
		.join('\n')
		.replace('</script>', '</scr" + "ipt>');
}

/**
 * Use React SSR, emotion's cache and some other functions to generate a full HTML+CSS that hydrates itself.
 */
export async function createHtml(
	Component: FunctionComponent,
	props: Record<string, any> = {},
	scriptLocation: string
) {
	const element = React.createElement(
			CacheProvider,
			{ value: cache },
			React.createElement(Component, props)
		),
		emotion = extractCritical(Server.renderToString(element)),
		bundle = await createBundle(scriptLocation);

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
				window.hydrationData = ${JSON.stringify(props)};
				${bundle};
			</script>
		</html>
	`;
}

type BuildOptions = {
	AppComponent: FunctionComponent;
	scriptName: string;
	distLocation: string;
};

type SystemTools = {
	createPage: (path: string, data: Record<string, unknown>) => Promise<void>;
};

export async function createSite(
	{ AppComponent, scriptName, distLocation }: BuildOptions,
	callback: (tools: SystemTools) => Promise<void>
) {
	const systemTools: SystemTools = {
		createPage: async (url, data) => {
			await fs.mkdir(path.join(distLocation, url), { recursive: true });
			await Promise.all([
				// The page with precomputed HTML and its hydration data:
				fs.writeFile(
					path.join(distLocation, url, 'index.html'),
					await createHtml(AppComponent, data, scriptName)
				),
				// The hydration data to an AJAXable JSON:
				fs.writeFile(
					path.join(distLocation, url, 'data.json'),
					JSON.stringify(data, null, '\t')
				)
			]);
		}
	};

	console.time('Script duration');

	// Clean out the build location
	await fs.rmdir(distLocation, { recursive: true });
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

	console.timeEnd('Script duration');
}
