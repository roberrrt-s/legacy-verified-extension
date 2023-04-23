import Papa from 'papaparse';
import assets from './assets';

async function loader() {
  return new Promise((resolve, reject) => {
    Papa.parse(assets.dataUrl, {
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export default loader;
