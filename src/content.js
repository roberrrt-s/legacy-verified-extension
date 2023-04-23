'use strict';

import loader from './modules/site/loader.js';
import styler from './modules/site/styler.js';
import watcher from './modules/site/mutation.js';
import scrape from './modules/site/scrape.js';
import parse from './modules/site/parse.js';

async function init() {
  const data = await loader();

  scrape((nodes, type) => {
    parse(nodes, type, data);
  });

  watcher(() => {
    scrape((nodes, type) => {
      parse(nodes, type, data);
    });
  });
}

init();
