if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    };
}

if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str) {
        return this.slice(-str.length) == str;
    };
}
describe("word controller", function () {

    var projects = [
        { id: 89757, title: "Gangsta", author: "Sergey Snurnik", category: "Illustration / Digital Art / Art Direction", like: 0, x: -500, y: 0, award: [0, 0, 0, 0, 0, 0] },
        { id: 89909, title: "Soviet Union: Lifestyle. 1945-1985. Book Box", author: "Sergey Snurnik", category: "Design / Illustration", like: 40, x: 200, y: -300, award: [0, 0, 0, 0, 0, 0] },
        { id: 94608, title: "Magazine covers", author: "Sergey Snurnik", category: "Art Direction / Illustration", like: 15, x: 20, y: 70, award: [0, 0, 0, 0, 0, 0] }
    ];

    var p89757 = _(projects).find(function (x) { return x.id == 89757; });
    var p89909 = _(projects).find(function (x) { return x.id == 89909; });
    var p94608 = _(projects).find(function (x) { return x.id == 94608; });

    describe("projects layout", function () {
        var scope;
        beforeEach(angular.mock.module('App'));
        beforeEach(angular.mock.inject(function ($injector) {
            var $rootScope = $injector.get('$rootScope');
            var $controller = $injector.get('$controller');

            $httpBackend = $injector.get('$httpBackend');
            authRequestHandler = $httpBackend
                .when('GET', function (u) {
                    return u.startsWith("data/") && u.endsWith(".html");
                })
               .respond(200, "");

            scope = $rootScope.$new();
            $controller('WordCtrl', { $scope: scope });
            $rootScope.projects = projects;
            scope.projects = projects;
            $rootScope.$digest();
            scope.$digest();

        }));

        it("should correctly calculate project depth", function () {
            expect(p89757.positionZ).toBe(-340);
            expect(p89909.positionZ).toBe(-300);
        });

        it("should correctly calculate project opasity", function () {
            expect(p89757.opacity).toBe(0.1);
            expect(p89909.opacity).toBe(1);
        });
    });
});
