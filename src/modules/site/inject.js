function inject(assets, data) {
  let s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = false;
  s.src = assets.hookUrl;
  document.documentElement.appendChild(s);
  s.onload = function () {
    this.remove();
    window.dispatchEvent(new CustomEvent('transferData', { detail: data }));
  };
}

export default inject;
