'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

console.log('on init');

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('I fire');

  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      message: 'urlChanged',
      url: changeInfo.url,
    });
  }
});
