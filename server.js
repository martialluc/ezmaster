
// Ce fichier est le point d'entrée de l'application.
// Il permet de lancer le serveur web contenu dans la variable server.

/*jshint node:true, laxcomma:true*/
/*eslint global-require:"warn"*/

'use strict';

// To have docker messages with beautiful colors on console.
var kuler = require('kuler');

var heartbeats = require('heartbeats');

var instances = require('./helpers/instances');

// config : variable contenant tous les éléments de la configuration de l'application.
// start : fonction de callback définie un peu plus bas.
module.exports = function(config, start) {

  // Initialisation de la configuration de l'application avant le lancement du serveur web.
  config.set('theme', __dirname);
  config.set('timeout', 1E6);

  // Démarrage du serveur web.
  // Récupération d'une éventuelle erreur dans err.
  // Récupération du serveur web dans la variable server si ça s'est bien passé.
  start(function online(err, server) {

    // Use socket.io on the server.
    var io = require('socket.io').listen(server);

    io.sockets.on('connection', function (socket){

      // La liste référence des instances.
        var cacheInstances = {};

      // LE COEUR HEARTBEATS

        // Repeat every 1000 millisecond = every 1 second.
        var heart1 = heartbeats.createHeart(2000);

        // For infinite repeat we use {repeat : 0}.
        heart1.createEvent(1, {repeat : 0}, function(heartbeat, last){

          // Instructions effectuées à chaque battement du coeur Heartbeats.

            instances.getInstances(function(err,beatInstances){

              // S'il y a des différences entre les_instances de référence et celle tout juste récupérée dans data.
              // On actualise les_instances de référence avec cette nouvelle version.
              // On broadcast à tous les utilisateurs cette nouvelle version qui servira à mettre à jour la variable 'containers' dans template.html.
              if(!(JSON.stringify(cacheInstances) === JSON.stringify(beatInstances) )) {

                cacheInstances = beatInstances;
                socket.broadcast.emit('refreshInstances', beatInstances);

              }

            });

        });

    });



    if (err instanceof Error) {
      console.error(kuler('Unable to init the server.', 'red'), kuler(err.toString(), 'orangered'));
      process.exit(3);
      return;
    }
    var pack = config.get('package');
    if (pack) {
      console.info(kuler('App detected.', 'olive'), kuler(pack.name
        + ' ' + pack.version, 'limegreen'));
    }
    console.info(kuler('Server is listening.', 'olive'),  kuler(config.get('baseURL')
      + '/', 'limegreen'));

  });
};