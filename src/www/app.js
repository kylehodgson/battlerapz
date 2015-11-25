BattleTapez = typeof BattleTapez === "undefined" ? {} : BattleTapez;

BattleTapez.PerformanceScoresDirective = function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/performance-scores.html'
    };
};

BattleTapez.TwitterService = function() {
    return {
        postStatus: function(message) {
            return "SUCCESS";
        }
    }
};

BattleTapez.BARS = angular.module("bars", ['ngAnimate']);
BattleTapez.BARS.factory("Battle", BattleTapez.BattleService);
BattleTapez.BARS.controller("mobileCtrl", BattleTapez.MobileController);
BattleTapez.BARS.directive("performanceScores", BattleTapez.PerformanceScoresDirective);