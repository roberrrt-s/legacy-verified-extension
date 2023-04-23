function watcher(callback) {
  const observer = new MutationObserver(callback);
  const options = {
    childList: true,
    subtree: true,
  };

  observer.observe(document.body, options);
}

export default watcher;
