(function () {
    angular
        .module('ProjectLikes', ['LocalStorageModule', 'Server'])
        .config(['localStorageServiceProvider', function(localStorageServiceProvider){
            localStorageServiceProvider.setPrefix('project.likes');
        }])
        .factory('projectlikes', ['$interval', '$log', '$rootScope', 'server', 'localStorageService',
            function ($interval, $log, $rootScope, server, localStorageService) {

                var keyFn = function (pId) {
                    return 'count.' + pId;
                };

                var getProjectLikes = function(projectId) {
                    return localStorageService.get(keyFn(projectId)) || 0;
                };

                var setProjectLikes = function (projectId, likesCount) {
                    localStorageService.set(keyFn(projectId), likesCount);

                    angular.forEach($rootScope.projects, function (p) {
                        if (p.id == projectId) {
                            p.like = likesCount;
                        }
                    });
                    $rootScope.$digest();
                };

                var instance = angular.extend(EventEmitter, {
                    getProjectLikes: getProjectLikes,
                    preRegisterProjectLikes: function (projectId) {
                        setProjectLikes(projectId, getProjectLikes(projectId) + 1);
                    }
                });

                server.on('projectlikecountchanged', function (e) {
                    setProjectLikes(e.projectId, e.likeCount);
                });

                server.send('BroadcastAllProjectLikes', {});

                return instance;
            }]);

})();
