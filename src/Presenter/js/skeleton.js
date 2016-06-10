'use strict';

﻿angular
  .module('Skeleton', ['Server'])
  .directive('skeleton', ['$interval', '$log', 'server', function ($interval, $log, server) {

    return function(scope, element, attrs) {

        var svg = d3.select(element[0])
            .append('svg')
            .attr('width', '99%')
            .attr('height', '99%')
            .attr('style', 'border: 1px solid silver; position: absolute; top: 0px; left: 0px');

        var width = $(svg[0]).width();
        var height = $(svg[0]).height();

        var jointsData = [];

        function local(point) {
            function norm(v) {
                return (v + 2) / 4;
            }
            return { "x": norm(point.x) * width, "y": norm(-point.y) * height };
        }

        var refreshJoints = function () {

            function draw(joint) {
                joint.attr('class', 'joint')
                    .style('fill', function (d) { return 'red'; })
                    .attr('cx', function (d) { return local(d.position).x; })
                    .attr('cy', function (d) { return local(d.position).y; })
                    .attr('r', function (d) { return 5; });
            }

            var joints = svg
                .selectAll('.joint')
                .data(jointsData, function (d) { return d.jointType; })
                .call(draw);

            joints.enter()
                .append('circle')
                .call(draw);

            joints.exit()
                .remove();
        };

        var entriesData = [];

        var refreshEntries = function () {

            function draw(entry) {
                entry.attr('class', 'entry')
                    .style('fill', function (d) { return 'green'; })
                    .attr('cx', function (d) { return local(d).x; })
                    .attr('cy', function (d) { return local(d).y; })
                    .attr('r', function (d) { return 5; });
            }

            var entries = svg
                .selectAll('.entry')
                .data(entriesData)
                .call(draw);

            entries.enter()
                .append('circle')
                .call(draw);

            entries.exit()
                .remove();
        };

        server.on('skeletonchanged', function (e) {
            jointsData = e.joints;
            refreshJoints();
        });

        server.on('gesturepointchanged', function (e) {
            entriesData = e.entries;
            refreshEntries();
        });

        server.on('trackingchanged', function (e) {
            $log.log(e.change);
            if (e.change === 'Lost') {
                $(svg[0]).css("background-color");
            }
            if (e.change === 'Engadged') {
                $(svg[0]).css("background-color", "ghostwhite");
            }
        });
    };
}]);
