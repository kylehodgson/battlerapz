BattleTapez = typeof BattleTapez === "undefined" ? {} : BattleTapez;

BattleTapez.BattleService = function () {
    return {
        rapper1: "",
        rapper2: "",
        rounds: [],
        rapper: 1,
        round: 0,
        setupCategoriesForCurrentRound: function () {
            if (typeof this.rounds[this.round - 1].scores[this.rapper - 1] === "undefined") {
                this.rounds[this.round - 1].scores.push({categories: {}});
            }
        },
        nextRound: function () {
            this.round++;
            this.rounds.push({
                r1punches: [],
                r2punches: [],
                number: this.round,
                scores: []
            });
            this.setupCategoriesForCurrentRound();
        },
        getCategories: function () {
            return this.rounds[0].scores[0].categories;
        },
        getWinner: function () {
            var rapper1Score = this.scoreForRapper(1);
            var rapper2Score = this.scoreForRapper(2);
            if (rapper1Score == rapper2Score) {
                return "TIE";
            } else if (rapper1Score > rapper2Score) {
                return this.rapper1;
            } else {
                return this.rapper2;
            }
        },
        addPunch: function (punch) {
            if (this.rapper == 1) {
                this.rounds[this.rounds.length - 1].r1punches.push(punch);
            } else {
                this.rounds[this.rounds.length - 1].r2punches.push(punch);
            }
        },
        startBattle: function (rapper1, rapper2) {
            this.rapper1 = rapper1;
            this.rapper2 = rapper2;
            this.round = 0;
            this.nextRound();
        },
        currentRapperName: function () {
            if (this.rapper == 1) {
                return this.rapper1;
            } else {
                return this.rapper2;
            }
        },
        setScore: function (category, score) {
            this.setupCategoriesForCurrentRound();
            this.rounds[this.round - 1].scores[this.rapper - 1].categories[category] = score;
        },
        nextRapper: function () {
            if (this.rapper == 1) {
                this.rapper = 2;
            } else {
                this.rapper = 1;
            }
        },
        scoreForRapper: function (rapper) {
            var score = 0;
            for (var i = 0; i < this.rounds.length; i++) {
                var punchesKey = "r" + rapper + "punches";
                score += this.rounds[i][punchesKey].length;
                if (!(typeof this.rounds[i].scores[rapper - 1] === "undefined")) {
                    var categories = this.rounds[i].scores[rapper - 1].categories;
                    Object.keys(categories).forEach(function (category) {
                        score += categories[category];
                    });
                }
            }
            return score;
        }
    };
};

BattleTapez.MobileController = function ($scope, Battle) {

    const unSelectedStarsColor = '#0000ff';
    const selectedStarsColor = '#ff0000';
    const errorMax = 10;
    const starMax = 5;
    const lastRapper = 2;
    const punchButton = document.querySelector("#btnPunch");

    $scope.punches = 0;

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
                starsElementFor(category, i).css('color', selectedStarsColor);
            } else {
                starsElementFor(category, i).css('color', unSelectedStarsColor);
            }
        }
    };

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

BattleTapez.PerformanceScoresDirective = function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/performance-scores.html'
    };
};

BattleTapez.BARS = angular.module("bars", ['ngAnimate']);
BattleTapez.BARS.factory("Battle", BattleTapez.BattleService);
BattleTapez.BARS.controller("mobileCtrl", BattleTapez.MobileController);
BattleTapez.BARS.directive("performanceScores", BattleTapez.PerformanceScoresDirective);