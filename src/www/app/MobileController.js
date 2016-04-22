BattleTapez = typeof BattleTapez === "undefined" ? {} : BattleTapez;

BattleTapez.MobileController = function ($scope, Battle, $cordovaSocialSharing) {

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
        
        $scope.battleCalculator().listOfScoreCategories().forEach(function(category) {
            for (var i = 1; i <= starMax; i++) {
                starElementFor(category, i).css('color', unSelectedStarsColor);
            }
        })
        
        $scope.battleCalculator().listOfErrorCategories().forEach(function(category) {
            for (var i = 1; i <= errorMax; i++) {
                starElementFor(category, i).css('color', unSelectedErrorsColor);
            }
        })
        
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
                starElementFor(category, i).css('color', selectedStarsColor);
            } else {
                starElementFor(category, i).css('color', unSelectedStarsColor);
            }
        }
    };

    $scope.setErrors = function (category, score) {
        Battle.setScore(category, score * -1);

        for (var i = 1; i <= errorMax; i++) {
            if (i <= score) {
                starElementFor(category, i).css('color', selectedErrorsColor);
            } else {
                starElementFor(category, i).css('color', unSelectedErrorsColor);
            }
        }
    };

    $scope.getErrors = function () {
        return Battle.getScoreForCategory('errors') + Battle.getScoreForCategory('reaches');
    }
    
    $scope.barsNativeShare = function() {
        var message = $scope.tweet
        
        document.addEventListener("deviceready", function () {
            $cordovaSocialSharing
            .share(message) 
            .then(function(result)
            {
                $log.info('success sharing ' + message + ' : ' + result);
            }, function(err)
            {
                $log.info('error sharing ' + message + ' : ' + err);
            });
        }, false);
    }

    $scope.nextRound = function () {
        $scope.punches=0;
        if (Battle.rapper == lastRapper) {
            Battle.nextRound();
        }
        Battle.nextRapper();
        $scope.battleCalculator().listOfScoreCategories().forEach(function(category) {
            for (var i = 1; i <= starMax; i++) {
                starElementFor(category, i).css('color', unSelectedStarsColor);
            }
        })
        
        $scope.battleCalculator().listOfErrorCategories().forEach(function(category) {
            for (var i = 1; i <= errorMax; i++) {
                starElementFor(category, i).css('color', unSelectedErrorsColor);
            }
        })
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

        $scope.tweet =  "Just finished scoring "+$scope.rapper1Name+
                        " vs "+$scope.rapper2Name+". "+$scope.winner+" wins "+$scope.winComparison+
                        ", punch score "+$scope.rapper1Name+": "+$scope.rapper1Score+", "+$scope.rapper2Name+": "+$scope.rapper2Score
        setTimeout(function() {
            $scope.$apply();
        })
        
    };
    
    var positiveValue = function(value,index,array){ return value > 0 ?  true : false }
    var negativeValue = function(value,index,array){ return value < 0 ?  true : false }
    $scope.battleCalculator = function() {
        return {
            listOfRounds: function() {
                var rounds=Array();
                for(var i=0; i <  Battle.rounds.length; i++) {
                    rounds.push(i+1)
                }
                return rounds
            },
            listOfScoreCategories: function() {
                return this.categoriesWithScoresHaving(positiveValue)
            },
            listOfErrorCategories: function() {
                return this.categoriesWithScoresHaving(negativeValue)
            },
            categoriesWithScoresHaving: function(predicate) {
                var categoryNames=Array();
                var scoresForCategory=this.scoresForCategory;
                this.categories().forEach(function(category) {
                    if(categoryNames.indexOf(category) >= 0) return;
                    
                    var matchingScores = scoresForCategory(category).some(predicate)
                    if(matchingScores) {
                        categoryNames.push(category)
                    } 
                    
                })
                return categoryNames
            },
            scoresForCategory: function(categoryName) {
                var categoryScores = Array();
                [1,2].forEach( function(rapperIndex) {
                    for(var roundIndex=0; roundIndex< Battle.rounds.length; roundIndex++) {
                        if(!(typeof Battle.rounds[roundIndex].scores[rapperIndex-1] === "undefined")) {
                            var categories = Battle.rounds[roundIndex].scores[rapperIndex-1].categories;
                            Object.keys(categories).forEach(function (category) {
                                if(category==categoryName) {
                                    categoryScores.push(categories[category])
                                }
                            })
                        }
                    }
                })
                return categoryScores
            },
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
                    roundsWon: function() {
                        var roundsWon=0
                        for(var roundIndex=0; roundIndex< Battle.rounds.length; roundIndex++) {
                            if(!(typeof Battle.rounds[roundIndex].scores[rapperIndex-1] === "undefined")) {
                                var otherRapperIndex=0
                                if(rapperIndex==1) {
                                    otherRapperIndex=2
                                } else {
                                    otherRapperIndex=1
                                }
                                var rapperScore = Battle.scoreForRapperInRound(rapperIndex,roundIndex)
                                var otherRapperScore = Battle.scoreForRapperInRound(otherRapperIndex,roundIndex)
                                if(rapperScore>otherRapperScore) {
                                    roundsWon++
                                }
                            }
                        }
                        return roundsWon 
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
                return chooseWinnerForBattle(Battle, r1, r2)

            },
            round: function(roundIndex) {
                return {
                    rapper: function(rapperIndex){
                        return {
                            punches: function() {
                                var rapperkey="r" + rapperIndex + "punches";
                                if(typeof Battle.rounds[roundIndex-1] === "undefined") return 0
                                return Battle.rounds[roundIndex-1][rapperkey].length;
                            },
                            category: function(categoryName) {
                                if(typeof Battle.rounds[roundIndex-1] === "undefined") return 0
                                if(typeof Battle.rounds[roundIndex-1].scores === "undefined") return 0
                                if(typeof Battle.rounds[roundIndex-1].scores[rapperIndex-1] === "undefined") return 0
                                if(typeof Battle.rounds[roundIndex-1].scores[rapperIndex-1].categories === "undefined") return 0
                                if(typeof Battle.rounds[roundIndex-1].scores[rapperIndex-1].categories[categoryName] === "undefined") return 0
                                return Battle.rounds[roundIndex-1].scores[rapperIndex-1].categories[categoryName];
                            },
                            total: function() {
                                return Battle.scoreForRapperInRound(rapperIndex,roundIndex-1);
                            },
                            totalCategoryScore: function() {
                                var total = 0
                                if(!(typeof Battle.rounds[roundIndex-1].scores[rapperIndex-1] === "undefined")) {
                                    var categories = Battle.rounds[roundIndex-1].scores[rapperIndex-1].categories
                                    Object.keys(categories).forEach(function (category) {
                                        total += categories[category]
                                    })
                                }
                                return total
                            }
                        }
                    },
                    winner: function() {
                        var r1 = Battle.scoreForRapperInRound(1,roundIndex-1);
                        var r2 = Battle.scoreForRapperInRound(2,roundIndex-1);
                        return chooseWinnerForBattle(Battle, r1, r2)
                   }
                }
            }
        }
    };
    
    var starElementFor = function (category, i) {
        return angular.element(document.querySelector("#" + category + "-" + i));
    };
    
    var chooseWinnerForBattle = function(Battle,r1, r2) {
        if(r1>r2) return Battle.rapper1;
        if(r2>r1) return Battle.rapper2;
        return "TIE";
    }

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
        
        document.addEventListener("deviceready", function () {
            window.plugins.deviceFeedback.haptic()
        }, false);
        
        
    };
};
