var config = require('./app/config');
var rawjs = require('raw.js');
var reddit = new rawjs('reddit-gallery/0.0.1 by /u/whatisboom');
reddit.setupOAuth2(config.reddit.clientId, config.reddit.secret, config.reddit.redirectUri);

var url = reddit.authUrl('dev', ['identity']);

console.log(url);