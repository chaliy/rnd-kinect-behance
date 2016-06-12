'use strict';

angular
  .module('Server', [])
  .factory('server', ['$interval', '$log', function ($interval, $log) {

      let instance = angular.extend(EventEmitter, {
          status: 'NA',
          send: function (type, content) {
              var envelope = {
                  type: type,
                  content: content
              };
              sm.send(JSON.stringify(envelope));
          }
      });

      let sm = new SocketManager("ws://localhost:8282",
          function (socket, event) {
              if (typeof event.data === 'string') {
                  let data = angular.fromJson(event.data);
                  //$log.log(data.type);
                  instance.emit(data.type.toLowerCase(), data.content);
              }
              else if (event.data instanceof Blob) {
                  $log.log('binary');
              }
          },
          function (socket) {
              $log.log('Connection to server opened');
              instance.status = "Connected";
          });

      sm.start();

      // For test purposes
      window.sendCommand = instance.send;

      return instance;
  }]);
