'use strict';

import Papa from 'papaparse';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
const url = chrome.runtime.getURL('legacy-verified.csv');
let data = [];
let previousUrl = '';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // listen for messages sent from background.js

  console.log('previous URL', previousUrl);
  console.log('current URL', request.url);

  if (
    request.message === 'urlChanged' &&
    data.length > 0 &&
    previousUrl !== request.url
  ) {
    previousUrl = request.url;
    findMatchForVerifiedUser();
  }
});

if (url) {
  Papa.parse(url, {
    download: true,
    dynamicTyping: true,
    complete: (results) => {
      data = results.data;
      findMatchForVerifiedUser();
    },
  });
}

function findMatchForVerifiedUser() {
  const userName = window.location.pathname.split('/')[1];

  setInterval(() => {
    const scheme = document.querySelector('script[type="application/ld+json"]');

    if (scheme) {
      const userData = JSON.parse(scheme.textContent);
      console.log(userData.author.identifier);
    }
  }, 1000);

  console.log('finding match for ' + userName);

  const found = data.find((row) => {
    if (typeof row[1] === 'string' && typeof userName === 'string') {
      return row[1].toLowerCase() === userName.toLowerCase();
    } else {
      return row[1] === userName;
    }
  });

  if (found) {
    console.log('we found him!');
    waitForLoadedPage();
  } else {
    console.log('not found');
  }
}

function waitForLoadedPage() {
  const checkForLoadedPage = setInterval(() => {
    let userNameNode = document.querySelector('[data-testid="UserName"]');

    if (userNameNode) {
      clearInterval(checkForLoadedPage);

      addVerifiedLogo(userNameNode);
    } else {
      console.log('continue loading...');
    }
  }, 500);
}

function addVerifiedLogo(node) {
  const imageUrl = chrome.runtime.getURL('icons/icon_128.png');

  document.head.insertAdjacentHTML(
    'beforeend',
    `<style>.legacy-verified {padding-right: 0} .legacy-verified::after {content:' '; display: inline-block; margin-left: .15em; height: 20px; width: 20px; aspect-ratio: 1/1; background-image: url(${imageUrl}); background-size: contain; background-repeat: no-repeat; background-position: top;}</style>`
  );
  node.querySelector('span').classList.add('legacy-verified');
}
