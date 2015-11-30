BattleTapez = typeof BattleTapez === "undefined" ? {} : BattleTapez;

BattleTapez.MobileController = function ($scope, Battle) {

    const unSelectedStarsColor = '#2489CE';
    const selectedStarsColor = '#ff0000';
    const selectedErrorsColor = '#ff0000';
    const unSelectedErrorsColor = '#2489CE';
    const errorMax = 10;
    const starMax = 5;
    const lastRapper = 2;
    const punchButton = document.querySelector("#btnPunch");

    $scope.punches = 0;
    $scope.rapper1=Battle.rapper1;
    $scope.rapper2=Battle.rapper2;

    $scope.getRound = function () {
        return Battle.round;
    };

    $scope.startBattle = function (rapper1, rapper2) {
        Battle.startBattle(rapper1, rapper2);
        $scope.rapperName = Battle.currentRapperName();
    };

    $scope.addPunch = function () {
        punchAnimation();
        $scope.punches++;
        var time = Date.now();
        Battle.addPunch({rapper: Battle.currentRapperName(), round: Battle.round, time: time});
    };

    $scope.setScore = function (category, score) {
        Battle.setScore(category, score);

        for (var i = 1; i <= starMax; i++) {
            if (i <= score) {
                starsElementFor(category, i).css('color', selectedStarsColor);
            } else {
                starsElementFor(category, i).css('color', unSelectedStarsColor);
            }
        }
    };

    $scope.setErrors = function (category, score) {
        Battle.setScore(category, score * -1);

        for (var i = 1; i <= errorMax; i++) {
            if (i <= score) {
                starsElementFor(category, i).css('color', selectedErrorsColor);
            } else {
                starsElementFor(category, i).css('color', unSelectedErrorsColor);
            }
        }
    };

    $scope.getErrors = function () {
        return Battle.getScoreForCategory('errors');
    }

    $scope.nextRound = function () {
        $scope.punches=0;
        if (Battle.rapper == lastRapper) {
            Battle.nextRound();
        }
        Battle.nextRapper();
        Object.keys(Battle.getCategories()).forEach(function (category) {
            for (var i = 1; i <= starMax; i++) {
                starsElementFor(category, i).css('color', unSelectedStarsColor);
            }
        });
    };

    $scope.computeFinals = function () {
        $scope.rapper1Score = Battle.scoreForRapper(1);
        $scope.rapper2Score = Battle.scoreForRapper(2);
        $scope.rapper1Name = Battle.rapper1;
        $scope.rapper2Name = Battle.rapper2;

        $scope.winner = Battle.getWinner();

        $scope.winComparison = Battle.winComparison();

        $scope.tweet = {
            text: "Just finished scoring "+$scope.rapper1Name+" vs "+$scope.rapper2Name+". "+$scope.winner+" wins "+$scope.winComparison+", punch score "+$scope.rapper1Name+": "+$scope.rapper1Score+", "+$scope.rapper2Name+": "+$scope.rapper2Score+" http://battlerapscorer.com"
        }
    };

    var starsElementFor = function (category, i) {
        return angular.element(document.querySelector("#" + category + "-" + i));
    };

    var punchAnimation = function () {
        var degrees = 50;
        var timer = 100;
        var otherTimer = 400;
        var $element = angular.element(punchButton);
        $element.css('transition', '-webkit-transform ' + otherTimer + 'ms ease');

        var rotate = function () {
            $element.css('-webkit-transform', 'rotate(' + degrees + 'deg)');
            setTimeout(unRotate, timer);
        };

        var unRotate = function () {
            $element.css('-webkit-transform', 'rotate(0deg)');
        };

        rotate();
    }
};
