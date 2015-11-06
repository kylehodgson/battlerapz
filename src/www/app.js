BattleTapez = typeof BattleTapez === "undefined"? {} : BattleTapez;

BattleTapez.Punches = function() {
  return {
    getPunches : function() {
      return [];  }}};


BattleTapez.PunchCtrl = function($scope,Punches) {
  $scope.punches = Punches.getPunches();

  $scope.addPunch = function() {
    console.log("added a punch.");
    $scope.punches.push({time: Date.now(), round: $scope.round});
  }
};

BattleTapez.AddPunch = function() {
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

BattleTapez.scoring = angular.module("scoring", []);
BattleTapez.scoring.factory("Punches", BattleTapez.Punches);
BattleTapez.scoring.directive("addPunch", BattleTapez.AddPunch);
BattleTapez.scoring.controller("PunchCtrl", BattleTapez.PunchCtrl);

