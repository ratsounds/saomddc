/**
 * capture.js is node module for multi-column screenshot.
 * this script takes full size screenshot from given url and wrapped it by max_height px.
 * this script require puppeteer and jimp.
 */

const puppeteer = require('puppeteer');
const Jimp = require("jimp");

/**
 * get a full size screenshot from given url as multi column image.
 * @param {string} url - target url
 * @param {string} file - file path for output image
 * @param {number} src_width - width for source screenshot
 * @param {number} max_height - max height of screenshot
 * @param {number} overrap - overrap pixel size for each column
 */
async function capture(url, file, src_width, max_height, overrap) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: src_width, height: src_width });
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: file, fullPage: true });
  await browser.close();
  await convertIntoMultiColumn(file, file, max_height, overrap);
}
/**
 * convert vertically long image into multi column image.
 * @param {string} src_path - file path for source image
 * @param {string} dst_path - file path for destination image
 * @param {number} max_height - height of destination image
 * @param {number} overrap - overrap pixel size for each column
 * @return {Promise} this function returns promise with Jimp image object of destination
 */
function convertIntoMultiColumn(src_path, dst_path, max_height, overrap) {
  return new Promise((resolve, reject) => {
    Jimp.read(src_path, (err, src) => {
      if (err) { reject(err) }
      let w = 0;
      let h = Math.min(max_height,src.bitmap.height);
      let cy = 0;
      let lines = [];
      while (cy < src.bitmap.height) {
        lines.push({
          dx: w,
          sy: cy
        })
        w += src.bitmap.width;
        cy += max_height - overrap;
      }
      new Jimp(w, h, (err, dst) => {
        if (err) { reject(err) }
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          dst.blit(src, line.dx, 0, 0, line.sy, src.bitmap.width, max_height);
        }
        dst.write(dst_path, (err) => {
          if (err) { reject(err) }
          resolve(dst);
        })
      });
    });
  });
}

module.exports = capture;
