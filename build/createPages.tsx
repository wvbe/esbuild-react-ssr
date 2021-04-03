import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import esbuild from 'esbuild';
import React, { FunctionComponent } from 'react';
import * as Server from 'react-dom/server';
import { cache, key } from '../shared/styleCache';

const { extractCritical } = createEmotionServer(cache);

/**
 * Template string function to "minify" HTML strings that are formatted with newlines and indentation in JS
 */
function html(htmls: TemplateStringsArray, ...lots: string[]) {
	return htmls.reduce((flat, html, i) => flat + html.replace(/\n\t*/g, '') + (lots[i] || ''), '');
}

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
	const textDecoder = new TextDecoder();
	return outputFiles
		.map(outputFile => textDecoder.decode(outputFile.contents))
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

	return html`
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
				${bundle};
			</script>
		</html>
	`;
}
