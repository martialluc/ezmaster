'use strict';

// to allow mongodb host and port injection thanks
// to the EZMASTER_MONGODB_HOST_PORT environment parameter
// (docker uses it)
var mongoHostPort = process.env.EZMASTER_MONGODB_HOST_PORT || 'localhost:27017';
var publicDomain  = process.env.EZMASTER_PUBLIC_DOMAIN || '';
var publicIP      = process.env.EZMASTER_PUBLIC_IP || '127.0.0.1';
var baseURL       = process.env.EZMASTER_PUBLIC_DOMAIN || 'http://' + publicIP + ':35267';


module.exports = {

  connectionURI: 'mongodb://' + mongoHostPort + '/ezmaster',

  collectionName: 'data',

  publicDomain: publicDomain,

  publicIP: publicIP,

  port: 35267,

  baseURL: baseURL,

  browserifyModules : [
    'vue'
    , 'vue-resource'
    , 'components/addInstance'
    , 'components/table'
    , 'components/infosMachineTable'
    , 'vue-validator'
    , 'heartbeats'
    , 'components/entryPoint'
    , 'assets/js/main'
  ],

  browserifyTransformers: [
    'vueify'
  ],

  rootURL : '/',

  routes: [
    'config.js',
    'v1.js',
    'status.js'
  ],

  // THE HEARTBEATS SECTION - HEARTRATE AND EVENTS

  // The heart will beat every 1 second.
  'heartrate': 1000,

  // Heartbeats events declared here.
  // The heartbeats events are settled in the directory named 'heartbeats'.
  // We just have to mention the file name to search instead of a complete path because
  // castor is configured to search events scripts from the project root
  // in the directory named 'heartbeats'.
  heartbeats: [
    {
      // Every 1 beat (so here every 1 seconds)
      // call a script which refreshes the machine information.
      beat : 1,
      require: 'eventRefreshInfosMachine'
    }
  ],

  middlewares: {
    // '/' means to catch all the URLs (warning do not use '/*')
    '/': 'reverseproxy.js'
  },

  filters: ['jbj-parse']

};

module.exports.package = require('./package.json');