BattleTapez = typeof BattleTapez === "undefined" ? {} : BattleTapez;

BattleTapez.PerformanceScoresDirective = function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/performance-scores.html'
    };
};