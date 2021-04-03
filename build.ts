const esbuild = require('esbuild');

(async () => {
	console.time('esbuild...');

	await esbuild.build({
		entryPoints: ['client.tsx'],
		outfile: 'dist/main.js',

		bundle: true,
		minify: true,
		sourcemap: true
		// target: ['chrome58', 'firefox57', 'safari11', 'edge16']
	});

	console.timeEnd('esbuild...');
})();
