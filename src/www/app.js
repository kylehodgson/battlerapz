BattleTapez = typeof BattleTapez === "undefined"? {} : BattleTapez;

BattleTapez.BattleService = function() {
  return {};
};


BattleTapez.ScoreCtrl = function($scope, Battle) {
  $scope.Battle = Battle;
  $scope.Battle.punches=[];

  $scope.addPunch = function(round) {
    console.log("added a punch for round "+round);
    $scope.Battle.punches.push({time: Date.now(), round: round});
  }
};

BattleTapez.StartCtrl = function($scope, Battle) {
  $scope.Battle = Battle;

  $scope.startBattle = function(rapper1,rapper2) {
    console.log("Starting battle with rappers " + rapper1 + " and " + rapper2);
    Battle.rapper1 = rapper1;
    Battle.rapper2 = rapper2;
    Battle.rounds = [];
  }
}

BattleTapez.AddPunchDirective = function() {
  return {
    restrict: "E",
    scope: {
      done: "&"
      },
    template: '<div>' +
              '<a href="#" class="circlebutton" id="addPunch" ' +
              '  ng-click="done()">  ' +
              'Punch</a></div>  '
  }
};

BattleTapez.BARS = angular.module("bars", ['ngRoute']);
BattleTapez.BARS.factory("Battle", BattleTapez.BattleService);
BattleTapez.BARS.directive("addPunch", BattleTapez.AddPunchDirective);
BattleTapez.BARS.controller("ScoreCtrl", BattleTapez.ScoreCtrl);
BattleTapez.BARS.controller("StartCtrl", BattleTapez.StartCtrl);


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
      controller: 'FinishRoundController'
    }).
    otherwise({
      redirectTo: '/'
    });
  }]);