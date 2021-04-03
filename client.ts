import { createElement } from 'react';
import { hydrate } from 'react-dom';
import { App } from './client/App';


// @TODO Use emotion CacheProvider
//   https://emotion.sh/docs/ssr
//   For some reason, shit already works
hydrate(createElement(App), window.document.getElementById('container'));
