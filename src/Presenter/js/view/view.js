'use strict';

angular
    .module('View', ['Server','ngRoute'])
    .config(['$routeProvider', $routeProvider => {
        $routeProvider
            .when('/view/:id', {
                templateUrl: '/js/view/view.html',
                controller: 'ViewCtrl'
            });
    }])
    .controller('ViewCtrl', ['$routeParams','$scope','$rootScope', 'server', '$timeout', 'projectlikes', '$log',
        function ($routeParams, $scope, $rootScope, server, $timeout, projectlikes, $log) {

            var eps = 0.009,
                prevPoint = {x: 0, y:0, z:0},
                nextPoint,
                counter = 0;

            server.on('trackingchanged', function (e) {
                if (e.change === 'Engadged') {
                    alreadyLiked = [];
                }
                if (e.change === 'Lost') {
                    $rootScope.distanceX = 0;
                    $scope.distanceX = 0;
                    $scope.$digest();
                }
            });

            server.on('positionchanged', function (e) {
                var distance = findDistanceBetweenPoints(prevPoint, e.position);
                if (distance >= eps) {
                    $scope.distanceZ = $rootScope.distanceZ;
                    $scope.distanceX = $rootScope.distanceX;
                    $scope.distanceY = $rootScope.distanceY;
                    $scope.$digest();
                }
                prevPoint = e.position;
            });

            var findDistanceBetweenPoints = function(pos1, pos2){
                return Math.sqrt(Math.pow(pos1.x - pos2.x,2) + Math.pow(pos1.y - pos2.y,2) + Math.pow(pos1.z - pos2.z,2));
            };

            $scope.pkey = Math.floor(Math.random() * (29 - 1) + 1);
            var l = $rootScope.projects.length - 1;

            $scope.swepeLeft = function(){
                $scope.pkey = $scope.pkey - 1;

                if($scope.pkey < 0){
                    $scope.pkey = l;
                }

            };
            $scope.swepeRight = function(){
                $scope.pkey = $scope.pkey + 1;

                if($scope.pkey > l){
                    $scope.pkey = 0;
                }
            };
            $scope.$watch("pkey", function (newval) {

                if ($scope.pkey < 1) {
                    $scope.projectLeft = $rootScope.projects[l];
                } else {
                    $scope.projectLeft = $rootScope.projects[$scope.pkey - 1];
                }
                $scope.projectCenter = $rootScope.projects[$scope.pkey];

                if ($scope.pkey >= l) {
                    $scope.projectRight = $rootScope.projects[0];
                } else {
                    $scope.projectRight = $rootScope.projects[$scope.pkey + 1];
                }
            });


            var viewport = $("#viewport");
                items = $(".project-item[data-id='" + $rootScope.projects[$scope.pkey].id + "']");

            viewport.animate({
                opacity: 0
            }, 1000, function() {
                $('#body').addClass('go-go');
                items.removeClass("project-item-active");
            });


            $("#body").css("opacity", 0);
            $("#body").animate({
                opacity: 1
            }, 1000, function() {
                $('#body').addClass('go-go');
            });

            $(function() {
                var liked, onbottom,
                    workBody = $('#body'),
                    workAct = $('.work.active'),
                    workCentral = $('.work.central'),
                    workCentralContent = $('.work.central .inner'),
                    workCentralContentSect = $('.work.central .content section'),
                    workNext = $('.work.next'),
                    workPrev = $('.work.prev');

                workAct.on('scroll', function() {

                    // if not on the top, hide the title
                    if($(this).offset().top + 10 < $(this).scrollTop()) {
                        $(this).find('.header').addClass('fade-out');
                    } else {
                        $(this).find('.header').removeClass('fade-out');
                    }

                    var heightContent = (workCentralContent.offset().top * (-1)) + 257;

                    // if scrolled to the bottom
                    if ($(this).scrollTop() + $(this).innerHeight() + 200 >= this.scrollHeight) {

                        // appreciete appears only once
                        if (!liked) {
                            $('.likes').addClass('appreciete');
                        }

                        $(this).addClass('on-bottom');
                        onbottom = true;

                    } else {
                        // scroll up & hide appreciete text
                        $('.likes').removeClass('appreciete');

                        $(this).removeClass('on-bottom');
                        onbottom = false;
                    }

                });

                function refreshLike() {
                    $('.likes').removeClass('liked');
                    liked = false;
                    workBody.removeClass('press');
                }


                // scroll again on bottom
                var mouseScrolls = 0,
                    dragDone = true,
                    disableScroll = false;

                workAct.on('mousewheel', function(e) {

                    if (onbottom) {
                        mouseScrolls++;

                        if (mouseScrolls >= 3 && dragDone) {

                            workBody.addClass('too-much');
                            workCentralContent.css({
                                'transform' : 'translateY(-50px)'
                            });

                            dragDone = false;
                            disableScroll = true;


                                workBody.removeClass('too-much');
                                $('.work.central .content').css({
                                    'transition-duration' : ''
                                });
                                mouseScrolls = 0;
                                dragDone = true;
                                disableScroll = false;

                        }

                        if (disableScroll) {
                            e.preventDefault();
                        }
                    }
                });

                // liked
                $('.like-icon').on('click', function() {

                    // like is done
                    $('.likes').addClass('liked');
                    liked = true;

                    // pressed content on like
                    workBody.addClass('press');
                });


                var scrollY = 0;

                var width = $(document).width();
                var height = $(document).height();

                function local(point) {
                    var xs = width / 4.0;
                    var ys = height / 4.0;

                    return { "x": (point.x * xs) + width / 2, "y": (point.y * ys) + height / 2 };
                }
                var lastPoint,
                    start = true;
                setTimeout(function(){
                    server.on('interactionchanged', function (e) {

                            var heightContent = (workCentralContent.offset().top * (-1)) + 257,
                                coverPrev = $("#prev .cover"),
                                coverNext = $("#next .cover");

                            if (e.right) {
                                if (e.right.isGripped) {
                                    var point = local(e.right);
                                    if (lastPoint != null) {
                                        var d = (point.y - lastPoint.y) * 4;

                                       // var swipeLeftRight = (point.x - lastPoint.x) * 4;


                                        if(start) {
                                            scrollY = scrollY + d;
                                            //swipeLeftRight = swipeLeftRight + d;
                                        }

                                        if (scrollY < 0){
                                            setTimeout(function(){
                                                start = true;
                                            },1000);

                                            scrollY = 1;
                                            start = false;

                                        }

                                        if (scrollY >= workAct.height() - workAct.innerHeight){
                                            setTimeout(function(){
                                                start = true;
                                                workAct.animate({
                                                    scrollTop:  heightContent + 300
                                                }, 600);
                                            },3000);
                                            start = false;
                                        }
                                        workCentral.scrollTop(scrollY);
                                    }
                                    lastPoint = point;
                                    workCentral.addClass("scroll").removeClass("scroll-not");
                                } else {
                                    lastPoint = null;
                                    workCentral.removeClass("scroll").addClass("scroll-not");
                                }
                            }

                    });

                }, 3000);


                var alreadyLiked = [];

                $rootScope.onGestureDetected = function (e) {
                    switch (e.name) {
                        case 'Like':
                            var projectId = $rootScope.projects[$scope.pkey].id;
                            if (alreadyLiked.indexOf(projectId) >= 0) {
                            } else {
                                alreadyLiked.push(projectId);
                                projectlikes.preRegisterProjectLikes(projectId);
                                server.send('RaiseProjectLike', {
                                    projectId: projectId
                                });
                                // like is done
                                $('.likes').addClass('liked');
                                liked = true;

                                // pressed content on like
                                workBody.addClass('press');
                            }

                            break;

                        case 'SwipeToLeft':

                            scrollY = 0;
                            refreshLike();

                            workCentral.addClass('used');
                            workNext.addClass('next-ready');
                            workBody.addClass('go-back go-prev');

                            // next central starts from own top
                            workCentral.animate({ scrollTop: 0 }, 300);

                            // refresh classes
                            setTimeout(function () {
                                workCentral.removeClass('used');
                                workCentral.removeClass('active').hide();
                                $scope.swepeRight();
                                $scope.$apply();
                            }, 500);

                            setTimeout(function () {
                                $scope.swepeRight();
                                $scope.$apply();
                            }, 700);

                            // replay active animation
                            setTimeout(function () {
                                workCentral.addClass('active').show();
                                workNext.removeClass('next-ready');

                                // show new prev under pseudo
                                workBody.removeClass('go-prev');
                            }, 700);

                            setTimeout(function () {
                                workBody.removeClass('go-back');
                            }, 1000);

                            break;

                        case 'SwipeToRight':

                            scrollY = 0;
                            refreshLike();

                            workCentral.addClass('used');
                            workPrev.addClass('prev-ready');
                            $('#body').addClass('go-forward go-next');
                            workCentral.animate({ scrollTop: 0 }, 300);

                            // refresh classes before .active start replaying on 600s
                            setTimeout(function () {
                                workCentral.removeClass('used');
                                workCentral.removeClass('active').hide();
                            }, 700);

                            setTimeout(function () {
                                $scope.swepeLeft();
                                $scope.$apply();
                            }, 700);

                            // replay active animation
                            setTimeout(function () {
                                workCentral.addClass('active').show();
                                workPrev.removeClass('prev-ready');

                                // show new prev under pseudo
                                $('#body').removeClass('go-next');
                            }, 700);

                            setTimeout(function () {
                                // refresh pseudo cover
                                $('#body').removeClass('go-forward');
                            }, 1000);
                            break;
                    }
                    $scope.$digest();
                };

                $scope.$on("$destroy", function () {
                    $rootScope.onGestureDetected = null;
                });
             });
        }]);
