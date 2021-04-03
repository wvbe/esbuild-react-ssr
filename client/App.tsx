import React, { FunctionComponent } from 'react';

export const App: FunctionComponent = ({ children }) => {
	return (
		<div>
			<h1>nerf</h1>
			{children}
		</div>
	);
};
