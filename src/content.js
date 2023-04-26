'use strict';
import Papa from 'papaparse';

import loader from './modules/site/loader.js';
import styler from './modules/site/styler.js';
import watcher from './modules/site/mutation.js';

// import scrape from './modules/site/scrape.js';
// import parse from './modules/site/parse.js';

import assets from './modules/site/assets.js';
import inject from './modules/site/inject.js';

async function init() {
  let data = await loader();

  inject(assets, data);

  watcher(() => {
    const nodes = document.querySelectorAll(
      'img[src*="legacy-verified"]:not(.legacy-checked)'
    );
    nodes.forEach((node) => {
      node.classList.add('legacy-checked');

      const link = node
        .closest('article')
        .querySelector('[data-testid="User-Name"] > div');

      if (link) {
        link.classList.add('legacy-verified');
      }
    });
  });
}

// async function init() {
//   const data = await loader();

//   watcher(() => {
//     scrape((nodes, type) => {
//       parse(nodes, type, data);
//     });
//   });
// }

init();
