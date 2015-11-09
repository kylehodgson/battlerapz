BattleTapez = typeof BattleTapez === "undefined"? {} : BattleTapez;

BattleTapez.BattleService = function() {
  return {
    rapper1: "",
    rapper2: "",
    rounds: [],
    rapper: 1,
    nextRound: function() {
      console.log("Adding round.");
      this.rounds.push({
        r1punches: [],
        r2punches: [],
        number: this.rounds.length+1,
        scores: []
      });
    },
    addPunch: function(rapper,punch) {
      if(rapper==1) {
        this.rounds[this.rounds.length-1].r1punches.push(punch);
      } else {
        this.rounds[this.rounds.length-1].r2punches.push(punch);
      }

    },
    startBattle: function(rapper1,rapper2) {
      this.rapper1=rapper1;
      this.rapper2=rapper2;
    },
    currentRound: function() {
      return this.rounds.length;
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
    scoreRapper: function() {
      var round = this.currentRound()-1;
      this.rounds[round].scores.push({categories: {}});
    },
    nextRapper: function() {
      if(this.rapper==1) {
        this.rapper=2;
      } else {
        this.rapper=1;
      }

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
  $scope.rapper=1;
  $scope.rapperName=$scope.Battle.rapper1;
  $scope.Battle.nextRound();
  $scope.round = $scope.Battle.rounds.length;
  $scope.addPunch = function() {
    var time = Date.now();
    console.log("added a punch for round " + $scope.round + " with time " + time + " for rapper " + $scope.rapperName);
    $scope.Battle.addPunch($scope.rapper, {rapper: $scope.rapperName, round: $scope.round, time: time});
  };
  $scope.nextRapper = function() {
    $scope.Battle.nextRapper();
  };
  $scope.scoreRapper = function() {
    $scope.Battle.scoreRapper();
  };
};

BattleTapez.PerformanceCtrl = function($scope, Battle) {
  $scope.Battle = Battle;
  $scope.round=$scope.Battle.currentRound();
  $scope.rapper=$scope.Battle.rapper;
  $scope.rapperName=$scope.Battle.currentRapperName();
  if($scope.rapper==1) {
    $scope.punches=$scope.Battle.rounds[$scope.round-1].r1punches.length;
  } else {
    $scope.punches=$scope.Battle.rounds[$scope.round-1].r2punches.length;
  }
  $scope.total=$scope.punches;
  $scope.setScore=function(category,score) {
    $scope.Battle.setScore($scope.round,$scope.rapper,category,score);
    $scope.total = $scope.punches + Battle.totalCategoryScoresForRound($scope.rapper, $scope.round);
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
    if($scope.rapper==2) {
      $scope.round++;
      $scope.rapper=1;
      $scope.rapperName=$scope.Battle.rapper1;
      $scope.Battle.nextRound();
    } else {
      $scope.rapper=2;
      $scope.rapperName=$scope.Battle.rapper2;
    }
  }
};

BattleTapez.FinishCtrl = function($scope, Battle) {
  $scope.Battle = Battle;
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

BattleTapez.BARS = angular.module("bars", ['ngRoute']);
BattleTapez.BARS.factory("Battle", BattleTapez.BattleService);
BattleTapez.BARS.directive("addPunch", BattleTapez.AddPunchDirective);
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