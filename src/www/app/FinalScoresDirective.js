BattleTapez = typeof BattleTapez === "undefined" ? {} : BattleTapez;

BattleTapez.FinalScoresDirective = function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/final-scores.html'
    };
};