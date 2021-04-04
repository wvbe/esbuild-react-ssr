import path from 'path';
import { createSite } from './build/createPages';

import { App } from './client/App';

createSite(
	{
		AppComponent: App,
		scriptName: path.resolve(__dirname, 'client.ts'),
		distLocation: path.resolve(__dirname, 'dist')
	},
	async ({ createPage }) => {
		createPage('/nerf', { title: 'Hello world' });
	}
);
