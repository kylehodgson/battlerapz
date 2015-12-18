BattleTapez = typeof BattleTapez === "undefined" ? {} : BattleTapez;

BattleTapez.MobileController = function ($scope, Battle) {

    const unSelectedStarsColor = '#2489CE';
    const selectedStarsColor = '#ff0000';
    const selectedErrorsColor = '#ff0000';
    const unSelectedErrorsColor = '#2489CE';
    const errorMax = 20;
    const starMax = 5;
    const lastRapper = 2;
    const punchButton = document.querySelector("#btnPunch");

    $scope.punches = 0;
    $scope.rapper1=Battle.rapper1;
    $scope.rapper2=Battle.rapper2;
    $scope.vibrateDisabled=false;

    $scope.getRound = function () {
        return Battle.round;
    };

    $scope.startBattle = function (rapper1, rapper2) {
        Battle.startBattle(rapper1, rapper2);
        $scope.punches=0;
    };
    
    $scope.clearBattle = function() {
        $scope.rapper1Score=0;
        $scope.rapper2Score=0;
        $scope.rapper1Name="";
        $scope.rapper2Name="";
        $scope.rapper1="";
        $scope.rapper2="";
        Battle.clearBattle();
    };

    $scope.addPunch = function () {
        punchAnimation();
        $scope.punches++;
        var time = Date.now();
        Battle.addPunch({rapper: Battle.currentRapperName(), round: Battle.round, time: time});
        punchVibration();
        
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
    
    $scope.rapperName = function() {
        return Battle.currentRapperName();
    }

    $scope.computeFinals = function () {
        $scope.rapper1Score = Battle.scoreForRapper(1);
        $scope.rapper2Score = Battle.scoreForRapper(2);
        $scope.rapper1Name = Battle.rapper1;
        $scope.rapper2Name = Battle.rapper2;

        $scope.winner = Battle.getWinner();

        $scope.winComparison = Battle.winComparison();

        $scope.tweet =  {
            text: "Just finished scoring "+$scope.rapper1Name+" vs "+$scope.rapper2Name+". "+$scope.winner+" wins "+$scope.winComparison+", punch score "+$scope.rapper1Name+": "+$scope.rapper1Score+", "+$scope.rapper2Name+": "+$scope.rapper2Score+" http://battlerapscorer.com #BattleRap"
        }     
    };
    
    $scope.battle = function() {
        return {
            categories: function() {
                var categoryList=Array();
                [1,2].forEach( function(rapperIndex) {
                    for(var roundIndex=0; roundIndex< Battle.rounds.length; roundIndex++) {
                        if(!(typeof Battle.rounds[roundIndex].scores[rapperIndex-1] === "undefined")) {
                            var categories = Battle.rounds[roundIndex].scores[rapperIndex-1].categories;
                            Object.keys(categories).forEach(function (category) {
                                categoryList.push(category)
                            })
                        }
                    }
                })
                return categoryList
            },
            rapper: function(rapperIndex) {
                return {
                    total: function() {
                        return Battle.scoreForRapper(rapperIndex)
                    },
                    punches: function() {
                        var rapperkey="r" + rapperIndex + "punches";
                        var punchTotal = 0;
                        for(var i=0; i< Battle.rounds.length; i++) {
                            punchTotal += Battle.rounds[i][rapperkey].length;
                        }
                        
                        return punchTotal;
                    },
                    category: function(categoryName) {
                        var catScore = 0;
                        for(var roundIndex=0;roundIndex<Battle.rounds.length; roundIndex++) {
                            if(!(typeof Battle.rounds[roundIndex].scores[rapperIndex-1] === "undefined")) {
                                var categories = Battle.rounds[roundIndex].scores[rapperIndex-1].categories;
                                var catScoreForRapperInRound = categories[categoryName];
                                if(!(typeof catScoreForRapperInRound === "undefined")){
                                    catScore += categories[categoryName];
                                }
                            }
                        }
                        return catScore;
                    },
                    totalCategoryScore: function() {
                        var total = 0;
                        for(var roundIndex=0;roundIndex<Battle.rounds.length; roundIndex++) {
                            if(!(typeof Battle.rounds[roundIndex].scores[rapperIndex-1] === "undefined")) {
                                var categories = Battle.rounds[roundIndex].scores[rapperIndex-1].categories;
                                Object.keys(categories).forEach(function (category) {
                                    total += categories[category];
                                });
                            }
                        }
                        return total
                    }
                }
            },
            winner: function() {
                var r1 = Battle.scoreForRapper(1);
                var r2 = Battle.scoreForRapper(2);
                if(r1>r2) return Battle.rapper1;
                if(r2>r1) return Battle.rapper2;
                return "TIE";

            },
            round: function(roundIndex) {
                return {
                    rapper: function(rapperIndex){
                        return {
                            punches: function() {
                                var rapperkey="r" + rapperIndex + "punches";
                                return Battle.rounds[roundIndex-1][rapperkey].length;
                            },
                            category: function(categoryName) {
                                return Battle.rounds[roundIndex-1].scores[rapperIndex-1].categories[categoryName];
                            },
                            total: function() {
                                return Battle.scoreForRapperInRound(rapperIndex,roundIndex-1);
                            }
                        }
                    },
                    winner: function() {
                                var r1 = Battle.scoreForRapperInRound(1,roundIndex-1);
                                var r2 = Battle.scoreForRapperInRound(2,roundIndex-1);
                                if(r1>r2) return Battle.rapper1;
                                if(r2>r1) return Battle.rapper2;
                                return "TIE";
                   }
                }
            }
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
            $element.css('-webkit-transform', 'translateZ(0)');
            $element.css('-webkit-transform', 'rotate(' + degrees + 'deg)');
            setTimeout(unRotate, timer);
        };

        var unRotate = function () {
            $element.css('-webkit-transform', 'rotate(0deg)');
        };

        rotate();
    };
    
    var punchVibration = function() {
        if($scope.vibrateDisabled) return;
        if(typeof window.plugins === "undefined") {
            $scope.vibrateDisabled=true;
            return;
        }
        
        window.plugins.deviceFeedback.haptic()
    };
};
