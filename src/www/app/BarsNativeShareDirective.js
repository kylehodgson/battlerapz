BattleTapez = typeof BattleTapez === "undefined" ? {} : BattleTapez;

BattleTapez.BarsNativeShareDirective = function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/bars-native-share.html'
    };
};