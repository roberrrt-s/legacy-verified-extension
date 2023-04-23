'use strict';

import './style/style.css';

document.addEventListener('DOMContentLoaded', () => {
  const link = document.querySelector('a');

  link.addEventListener('click', () => {
    chrome.tabs.create({ active: true, url: link.href });
  });
});
