'use strict';

// With background scripts you can communicate with popup
// and content files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
let latestUrl = '';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  latestUrl = changeInfo.url ? changeInfo.url : latestUrl;

  if (latestUrl && changeInfo.status === 'complete') {
    chrome.tabs
      .sendMessage(tabId, {
        message: 'urlChanged',
        url: latestUrl,
      })
      .catch((error) => {
        return;
      });
  }
});
