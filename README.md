# <img src="public/icons/icon_48.png" width="45" align="left"> Legacy Verified

The Legacy Verified browser extension enables people to add a <strike>green</strike> purple verified logo next to names of accounts on Twitter that were previously verified. Uses data provided by [Travis Brown](https://github.com/travisbrown) and initiated by [Oliver Alexander](https://twitter.com/OAlexanderDK).

## Features

- Adds purple badges to nearly all existing locations on the site
- Verifies a users profile page using their *user_id*
- Uses *screen_name* as verification methods on all other locations due to lack of embedded *user_id* for timelines and status pages

## Install

Currently, installation requires you to:

- Clone or download this repository
- Run `npm install` inside the main folder
- Run `npm run repack` inside the main folder
- Navigate to your [extension page](chrome://extensions) in Chrome
- Apply _Developer Mode_ in the top right, and click on _Load unpacked_
- Upload the contents of the `/build/` folder

## Contribution

Suggestions and pull requests are welcomed. This is a work in progress.



## Acknowledgements

- Dataset has been provided by [Travis Brown](https://github.com/travisbrown)
- Concept initiated by [Oliver Alexander](https://twitter.com/OAlexanderDK)
- This project was bootstrapped with [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli)

## License

This project is licensed under the [MIT license](./LICENSE)