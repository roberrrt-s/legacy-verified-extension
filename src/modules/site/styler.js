import assets from './assets';

function styler() {
  if (!document.querySelector('[data-legacy="verified"]')) {
    console.log('inserting style');
    document.head.insertAdjacentHTML(
      'beforeend',
      `<style data-legacy="verified">.legacy-verified {padding-right: 0} .legacy-verified::after {content:' '; display: inline-block; margin-left: .15em; height: 20px; width: 20px; aspect-ratio: 1/1; background-image: url(${assets.imageUrl}); background-size: contain; background-repeat: no-repeat; background-position: top;}</style>`
    );
  }
}

export default styler();
