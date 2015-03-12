(function (){
    var EventEmitter = {
        events: {},
        on: function (name, callback) {
            this.events[name] = this.events[name] || [];
            this.events[name].push(callback);
            return callback;
        },
        remove: function(name, callback){
            if (!this.events[name]) return;
            var index = this.events[name].indexOf(callback);
            this.events[name] = this.events[name].splice(index, 1);
        },
        emit: function (name, e) {
            if (!this.events[name]) return;
            for (var i = 0; i < this.events[name].length; i++) {
                this.events[name][i](e);
            }
        }
    };

    window.EventEmitter = EventEmitter;
})();