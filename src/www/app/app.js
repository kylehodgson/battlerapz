BattleTapez = typeof BattleTapez === "undefined" ? {} : BattleTapez;

BattleTapez.BARS = angular.module("bars", ['ngAnimate','djds4rce.angular-socialshare']).config(function($locationProvider){
    $locationProvider.html5Mode(true).hashPrefix('!');
});
BattleTapez.BARS.factory("Battle", BattleTapez.BattleService);
BattleTapez.BARS.controller("mobileCtrl", BattleTapez.MobileController);
BattleTapez.BARS.directive("performanceScores", BattleTapez.PerformanceScoresDirective);
BattleTapez.BARS.directive("finalScores", BattleTapez.FinalScoresDirective);
BattleTapez.BARS.directive("helpText", BattleTapez.HowToScoreDirective);