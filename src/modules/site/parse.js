import verify from './verify.js';

function parse(nodes, type, data) {
  switch (type) {
    case 'tweets':
      nodes.forEach((tweet) => {
        tweet.classList.add('legacy-checked');

        const author = tweet.lastChild
          .querySelector('span')
          .textContent.substring(1);

        if (verify(data, author, 1)) {
          tweet.firstChild.classList.add('legacy-verified');
        }
      });

      break;
    case 'user':
      const userData = JSON.parse(nodes.textContent);
      const userNameNode = document.querySelector('[data-testid="UserName"]');

      if (userNameNode && userData) {
        nodes.classList.add('legacy-checked');

        const author = userData.author.identifier.toString();

        if (verify(data, author, 0)) {
          userNameNode.querySelector('span').classList.add('legacy-verified');
        }
      }

      console.log();
      break;
    case 'card':
      const link = nodes.querySelector('a:not([tabindex="-1"])');

      if (link) {
        nodes.classList.add('legacy-checked');

        const author = link.getAttribute('href').substring(1);

        if (verify(data, author, 1)) {
          link.querySelector('div').classList.add('legacy-verified');
        }
      }

      break;
    case 'cell':
      nodes.forEach((cell) => {
        cell.classList.add('legacy-checked');
        const link = cell.querySelector('a:not([aria-hidden="true"])');

        if (link) {
          const author = link.getAttribute('href').substring(1);

          if (verify(data, author, 1)) {
            link.querySelector('div').classList.add('legacy-verified');
          }
        } else {
          // This is most likely a search node.
          const span = cell.querySelector('div[aria-label="Remove"]')
            ?.parentNode?.firstChild;

          if (span) {
            const author = span
              .querySelector('div[tabindex="-1"] span')
              ?.textContent.substring(1);

            if (verify(data, author, 1)) {
              const container =
                span.querySelector('div[dir="ltr"]')?.parentNode;

              container.classList.add('legacy-verified');
            }
          }
        }
      });
      break;
    default:
      console.log('No type specified');
      break;
  }
}

export default parse;
