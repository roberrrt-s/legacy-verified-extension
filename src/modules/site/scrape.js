function scrape(callback) {
  const tweets = document.querySelectorAll(
    '[data-testid="User-Name"]:not(.legacy-checked)'
  );

  const scheme = document.querySelector(
    'script[type="application/ld+json"]:not(.legacy-checked)'
  );

  const card = document.querySelector(
    '[data-testid="HoverCard"] > div:not(.legacy-checked) '
  );

  const cell = document.querySelectorAll(
    '[data-testid="UserCell"]:not(.legacy-checked)'
  );

  if (tweets.length > 0) {
    callback(tweets, 'tweets');
  }

  if (scheme) {
    callback(scheme, 'user');
  }

  if (card) {
    callback(card, 'card');
  }

  if (cell.length > 0) {
    callback(cell, 'cell');
  }
}

export default scrape;
