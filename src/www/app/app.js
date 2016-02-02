
BattleTapez = typeof BattleTapez === "undefined" ? {} : BattleTapez;

var runningLocally = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
var dependencies = ['ngCordova']
var sharingDirective={}

if (runningLocally) {
    sharingDirective = BattleTapez.BarsNativeShareDirective
} else {
    dependencies.push('djds4rce.angular-socialshare')
    sharingDirective = BattleTapez.BarsWebShareDirective
}
BattleTapez.BARS = angular.module("bars",dependencies).config(function($locationProvider){
    $locationProvider.html5Mode(true).hashPrefix('!');
});
BattleTapez.BARS.factory("Battle", BattleTapez.BattleService);
BattleTapez.BARS.controller("mobileCtrl", BattleTapez.MobileController, [ BattleTapez.BattleService, "$cordovaSocialSharing"]);
BattleTapez.BARS.directive("performanceScores", BattleTapez.PerformanceScoresDirective);
BattleTapez.BARS.directive("finalScores", BattleTapez.FinalScoresDirective);
BattleTapez.BARS.directive("barsShare", sharingDirective);
BattleTapez.BARS.directive("helpText", BattleTapez.HowToScoreDirective);
