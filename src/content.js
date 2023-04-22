'use strict';

import Papa from 'papaparse';

// Import assets from src/assets
const url = chrome.runtime.getURL('legacy-verified.csv');
const imageUrl = chrome.runtime.getURL('icons/icon_128.png');

// TODO: Make this less hacky.
let data = [];
let previousUrl = '';
const maxTries = 10;

// Listen for URL changes in the background script, since Twitter uses React and page refreshes are not triggered
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Check whether the style tag is already added to the DOM.
  if (!document.querySelector('[data-legacy="verified"]')) {
    document.head.insertAdjacentHTML(
      'beforeend',
      `<style data-legacy="verified">.legacy-verified {padding-right: 0} .legacy-verified::after {content:' '; display: inline-block; margin-left: .15em; height: 20px; width: 20px; aspect-ratio: 1/1; background-image: url(${imageUrl}); background-size: contain; background-repeat: no-repeat; background-position: top;}</style>`
    );
  }

  if (
    request.message === 'urlChanged' &&
    data.length > 0 &&
    previousUrl !== request.url
  ) {
    previousUrl = request.url;
    scrapeProfile();
  }
});

// Check if we loaded the file.
if (url) {
  Papa.parse(url, {
    download: true,
    dynamicTyping: true,
    complete: (results) => {
      data = results.data;
      scrapeProfile();
    },
  });
} else {
  url = chrome.runtime.getURL('legacy-verified.csv');
}

function scrapeProfile() {
  let tries = 1;
  const scraping = setInterval(() => {
    const scheme = document.querySelector('script[type="application/ld+json"]');

    if (scheme) {
      const userData = JSON.parse(scheme.textContent);
      clearInterval(scraping);
      findMatchForVerifiedUser(userData.author.identifier.toString());
    }
    tries++;

    if (tries > 9) {
      clearInterval(scraping);
    }
  }, 500);
}

// Check if we can find the user on the profile page.
function findMatchForVerifiedUser(id) {
  const match = data.find((row) => {
    return row[0].toString() === id;
  });

  if (match) {
    waitForLoadedPage();
  }
}

function waitForLoadedPage() {
  let tries = 1;
  const checkForLoadedPage = setInterval(() => {
    let userNameNode = document.querySelector('[data-testid="UserName"]');

    if (userNameNode) {
      clearInterval(checkForLoadedPage);
      addVerifiedLogo(userNameNode);
    }
  }, 500);
  tries++;

  if (tries > 9) {
    clearInterval(checkForLoadedPage);
  }
}

function addVerifiedLogo(node) {
  node.querySelector('span').classList.add('legacy-verified');
}
