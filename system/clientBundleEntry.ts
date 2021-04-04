/**
 * This is the client-side Javascript module entry file. The website-specific code starts in ../client/index, whose
 * only requirement is that it default exports a React FunctionComponent.
 *
 * @TODO Use emotion CacheProvider, probably. For some reason, shit already works.
 *   https://emotion.sh/docs/ssr
 */
import { createElement, FunctionComponent } from 'react';
import { hydrate } from 'react-dom';

import App from '../client/index';

type WindowWithHydrationData = Window &
	typeof globalThis & {
		$$$r: {
			hydration: typeof App extends FunctionComponent<infer P> ? P : unknown;
		};
	};

hydrate(
	createElement(App, (window as WindowWithHydrationData).$$$r.hydration),
	window.document.getElementById('container')
);
