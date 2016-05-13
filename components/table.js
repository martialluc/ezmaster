/* global Vue, $, location */
'use strict';

module.exports = new Vue({
  el: '#instances-table',
  ready : function () {
    var self = this;
    self.$http.get('/-/v1/instances').then(function (result) {
      self.$set('containers', result.data);
    }, console.error);
  },
  methods: {
    startInstance : function (event) {
      var data = {
        action : 'start'
      };
      this.$http.put('/-/v1/instances/'+event.path[4].id, data).then(function (result) {
        location.reload();
      }, console.error);
    },

    stopInstance : function (event) {
      var data = {
        action : 'stop'
      };
      this.$http.put('/-/v1/instances/'+event.path[4].id, data).then(function (result) {
        location.reload();
      }, console.error);
    },

    confirmationDelete : function (event) {
      this.$http.get('/-/v1/instances/'+event.path[4].id).then(function (result) {
        this.titleToDelete = result.data.title;
        this.sizeToDelete = result.data.size;
        $('#modal-delete-instance').show();
      }, console.error);
    },

    cancelDelete : function (event) {
      $('#modal-delete-instance').hide();
    },

    deleteInstance : function (event) {
      this.$http.delete('/-/v1/instances/'+event.path[7].id).then(function (result) {
        // $('#modal-delete-instance').hide();
        location.reload();
      }, console.error);
    }
  },
  data : {
    sizeToDelete : '',
    titleToDelete : '',
    containers : []
  }
});
