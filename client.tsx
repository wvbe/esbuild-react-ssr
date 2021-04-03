import { createElement } from 'react';
import { hydrate } from 'react-dom';
import { App } from './client/App';

console.log('Hydrating React');
hydrate(createElement(App), window.document.getElementById('container'));
