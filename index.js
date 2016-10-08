/**
 * EzMaster entrypoint
 */

/*eslint global-require:"warn"*/
'use strict';

var cfg   = require('./lib/config.js');
var kuler = require('kuler');

var express = require('express');
var app    = express();
var server = require('http').Server(app);
var io     = require('socket.io')(server);

// load routes and middleware
app.use(require('./middlewares/reverse-proxy.js'));
app.use(express.static('public'));
app.use('/', require('./routes/v1.js'));

// load socket.io connections
// TODO: gérer le multi-utilisateur car la on ne communique qu'au dernier client  
io.on('connection', function (socket) {
  cfg.socket = socket;
});

server.listen(cfg.EZMASTER_PORT, function (err) {
  console.info(kuler(cfg.package.name + ' ' + cfg.package.version + ' is listening.', 'olive'));
  console.info(kuler(cfg.baseURL + '/', 'limegreen'));
});

// periodical background task
var heartbeats = require('heartbeats');
var heart = heartbeats.createHeart(1000);
heart.createEvent(5, require('./lib/event-refresh-infos-machine.js'));
heart.createEvent(2, require('./lib/event-refresh-instances.js'));