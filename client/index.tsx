/**
 * This is the entry file of client-side React code.
 *
 * The only requirement is that the default export is a FunctionComponent. This component will be instantiated with the
 * `props` argument given to `createPage` during `createSite`.
 */

import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css, Global } from '@emotion/react';

import jesusVaccinatesImage from '../assets/pizza.png';

const globalStyles = css`
	body {
		font-family: sans-serif;
	}
	li {
		margin-bottom: 1em;
	}
`;

const Label = styled.div`
	font-weight: bold;
	margin-right: 0.2em;
`;

const StyledComponentTest = styled.span<{ nerfs: boolean }>`
	font-style: italic;
	background-color: ${({ nerfs }) => (nerfs ? 'red' : 'transparent')};
`;

const App: FunctionComponent<{ title: string }> = ({ title }) => {
	// This shows up in your browser console as soon as the React component is mounted:
	useEffect(() => console.log('✅ React has started'), []);

	// A test to assert that Emotion is mounted correctly and can apply styles (based on state) that were not in the
	//   precompiled CSS.
	const [isNerfs, setIsNerfs] = useState(false);

	return (
		<>
			<Global styles={globalStyles} />
			<ul>
				<li>
					<Label>Navigation test: </Label>
					<a href=".">Go /</a>, <a href="nerf">Go /nerf</a>, <a href="derp">Go /derp</a>,{' '}
					<a href="nerf/index.html">Go /nerf/index.html</a>,{' '}
					<a href="derp/index.html">Go /derp/index.html</a>,{' '}
					<a href="//wybe.pizza">Go external</a>
				</li>
				<li>
					<Label>Style test:</Label>
					<button onClick={() => setIsNerfs(!isNerfs)}>Flip</button>
					<StyledComponentTest nerfs={isNerfs}>
						{isNerfs ? 'This text should have a red background' : 'Flip me!'}
					</StyledComponentTest>
				</li>
				<li>
					<Label>Page data test:</Label>
					{title}
				</li>
				<li>
					<Label>Asset test:</Label>
					<img src={jesusVaccinatesImage} />
				</li>
			</ul>
		</>
	);
};

export default App;
