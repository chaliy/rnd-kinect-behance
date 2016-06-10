'use strict';

  angular
    .module('Interaction', ['Server'])
    .directive('interaction', ['$interval', 'server', function ($interval, server) {

      return function(scope, element, attrs) {

          var svg = d3.select(element[0])
              .append('svg')
              .attr('width', '99%')
              .attr('height', '99%')
              .attr('style', 'border: 1px solid silver; position: absolute; top: 0px; left: 0px; z-index: 1001');

          var width = $(svg[0]).width();
          var height = $(svg[0]).height();

          function local(point) {
              function norm(v) {
                  return (v + 2) / 4;
              }
              return { "x": norm(point.x) * width, "y": norm(-point.y) * height };
          }

          var refresh = function (data) {

              function draw(joint) {
                  joint.attr('class', 'dot')
                      .style('fill', function (d) {
                          if (d.isGripped) {
                              return 'green';
                          }
                          if (d.isPressed) {
                              return 'black';
                          }
                          return 'red';
                      })
                      .attr('cx', function (d) { return local(d).x; })
                      .attr('cy', function (d) { return local(d).y; })
                      .attr('r', function (d) { return 15; });
              }

              var joints = svg
                  .selectAll('.dot')
                  .data(data)
                  .call(draw);

              joints.enter()
                  .append('circle')
                  .call(draw);

              joints.exit()
                  .remove();
          };

          server.on('interactionchanged', function (e) {
              refresh([e.left, e.right]);
          });


      };
  }]);
