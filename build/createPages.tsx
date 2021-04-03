import esbuild from 'esbuild';
import React, { FunctionComponent } from 'react';
import * as Server from 'react-dom/server';

function html(htmls: TemplateStringsArray, ...lots: string[]) {
	return htmls.reduce((flat, html, i) => {
		return flat + html.replace(/\n\t*/g, '') + (lots[i] || '');
	}, '');
}

async function createBundle(scriptLocation: string) {
	const { outputFiles } = await esbuild.build({
		entryPoints: [scriptLocation],
		// outfile: 'dist/main.js',
		write: false,

		bundle: true,
		minify: true,
		sourcemap: false
		// target: ['chrome58', 'firefox57', 'safari11', 'edge16']
	});

	return new TextDecoder().decode(outputFiles[0].contents);
}

export async function createHtml(
	Component: FunctionComponent,
	props: Record<string, any> = {},
	scriptLocation: string
) {
	return html`
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<style></style>
			</head>
			<body>
				<div id="container">
					${Server.renderToString(React.createElement(Component, props))}
				</div>
			</body>
			<script type="text/javascript">
				${(await createBundle(scriptLocation)).replace('</script>', '</scr" + "ipt>')};
			</script>
		</html>
	`;
}
