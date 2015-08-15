var config = require('./app/config');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var morgan = require('morgan');

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

router.use(morgan('tiny'));

router.route('/oauth')
.get(function(req, res) {

  reddit.setupOAuth2(config.reddit.clientId, config.reddit.secret, config.reddit.redirectUri);

  var url = reddit.authUrl('dev', ['identity'], true);

  res.json({ url: url });
})
.post(function(req, res) {
  var code = req.body.code;

  reddit.auth({ code: code }, function(err, auth) {
    if (err) {
      cosole.log('auth failure: ' + err);
      res.status(500).json({err: err});
    }
    else {
      reddit.refreshToken = auth.refreshToken;
      reddit.me(function(err, user) {
        res.json({
          auth: auth,
          user: user
        });
      });
    }
  });
});

router.route('/posts/:subreddit')
.get(function(req, res) {
  reddit.hot({
    r: req.params.subreddit,
    limit: 100
  }, function(err, response) {
    if (err) {
      res.status(500).json({err: err});
    }
    else {
      res.json(response);
    }
  })
});

app.use(router);
app.listen(port);
console.log('Running on port: ' + port);