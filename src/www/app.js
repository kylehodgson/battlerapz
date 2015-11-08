BattleTapez = typeof BattleTapez === "undefined"? {} : BattleTapez;

BattleTapez.BattleService = function() {
  return {
    rapper1: "",
    rapper2: "",
    rounds: [],
    nextRound: function() {
      console.log("Adding round.");
      this.rounds.push({
        r1punches: [],
        r2punches: [],
        number: this.rounds.length+1
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
  }
  $scope.nextRound = function() {
    if($scope.rapper==2) {
      $scope.round++;
      $scope.rapper=1;
      $scope.rapperName=$scope.Battle.rapper1;
      $scope.Battle.nextRound();
    } else {
      $scope.rapper++;
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
              '<a class="circlebutton" id="addPunch" ' +
              '  ng-click="done()">  ' +
              'Punch</a></div>  '
  }
};

BattleTapez.BARS = angular.module("bars", ['ngRoute']);
BattleTapez.BARS.factory("Battle", BattleTapez.BattleService);
BattleTapez.BARS.directive("addPunch", BattleTapez.AddPunchDirective);
BattleTapez.BARS.controller("ScoreCtrl", BattleTapez.ScoreCtrl);
BattleTapez.BARS.controller("StartCtrl", BattleTapez.StartCtrl);
BattleTapez.BARS.controller("FinishCtrl", BattleTapez.FinishCtrl);


BattleTapez.BARS.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/round/score', {
      templateUrl: 'partials/score-round.html',
      controller: 'ScoreCtrl'
    }).
    when('/round/start', {
      templateUrl: 'partials/start-round.html',
      controller: 'StartCtrl'
    }).
    when('/round/finish', {
      templateUrl: 'partials/finish-round.html',
      controller: 'FinishCtrl'
    }).
    otherwise({
      redirectTo: '/round/start'
    });
  }]);