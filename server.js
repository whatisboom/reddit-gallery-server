var config = require('./app/config');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var rawjs = require('raw.js');
var reddit = new rawjs('reddit-gallery/0.0.1 by /u/whatisboom');


var port = 8080;

var router = express.Router();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

router.get('/oauth', function(req, res) {

    reddit.setupOAuth2(config.reddit.clientId, config.reddit.secret, config.reddit.redirectUri);

    var url = reddit.authUrl('dev', ['identity']);

    res.json({ url: url });
});

app.use(router);
app.listen(port);
console.log('Running on port: ' + port);