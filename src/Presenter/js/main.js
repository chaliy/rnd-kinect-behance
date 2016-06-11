'use strict';

angular
    .module('Main', ['Server','ngRoute', 'World', 'View'])
    .config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }])
    .run(['$rootScope', 'server', 'projectlikes', '$http', '$sce', ($rootScope, server, projectlikes, $http, $sce) => {

      let recalculateGrid = projects => {
        let maxPositionZ = 300;
        let minPositionZ = -300;
        let likes = _.pluck(projects, 'like');
        let minLike = _.min(likes);
        let maxLike = _.max(likes);
        let dLike = (maxLike - minLike);
        if (dLike < 1) { dLike = 1; }

        projects.forEach(project => {
            let likeCost = (maxPositionZ - minPositionZ) / dLike;
            project.z = Math.floor(maxPositionZ - (project.like * likeCost));
            let opacity = 1 - ((project.like - minLike) / dLike);
            project.opacity0 = opacity;
            if (opacity > 0.8) {
                opacity = 1;
            }
            if (opacity < 0.5) {
                opacity = opacity * 1.8;
            }
            if (opacity < 0.1) {
                opacity = 0.1;
            }
            project.opacity =  opacity;
            project.blur = 0;
        });
      }

      // Init defaults
      let projects = [
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


      // Apply random positions

      let height = 600;
      let width = 1000;
      let rnd = max => Math.floor(Math.random() * (max - 10) + 10);

      projects.forEach(project => {
          project.x = rnd(width);
          project.y = rnd(height);
      });


      // Load likes
      projects.forEach(p => {
        p.like = Math.floor(Math.random() * 150);
        //p.like = projectlikes.getProjectLikes(p.id);
      });

      // Load HTMLs

      projects.forEach(p => {
        $http.get("data/" + p.id + "/project.html").success(html => {
            html = html.replace(/src="/gi, 'src="data/' + p.id + '/'); // Fix image urls..
            p.html = $sce.trustAsHtml(html);
        });
      })

      recalculateGrid(projects);

      $rootScope.projects = projects;

      // Listen to server stuff
      server.on('projectlikecountchanged', e => {
          $rootScope.projects.forEach(p => {
              if (p.id === e.projectId) {
                  p.like = e.likeCount;
              }
          });
          recalculateGrid($rootScope.projects);
          $rootScope.$digest();
      });

      // Person position
      const eps = 0.01;
      let prevPoint = {x: 0, y:0, z:0};
      let distance = (pos1, pos2) => {
          return Math.sqrt(Math.pow(pos1.x - pos2.x,2) + Math.pow(pos1.y - pos2.y,2) + Math.pow(pos1.z - pos2.z,2));
      };
      
      $rootScope.distanceZ = 5;
      $rootScope.distanceX = 0;
      $rootScope.distanceY = 0;

      server.on('positionchanged', e => {
          if (distance(prevPoint, e.position) >= eps) {
              $rootScope.distanceZ = e.position.z;
              $rootScope.distanceX = e.position.x;
              $rootScope.distanceY = e.position.y;
              $rootScope.$digest();
          }
          prevPoint = e.position;
      });

    }]);
