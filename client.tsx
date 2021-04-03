import * as React from 'react';
import * as Server from 'react-dom/server';
import { App } from './client/App';
let Greet = () => <h1>Hello, world!</h1>;

console.log('Running client.tsx');
console.log(
	Server.renderToString(
		<App>
			<Greet />
		</App>
	)
);
