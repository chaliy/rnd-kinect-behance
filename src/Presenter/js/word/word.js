'use strict';

angular
    .module('Word', ['Server', 'ngRoute', 'ngAnimate', 'ngSanitize'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'js/word/word.html',
                controller: 'WordCtrl'
            });
    })
    .controller('WordCtrl', ['$scope', '$rootScope',
        '$location', 'server', '$timeout', 'projectlikes', '$log', '$http', '$sce',
        function ($scope, $rootScope, $location, server, $timeout, projectlikes, $log, $http, $sce) {


            var viewport = $("#viewport");
            var body = $("#body");
            var word = $("#word");

            viewport.css("opacity",'0');
            viewport.animate({
                opacity: 1
            }, 1000);

            $(window).mousemove(function( event ) {
                word.css('transform', 'rotateY('+ (event.pageX - 960)/40 +'deg) rotateX('+ (event.pageY - 540)/100 +'deg)');
            });

            var eps = 0.01,
                prevPoint = {x: 0, y:0, z:0},
                nextPoint,
                counter = 0;


            server.on('positionchanged', function (e) {
                var distance = findDistanceBetweenPoints(prevPoint, e.position);
                if (distance >= eps) {
                    $rootScope.distanceZ = e.position.z;
                    $rootScope.distanceX = e.position.x;
                    $rootScope.distanceY = e.position.y;
                    $rootScope.$digest();
                }
                prevPoint = e.position;
            });

            var findDistanceBetweenPoints = function(pos1, pos2){
                return Math.sqrt(Math.pow(pos1.x - pos2.x,2) + Math.pow(pos1.y - pos2.y,2) + Math.pow(pos1.z - pos2.z,2));
            };

            server.on('projectlikecountchanged', function (e) {
                angular.forEach($rootScope.projects, function (p) {
                    if (p.id === e.projectId) {
                        p.like = e.likeCount;
                    }
                });
                $rootScope.$digest();
            });

            server.on('gesturedetected', function (e) {
                if ($rootScope.onGestureDetected) {
                    $rootScope.onGestureDetected(e);
                }
            });

            $scope.$watch('distanceZ', function (newval) {
                if (newval <= 2.8) {
                    $timeout(function () {
                        $location.path('/view/1');
                    });
                }
                if ((newval >= 3.5)) {
                    $timeout(function () {
                        $location.path('/');
                    });
                }
            });


            $rootScope.projects = $rootScope.projects || [  // Array projects
                { id: 89757, title: "Gangsta", author: "Sergey Snurnik", category: "Illustration / Digital Art / Art Direction", like: 0, x: -500, y: 0, award: [0, 0, 0, 0, 0, 0] },
                { id: 89909, title: "Soviet Union: Lifestyle. 1945-1985. Book Box", author: "Sergey Snurnik", category: "Design / Illustration", like: 40, x: 200, y: -300, award: [0, 0, 0, 0, 0, 0] },
                { id: 94608, title: "Magazine covers", author: "Sergey Snurnik", category: "Art Direction / Illustration", like: 15, x: 20, y: 70, award: [0, 0, 0, 0, 0, 0] },
                { id: 98119, title: "Nike / Be true", author: "Sergey Snurnik", category: "Digital Art", like: 100, x: 654, y: -250, award: [0, 0, 0, 0, 0, 0] },
                { id: 2453715, title: "PFC CSKA (Moscow) / Official symbol", author: "Sergey Snurnik", category: "Design / Branding / Illustration", like: 20, x: 1633, y: -362, award: [0, 0, 0, 0, 0, 0] },
                { id: 6886313, title: "Packaging design for Hot Cafe", author: "Ilona Belous", category: "Branding / Graphic Design / Packaging", like: 40, x: 1745, y: 613, award: [0, 0, 0, 0, 0, 0] },
                { id: 10483331, title: "City Routes", author: "Marian Mota", category: "Interaction Design / Typography / UI/UX", like: 0, x: -120, y: -430, award: [0, 0, 0, 0, 0, 0] },
                { id: 11894973, title: "Moscow Laboratory of Pathomorphology", author: "Leonid Ershov", category: "Interaction Design / UI/UX / Web Design", like: 30, x: 689, y: 1080, award: [0, 0, 1, 0, 0, 0] },
                { id: 13342265, title: "Illustrations", author: "MOON HAUZEN", category: "Character Design / Digital Art / Illustration", like: 80, x: 1014, y: -120, award: [0, 0, 0, 0, 1, 0] },
                { id: 14350243, title: "What I Eat App 2.0", author: "Ivan Pashko", category: "Interaction Design / Programming/ UI/UX", like: 0, x: 20, y: 600, award: [0, 0, 0, 0, 0, 0] },
                { id: 14573015, title: "Stars and Poppy Seeds", author: "Art Studio AGRAFKA", category: "Editorial Design / Graphic Design / Illustration", like: 20, x: -468, y: 657, award: [0, 0, 0, 0, 0, 0] },
                { id: 15228809, title: "Hedgehog's Rock", author: "MOON HAUZEN", category: "Character Design / Digital Art / Illustration", like: 80, x: 1200, y: 697, award: [0, 0, 0, 0, 0, 0] },
                { id: 15313489, title: "Veranda restaurant visual identity", author: "Tibor Tovt, Forma Line, Mihail Melnichenko", category: "Art Direction / Branding / Typography", like: 60, x: 500, y: 717, award: [1, 0, 0, 0, 0, 0] },
                { id: 15373141, title: "Healthbook iOS 8 concept", author: "Valera Vasylenko", category: "Interaction Design / UI/UX", like: 90, x: 1000, y: 180, award: [0, 0, 0, 0, 1, 0] },
                { id: 15628009, title: "AMAKO calendar 2014", author: "Vitamin ADV", category: "Illustration / Photography / Retouching", like: 0, x: 1850, y: 60, award: [0, 0, 0, 0, 0, 0] },
                { id: 15735307, title: "yep! Changing the way people meet", author: "Keepa Studio, Eugene Rudyy", category: "Graphic Design / Interaction Design / UI/UX", like: 50, x: -200, y: 419, award: [0, 1, 0, 0, 0, 0] },
                { id: 16036635, title: "Leono", author: "Olena Fedorova", category: "Illustration / Packaging / Pattern Design", like: 24, x: 689, y: 515, award: [0, 0, 0, 0, 0, 0] },
                { id: 16525321, title: "Impakt", author: "Keepa Studio, Eugene Rudyy, Irena Zablotska", category: "Illustration / Web Design", like: 12, x: 2000, y: 400, award: [1, 1, 1, 0, 0, 0] },
                { id: 17136289, title: "Titan Loop Campaign", author: "Leonid Ershov", category: "Interaction Design / UI/UX / Web Design", like: 34, x: 2100, y: 1100, award: [1, 0, 0, 0, 0, 0] },
                { id: 18416995, title: "Build Up Typography", author: "MOON HAUZEN", category: "Advertising / Illustration / Typography", like: 65, x: -403, y: 1040, award: [0, 0, 0, 0, 0, 1] },
                { id: 18422523, title: "Blog platform for software company", author: "Marian Mota", category: "UI/UX / Web Design / Web Development", like: 100, x: 200, y: 657, award: [0, 0, 0, 0, 0, 0] },
                { id: 20110033, title: "Old Lion Publisher", author: "MOON HAUZEN", category: "Character Design / Creative Direction / Illustration", like: 20, x: 926, y: 697, award: [0, 0, 0, 0, 0, 0] },
                { id: 20301049, title: "Branding for Fish manufactory", author: "Olena Fedorova", category: "Branding / Graphic Design / Packaging", like: 0, x: 1900, y: 800, award: [0, 0, 0, 0, 0, 0] },
                { id: 20379627, title: "LWO.aero", author: "Oles Kucherenko, Bambuk Studio, Lena Golubiatnikova", category: "Icon Design / UI/UX / Web Design", like: 75, x: -170, y: -150, award: [0, 0, 0, 0, 0, 0] },
                { id: 20761859, title: "Dragon's Fall Game", author: "Andriy Vyshkovskiy, Andriy Ivanusa, Dmytro Doskoch, Anna Zablotska, Mihai Tymoshenko", category: "Character Design / Game Design / Graphic Design", like: 80, x: 848, y: 1011, award: [0, 0, 0, 0, 0, 0] },
                { id: 20854599, title: "HELIUM: Free Icon Set", author: "Taras Shypka", category: "Icon Design / Illustration", like: 43, x: 1325, y: 343, award: [0, 0, 0, 0, 0, 0] },
                { id: 20940531, title: "1C Interes online shop", author: "Dmytro Trotsenko", category: "Graphic Design / UI/UX / Web Design", like: 84, x: 341, y: 380, award: [0, 0, 0, 0, 0, 0] },
                { id: 21030195, title: "Eleks QA", author: "Eleks UX, Halyna Hlynska, Oleg Gasioshyn, Uliana Peretyatko", category: "Illustration / UI/UX / Web Design", like: 25, x: 1100, y: 940, award: [0, 0, 0, 0, 0, 0] },
                { id: 144893, title: "Editorial. Calligraphy for Esquire (Russia)", author: "Sergey Snurnik", category: "Typography / Illustration / Editorial Design", like: 46, x: 1600, y: 980, award: [0, 0, 0, 0, 0, 1] },
                { id: 19883575, title: "Main character for cartoon", author: "Vasil Matsuk", category: "Animation / Cartooning / Digital Art", like: 24, x: 1500, y: -100, award: [0, 0, 0, 0, 0, 0] }
            ];

            // Load project likes
            angular.forEach($rootScope.projects, function (p) {
                p.like = projectlikes.getProjectLikes(p.id);
                $http.get("data/" + p.id + "/project.html").success(function (html) {
                    html = html.replace(/src="/gi, 'src="data/' + p.id + '/');
                    p.html = $sce.trustAsHtml(html);
                });

            });

            $scope.projects = $rootScope.projects;

            $scope.$watch("projects", function (projects) {
                var maxPositionZ = 1500;
                var minPositionZ = 300;
                var likes = _.pluck(projects, 'like');
                var maxLike = _.max(likes);
                var minLike = _.min(likes);
                var dLike = (maxLike - minLike);
                if (dLike < 1) { dLike = 1; }
                maxPositionZ = minPositionZ + dLike;

                angular.forEach(projects, function (project) {
                    var xPosition = (maxPositionZ - minPositionZ) / dLike;
                    project.positionZ = (project.like * xPosition) - maxPositionZ;
                    var opacity = project.like / dLike;
                    if (opacity < 0.5) {
                        opacity = opacity * 1.8;
                    }
                    if (opacity < 0.1) {
                        opacity = 0.1;
                    }
                    project.opacity = opacity;
                    project.blur = 0;
                });
            });

            $scope.distance = 0.0;
            $scope.status = server.status;



            body.css("opacity", '1');
            body.animate({
                opacity: 0
            }, 1200, function () {
                body.removeClass('go-go');
            });

        }]);
