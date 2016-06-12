'use strict';

angular
    .module('View', ['Server','ngRoute'])
    .config(['$routeProvider', $routeProvider => {
        $routeProvider
            .when('/view', {
                templateUrl: '/js/view/view.html',
                controller: 'ViewCtrl'
            });
    }])
    .controller('ViewCtrl', ['$routeParams','$scope','$rootScope', 'server', '$timeout', 'projectlikes', '$log',
        function ($routeParams, $scope, $rootScope, server, $timeout, projectlikes, $log) {

            let alreadyLiked = [];

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

            $rootScope.$watch("distanceX", v => $scope.distanceX);

            let lastIndex = $rootScope.projects.length - 1;
            let currentIndex = Math.floor(Math.random() * lastIndex);

            let updateProjects = () => {
              let projects = $rootScope.projects;
              $scope.projectLeft = projects[(currentIndex < 1) ? lastIndex : currentIndex - 1];
              $scope.projectCenter = projects[currentIndex];
              $scope.projectRight = projects[(currentIndex >= lastIndex) ? 0 : currentIndex + 1];
            }

            let swipeToRight = () => {
              if (currentIndex > 0) {
                currentIndex--;
                updateProjects();
              }
            }

            let swipeToLeft = () => {
              if (currentIndex < lastIndex) {
                currentIndex++;
                updateProjects();
              }
            }

            // Startup
            updateProjects();

            let items = $(".project-item[data-id='" + $rootScope.projects[currentIndex].id + "']");

            $("#viewport").animate({
                opacity: 0
            }, 1000, () => {
                $('#body').addClass('go-go');
                items.removeClass("project-item-active");
            });

            $("#body")
              .css("opacity", 0)
              .animate({
                  opacity: 1
              }, 1000, () => {
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

                    return {
                      x: (point.x * xs) + width / 2,
                      y: (point.y * ys) + height / 2
                    };
                }

                var lastPoint,
                    start = true;
                $timeout(function(){
                    server.on('interactionchanged', function (e) {

                            var heightContent = (workCentralContent.offset().top * (-1)) + 257,
                                coverPrev = $("#prev .cover"),
                                coverNext = $("#next .cover");

                            if (e.right) {
                                if (e.right.isGripped) {
                                    var point = local(e.right);
                                    if (lastPoint != null) {
                                        var d = (point.y - lastPoint.y) * 4;

                                        if(start) {
                                            scrollY = scrollY + d;
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



                server.on('gesturedetected', (e) => {
                    switch (e.name) {
                        case 'Like':
                            var projectId = $rootScope.projects[lastIndex].id;
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
                            $timeout(() => {
                                workCentral.removeClass('used');
                                workCentral.removeClass('active').hide();
                                swipeToLeft();
                            }, 500);

                            // replay active animation
                            $timeout(() => {
                                workCentral.addClass('active').show();
                                workNext.removeClass('next-ready');

                                // show new prev under pseudo
                                workBody.removeClass('go-prev');
                            }, 700);

                            $timeout(() => {
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
                            $timeout(() => {
                                workCentral.removeClass('used');
                                workCentral.removeClass('active').hide();
                                  swipeToRight();
                            }, 500);

                            // replay active animation
                            $timeout(() => {
                                workCentral.addClass('active').show();
                                workPrev.removeClass('prev-ready');

                                // show new prev under pseudo
                                $('#body').removeClass('go-next');
                            }, 700);

                            $timeout(() => {
                                // refresh pseudo cover
                                $('#body').removeClass('go-forward');
                            }, 1000);

                            break;
                    }
                });
             });
        }]);
