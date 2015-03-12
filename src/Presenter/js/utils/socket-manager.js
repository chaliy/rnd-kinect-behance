(function () {

    // Source adopted from kinect.js

    //////////////////////////////////////////////////////////////
    // SocketManager object constructor
    //     SocketManager(uri, onmessage(socket,message) [, onconnection(isConnected)] )
    //
    // uri: URI of websocket endpoint to connect to
    // onmessage: callback function to call whenever a message is received
    // onconnection: function to call back whenever socket connection status changes
    //               from disconnected to connected or vice versa
    function SocketManager(uri, onmessage, onconnection) {

        //////////////////////////////////////////////////////////////
        // Private SocketExec properties
        var onStatusChanged = null;
        var statusMessage = "";
        var socket = null;
        var socketManager = this;
        var wsUri = uri.replace(/^http(s)?:/i, "ws$1:");

        var queue = [];

        //////////////////////////////////////////////////////////////
        // Private SocketExec methods
        function updateStatusChanged() {
            if (onStatusChanged != null) {
                onStatusChanged(statusMessage);
            }
        }

        function updateStatus(message) {
            statusMessage = message;

            updateStatusChanged();
        }

        function tryConnection() {
            if (!socketManager.isStarted) {
                return;
            }

            if (socket != null) {
                updateStatus("Already connected." + (new Date()).toTimeString());
                return;
            }
            updateStatus("Connecting to server...");

            // Initialize a new web socket.
            socket = new WebSocket(wsUri);

            // Receive binary data as ArrayBuffer rather than Blob
            socket.binaryType = "arraybuffer";

            // Connection established.
            socket.onopen = function () {
                if (typeof onconnection == "function") {
                    onconnection(socket);
                }

                updateStatus("Connected to server.");

                while (queue.length != 0) {
                    socket.send(queue.pop());
                }
            };

            // Connection closed.
            socket.onclose = function () {
                if (typeof onconnection == "function") {
                    onconnection(false);
                }

                updateStatus("Connection closed.");
                if (socketManager.isStarted) {
                    // Keep trying to reconnect as long as we're started
                    setTimeout(tryConnection, socketManager.retryTimeout, socketManager);
                }
                socket = null;
            };

            // Receive data FROM the server!
            socket.onmessage = function (message) {
                onmessage(socket, message);
            };
        }

        //////////////////////////////////////////////////////////////
        // Public SocketManager properties

        // connection retry timeout, in milliseconds
        this.retryTimeout = 5000;

        // true if socket has been started
        this.isStarted = false;

        //////////////////////////////////////////////////////////////
        // Public SocketManager functions
        this.setOnStatusChanged = function (statusChangedCallback) {
            onStatusChanged = statusChangedCallback;
            updateStatusChanged();
        };

        this.start = function () {
            this.isStarted = true;

            tryConnection(this);
        };

        this.stop = function () {
            this.isStarted = false;

            if (socket != null) {
                socket.close();
            }
        };

        this.send = function (d) {
            if (socket == null || socket.readyState != socket.OPEN) {
                queue.push(d);
            } else {
                socket.send(d);
            }
        }
    };
    window.SocketManager = SocketManager;
})();