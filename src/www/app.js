BattleTapez = typeof BattleTapez === "undefined"? {} : BattleTapez;

BattleTapez.BattleService = function() {
  return {
    rapper1: "",
    rapper2: "",
    rounds: [],
    rapper: 1,
    round: 0,
    nextRound: function() {
      this.round++;
      console.log("Adding round:"+this.round);
      this.rounds.push({
        r1punches: [],
        r2punches: [],
        number: this.round,
        scores: []
      });
    },
    addPunch: function(punch) {
      if(this.rapper==1) {
        this.rounds[this.rounds.length-1].r1punches.push(punch);
      } else {
        this.rounds[this.rounds.length-1].r2punches.push(punch);
      }
    },
    startBattle: function(rapper1,rapper2) {
      this.rapper1=rapper1;
      this.rapper2=rapper2;
    },
    currentRapperName: function() {
      if(this.rapper==1) {
        return this.rapper1;
      } else {
        return this.rapper2;
      }
    },
    setScore: function(round,rapper,category,score) {
      this.rounds[round-1].scores[rapper-1].categories[category]=score;
    },
    totalCategoryScoresForRound: function (rapper, round) {
      var total=0;
      var categories = this.rounds[round - 1].scores[rapper - 1].categories;
        Object.keys(categories).forEach(function(category) {
          total+=categories[category];
      });
      return total;
    },
    addCategoriesForRound: function() {
      this.rounds[this.round-1].scores.push({categories: {}});
    },
    nextRapper: function() {
      if(this.rapper==1) {
        this.rapper=2;
      } else {
        this.rapper=1;
      }
    },
    scoreForRapper: function(rapper) {
      var score = 0;
      for( var i=0;i < this.rounds.length; i++) {
        var punchesKey = "r" + rapper + "punches";
        score += this.rounds[i][punchesKey].length;
        var categories = this.rounds[i].scores[rapper - 1].categories;
        Object.keys(categories).forEach(function(category) {
          score += categories[category];
        });
      }
      return score;
    }
  };
};


BattleTapez.StartCtrl = function($scope, Battle) {
  $scope.Battle = Battle;
  $scope.startBattle = function(rapper1,rapper2) {
    console.log("Starting battle with rappers " + rapper1 + " and " + rapper2);
    $scope.Battle.startBattle(rapper1,rapper2);
  }
};

BattleTapez.ScoreCtrl = function($scope, Battle) {
  $scope.Battle = Battle;

  if($scope.Battle.round==0) {
    $scope.Battle.nextRound();
  }

  $scope.rapperName=$scope.Battle.currentRapperName();

  $scope.addPunch = function() {
    var time = Date.now();
    console.log("added a punch for round " + $scope.Battle.round + " with time " + time + " for rapper " + $scope.rapperName);
    $scope.Battle.addPunch( {rapper: $scope.rapperName, round: $scope.Battle.round, time: time});
  };
  $scope.nextRapper = function() {
    $scope.Battle.nextRapper();
  };
};

BattleTapez.PerformanceCtrl = function($scope, Battle) {
  $scope.Battle = Battle;
  $scope.Battle.addCategoriesForRound();
  $scope.rapperName=$scope.Battle.currentRapperName();
  if($scope.Battle.rapper==1) {
    $scope.punches=$scope.Battle.rounds[$scope.Battle.round-1].r1punches.length;
  } else {
    $scope.punches=$scope.Battle.rounds[$scope.Battle.round-1].r2punches.length;
  }
  $scope.total=$scope.punches;
  $scope.setScore=function(category,score) {
    $scope.Battle.setScore($scope.Battle.round,$scope.Battle.rapper,category,score);
    $scope.total = $scope.punches + Battle.totalCategoryScoresForRound($scope.Battle.rapper, $scope.Battle.round);
    for(var i=1; i<=5; i++) {
      var elementToUpdate = angular.element( document.querySelector( "#" + category + "-" + i ) );
      if(i <= score) {
        elementToUpdate.css('color','#ff0000');
      } else {
        elementToUpdate.css('color','#000000');
      }
    }
  };
  $scope.nextRound=function() {
    if($scope.Battle.rapper==2) {
      $scope.Battle.nextRound();
    }
    $scope.Battle.nextRapper();
  }
};

BattleTapez.FinishCtrl = function($scope, Battle) {
  $scope.Battle = Battle;
  $scope.rapper1Score = $scope.Battle.scoreForRapper(1);
  $scope.rapper2Score = $scope.Battle.scoreForRapper(2);
};


BattleTapez.AddPunchDirective = function() {
  return {
    restrict: "E",
    scope: {
      done: "&"
      },
    template: '<div>' +
              '<a class="circlebutton" id="addPunch"' +
              '  ng-click="done()">' +
              'Punch</a></div>'
  }
};

BattleTapez.StarScoresDirective = function(scoreType) {
  return {
    restrict: "E",
    scope: {
      setScore: "&"
    },
    template: '<a id="rapping-1" ng-click="setScore(scoreType,1)">☆</a><a id="rapping-2" ng-click="setScore("rapping",2)">☆</a><a id="rapping-3" ng-click="setScore("rapping",3)">☆</a><a id="rapping-4" ng-click="setScore("rapping",4)">☆</a><a id="rapping-5" ng-click="setScore("rapping",5)">☆</a>'
  }
};

BattleTapez.BARS = angular.module("bars", ['ngRoute']);
BattleTapez.BARS.factory("Battle", BattleTapez.BattleService);
BattleTapez.BARS.directive("addPunch", BattleTapez.AddPunchDirective);
BattleTapez.BARS.directive("starScores", BattleTapez.StarScoresDirective);
BattleTapez.BARS.controller("ScoreCtrl", BattleTapez.ScoreCtrl);
BattleTapez.BARS.controller("PerformanceCtrl", BattleTapez.PerformanceCtrl);
BattleTapez.BARS.controller("StartCtrl", BattleTapez.StartCtrl);
BattleTapez.BARS.controller("FinishCtrl", BattleTapez.FinishCtrl);


BattleTapez.BARS.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/round/start', {
      templateUrl: 'partials/start-round.html',
      controller: 'StartCtrl'
    }).
    when('/round/performance', {
      templateUrl: 'partials/round-performance.html',
      controller: 'PerformanceCtrl'
    }).
    when('/round/score', {
      templateUrl: 'partials/score-round.html',
      controller: 'ScoreCtrl'
    }).
    when('/round/finish', {
      templateUrl: 'partials/finish-round.html',
      controller: 'FinishCtrl'
    }).
    otherwise({
      redirectTo: '/round/start'
    });
  }]);