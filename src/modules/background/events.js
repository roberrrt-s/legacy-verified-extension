export default function events() {
  (function () {
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
  })();
}
