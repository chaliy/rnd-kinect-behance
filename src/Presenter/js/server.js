(function () {

    angular
      .module('Server', [])
      .factory('server', ['$interval', '$log', function ($interval, $log) {
          
          var instance = angular.extend(EventEmitter, {
              status: 'NA',
              send: function (type, content) {
                  var envelope = {
                      type: type,
                      content: content
                  };
                  sm.send(angular.toJson(envelope));
              }
          });

          var sm = new SocketManager("ws://localhost:8282",
              function (socket, event) {
                  if (typeof event.data === 'string') {
                      var data = angular.fromJson(event.data);
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

          window.sendCommand = instance.send;

          return instance;
      }]);

})();
