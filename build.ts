import { createHtml } from './build/createPages';
import { App } from './client/App';

(async () => {
	const html = await createHtml(App, {}, 'client.tsx');
	console.log(html);
})();
