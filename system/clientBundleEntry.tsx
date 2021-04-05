/**
 * This is the client-side Javascript module entry file. The website-specific code starts in ../client/index, whose
 * only requirement is that it default exports a React FunctionComponent.
 */
import { CacheProvider } from '@emotion/react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { hydrate } from 'react-dom';
import App from '../client/index';
import { cache } from './styleCache';

function findClosestAncestor(el: Element | null, match: (el: Element) => boolean) {
	while (el && !match(el)) {
		el = el.parentElement;
	}
	return el;
}
function targetIsExternal(target: string | null) {
	return (
		target &&
		(target.startsWith('http://') || target.startsWith('https://') || target.startsWith('//'))
	);
}

const Router: FunctionComponent = ({ children }) => {
	const [hydrationData, setHydrationData] = useState(
		(window as WindowWithHydrationData).$$$r.hydration
	);

	useEffect(() => {
		window.addEventListener('click', e => {
			const anchorElement = findClosestAncestor(
				e.target as Element,
				el =>
					el.nodeName.toLowerCase() === 'a' && !targetIsExternal(el.getAttribute('href'))
			);

			if (!anchorElement) {
				return;
			}

			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			const target = (e.target as Element)?.getAttribute('href');
			console.log('Internal hyperlink cancelled:', target);
			fetch(target + '/data.json', { cache: 'force-cache' })
				.then(response => response.json())
				.then(data => {
					window.history.pushState(data, 'Nerfs!', target);
					setHydrationData(data);
				})
				.catch(e => {
					console.error(`Navigation to "${target}" stopped: ${e.message}`);
				});
		});
	}, []);

	return <App {...hydrationData} />;
};

type WindowWithHydrationData = Window &
	typeof globalThis & {
		$$$r: {
			hydration: typeof App extends FunctionComponent<infer P> ? P : unknown;
		};
	};

hydrate(
	<CacheProvider value={cache}>
		<Router />
	</CacheProvider>,
	window.document.getElementById('container')
);
