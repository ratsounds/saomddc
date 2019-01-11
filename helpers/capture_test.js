const capture = require('./capture.js');
/**
 * get a full size screenshot from given url as multi column image.
 * @param {string} url - target url
 * @param {string} file - file path for output image
 * @param {number} src_width - width for source screenshot
 * @param {number} max_height - max height of screenshot
 * @param {number} overrap - overrap pixel size for each column
 */
capture(
  'https://api-defrag.wrightflyer.net/webview/announcement-detail?id=490703&phone_type=2',
  'info.png',
  1024,
  4096,
  32
);
