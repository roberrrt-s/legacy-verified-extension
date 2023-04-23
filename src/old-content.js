'use strict';

import Papa from 'papaparse';
import * as mutation from './modules/site/mutation.js';

// Import assets from src/assets
const url = chrome.runtime.getURL('legacy-verified.csv');
const imageUrl = chrome.runtime.getURL('icons/icon_128.png');

// TODO: Make this less hacky.
let data = [];
let previousUrl = '';
let isScraping, checkingForLoadedPage, isScrapingHome;

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
    clearInterval(isScraping);
    clearInterval(checkingForLoadedPage);
    clearInterval(isScrapingHome);
    previousUrl = request.url;
    scrapePage();
  }
});

// Check if we loaded the file.
if (url) {
  Papa.parse(url, {
    download: true,
    dynamicTyping: true,
    complete: (results) => {
      data = results.data;
      scrapePage();
    },
  });
} else {
  url = chrome.runtime.getURL('legacy-verified.csv');
}

function scrapeHome() {
  if (!document.querySelector('[data-legacy="verified"]')) {
    document.head.insertAdjacentHTML(
      'beforeend',
      `<style data-legacy="verified">.legacy-verified {padding-right: 0} .legacy-verified::after {content:' '; display: inline-block; margin-left: .15em; height: 20px; width: 20px; aspect-ratio: 1/1; background-image: url(${imageUrl}); background-size: contain; background-repeat: no-repeat; background-position: top;}</style>`
    );
  }

  isScrapingHome = setInterval(() => {
    const profiles = document.querySelectorAll(
      '[data-testid="User-Name"]:not(.legacy-checked)'
    );

    profiles.forEach((name) => {
      name.classList.add('legacy-checked');

      const link = name.querySelector('a');

      if (link) {
        const match = data.find((row) => {
          return row[1].toString() === link.getAttribute('href').substring(1);
        });
        if (match) {
          const container = name.querySelector('a > *');

          if (container) {
            container.classList.add('legacy-verified');
          }
        }
      }
    });
  }, 1000);
}

function scrapePage() {
  // Let's find out if we're on the homepage first.
  if (
    window.location.pathname.split('/')[1] === 'home' ||
    window.location.pathname.split('/')[2] === 'status'
  ) {
    scrapeHome();
    return;
  }

  let tries = 1;
  isScraping = setInterval(() => {
    const scheme = document.querySelector('script[type="application/ld+json"]');

    if (scheme) {
      const userData = JSON.parse(scheme.textContent);
      clearInterval(isScraping);
      findMatchForVerifiedUser(userData.author.identifier.toString(), 0);
    }
    tries++;

    if (tries > maxTries) {
      clearInterval(isScraping);
    }
  }, 500);
}

// Check if we can find the user on the profile page.
function findMatchForVerifiedUser(id, type) {
  const match = data.find((row) => {
    return row[type].toString() === id;
  });

  if (match) {
    waitForLoadedPage();
  }
}

function waitForLoadedPage() {
  let tries = 1;
  checkingForLoadedPage = setInterval(() => {
    let userNameNode = document.querySelector('[data-testid="UserName"]');

    if (userNameNode) {
      clearInterval(checkingForLoadedPage);
      addVerifiedLogo(userNameNode);
    }
  }, 500);
  tries++;

  if (tries > maxTries) {
    clearInterval(checkingForLoadedPage);
  }
}

function addVerifiedLogo(node) {
  node.querySelector('span').classList.add('legacy-verified');
}