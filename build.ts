/**
 *
 * This file contains the NodeJS-side of things.
 *
 */

import { createSite } from './system/createPages';

createSite(
	{
		distLocation: 'dist'
	},
	async ({ createPage }) => {
		await createPage('/', { title: 'This is the landing page' });
		await createPage('/nerf', { title: 'This is the NERF page' });
		await createPage('/derp', { title: 'This is the DERP page' });
	}
);
