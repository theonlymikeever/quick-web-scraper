const download = require('./lib/download');
const cheerio = require('cheerio');
const rp = require('request-promise');

const progressLog = state => console.log('progress', state);
const responseLog = res => console.log('status code', res.statusCode);
const errorLog = error => console.log('error', error);
const doneLog = () => console.log('done');

const logs = [progressLog, responseLog, errorLog, doneLog];

const options = {
  uri: `https://www.mikekerslake.com/`,
  transform: function(body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then($ => {
    $('img').each((idx, el) => {
      const src = el.attribs.src.slice(1);
      const split = src.split('/');
      const filename = `./download/${split[split.length - 1]}`;
      const fileUri = `${options.uri}${src}`;
      download(fileUri, filename, ...logs);
    });
  })
  .catch(err => {
    console.log(err);
  });
