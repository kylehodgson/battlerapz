BattleTapez = typeof BattleTapez === "undefined" ? {} : BattleTapez;

BattleTapez.BARS = angular.module("bars", ['ngAnimate']);
BattleTapez.BARS.factory("Battle", BattleTapez.BattleService);
BattleTapez.BARS.factory("Twitter", BattleTapez.TwitterService);
BattleTapez.BARS.controller("mobileCtrl", BattleTapez.MobileController);
BattleTapez.BARS.directive("performanceScores", BattleTapez.PerformanceScoresDirective);
BattleTapez.BARS.directive("howToScore", BattleTapez.HowToScoreDirective);