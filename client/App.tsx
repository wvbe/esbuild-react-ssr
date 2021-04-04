import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from '@emotion/styled';

const StyledComponentTest = styled.div<{ nerfs: boolean }>`
	font-style: italic;
	${({ nerfs }) =>
		nerfs
			? `
				font-weight: bold;
			`
			: null}
`;

export const App: FunctionComponent = ({ title }) => {
	const [isNerfs, setIsNerfs] = useState(false);
	useEffect(() => {
		console.log('React has started');
	}, []);
	return (
		<div>
			<button onClick={() => setIsNerfs(!isNerfs)}>Flip nerf</button>
			<StyledComponentTest nerfs={isNerfs}>
				Status: {isNerfs ? 'Nerfing' : 'Not nerfing'}
			</StyledComponentTest>
			<b>TITLE</b>
			{title}
		</div>
	);
};
