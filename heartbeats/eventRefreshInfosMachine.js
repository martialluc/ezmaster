
/*
'use strict';

var heartbeats = require('heartbeats');
var instances = require('./instances');
var os = require('os');
var filesize = require('filesize');



module.exports.heartRefreshInstances = function (socket) {

  // Caching the instances list to have a reference for comparisons to come.
  var cacheInstances = {};

  // THE HEARTBEATS HEART : This one refreshes the instances list on table.js component.

  // Repeat every 5000 milliseconds = every 5 seconds.
  var heart1 = heartbeats.createHeart(5000);

  // For infinite repeat we use {repeat : 0}.
  heart1.createEvent(1, {repeat : 0}, function(heartbeat, last) {

    // Instructions done on each heart beat.

    // Debug
    // console.log("########## BEAT HEART 1 ! ##########");

    // false for instancesChangesBool because here, we just need to get the getInstances() cache.
    instances.getInstances(false, function(err, beatInstances) {

      if (err) { return new Error(err); }

      // If there are some differences between cacheInstances (reference)
      // and beatInstances (just get) :
      // Update cacheInstances with beatInstances.
      // Broadcast to all clients this new version to update
      // the 'containers' variable in template.html and refresh the table.js component.
      if (!(JSON.stringify(cacheInstances) === JSON.stringify(beatInstances))) {

        cacheInstances = beatInstances;
        socket.broadcast.emit('refreshInstances', beatInstances);

      }

    });
  });
};


module.exports.heartRefreshInfosMachine = function (socket) {

  // THE HEARTBEATS HEART : This one refreshes machine information
  // on infosMachine.js component.

  // Repeat every 1000 milliseconds = every 1 seconds.
  var heart2 = heartbeats.createHeart(1000);

  // For infinite repeat we use {repeat : 0}.
  heart2.createEvent(1, {repeat : 0}, function(heartbeat, last) {

    // Instructions done on each heart beat.

    // Debug
    // console.log("########## BEAT HEART 2 ! ##########");

    // Getting machine information we want to display.
    var infosMachine = {};

    // Returns an array containing the 1, 5, and 15 minutes load averages.
    infosMachine.loadAverage = os.loadavg();

    // Trunc loadAverage values.
    var numberOfDecimalNumbers = 2;
    infosMachine.loadAverage[0] = infosMachine.loadAverage[0].toFixed(numberOfDecimalNumbers);
    infosMachine.loadAverage[1] = infosMachine.loadAverage[1].toFixed(numberOfDecimalNumbers);
    infosMachine.loadAverage[2] = infosMachine.loadAverage[2].toFixed(numberOfDecimalNumbers);

    // os.totalmem() returns the total amount of system memory in bytes.
    infosMachine.totalMemory = filesize(os.totalmem());
    // os.freemem() returns the amount of free system memory in bytes.
    infosMachine.freeMemory = filesize(os.freemem());

    // Broadcast to all users the machine information.
    //They are caught and displayed on template.html inside infosMachineTable.js component.
    socket.broadcast.emit('refreshInfosMachine', infosMachine);

    // When we come on the web page, while testing in local,
    //machine info are not displayed, we have to refresh the page for that.
    // In local, our pc is the server.
    //The emit.broadcast sends a message to ALL clients except the sender,
    //so our pc doesn't receive the message because it sends it.
    // On the vilodex, obviously no issue because the server broadcast
    //to all clients and our pc is not the sender so it receives the message.
    // To solve this local testing problem we add a simple emit which sends
    //a message to all clients.
    // As a consequence, this line can be commented when the code is deployed on the vilodex.
    socket.emit('refreshInfosMachine', infosMachine);

  });
};

*/




'use strict';

var os = require('os');
var filesize = require('filesize');
var path = require('path');
var basename = path.basename(__filename, '.js');
var debug = require('debug')('castor:heartbeat:' + basename);

module.exports = function(options, core) {
  options = options || {};

  // At the launch
  console.log('########## LAUNCH HEART REFRESH INFOS MACHINE ##########');


  var socket;

  // At each beat
  return function (heartbeat, last) {

    console.log('########## BEAT HEART REFRESH INFOS MACHINE ##########');

    if (!socket) {
      socket = core.config.get('socket');

      if (!socket) {
        console.log('########## NO SOCKET ##########');
        return;
      }
    }


    // THE HEARTBEATS HEART : This one refreshes machine information
    // on infosMachine.js component.

    // Getting machine information we want to display.
        var infosMachine = {};

        // Returns an array containing the 1, 5, and 15 minutes load averages.
        infosMachine.loadAverage = os.loadavg();

        // Trunc loadAverage values.
        var numberOfDecimalNumbers = 2;
        infosMachine.loadAverage[0] = infosMachine.loadAverage[0].toFixed(numberOfDecimalNumbers);
        infosMachine.loadAverage[1] = infosMachine.loadAverage[1].toFixed(numberOfDecimalNumbers);
        infosMachine.loadAverage[2] = infosMachine.loadAverage[2].toFixed(numberOfDecimalNumbers);

        // os.totalmem() returns the total amount of system memory in bytes.
        infosMachine.totalMemory = filesize(os.totalmem());
        // os.freemem() returns the amount of free system memory in bytes.
        infosMachine.freeMemory = filesize(os.freemem());

    // Broadcast to all users the machine information.
    //They are caught and displayed on template.html inside infosMachineTable.js component.
    socket.broadcast.emit('refreshInfosMachine', infosMachine);

    // When we come on the web page, while testing in local,
    //machine info are not displayed, we have to refresh the page for that.
    // In local, our pc is the server.
    //The emit.broadcast sends a message to ALL clients except the sender,
    //so our pc doesn't receive the message because it sends it.
    // On the vilodex, obviously no issue because the server broadcast
    //to all clients and our pc is not the sender so it receives the message.
    // To solve this local testing problem we add a simple emit which sends
    //a message to all clients.
    // As a consequence, this line can be commented when the code is deployed on the vilodex.
    socket.emit('refreshInfosMachine', infosMachine);






  };
};

