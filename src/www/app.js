BattleTapez = typeof BattleTapez === "undefined"? {} : BattleTapez;

BattleTapez.BattleService = function() {
  return {
    rapper1: "",
    rapper2: "",
    rounds: [],
    rapper: 1,
    round: 0,
    nextRound: function() {
      this.round++;
      console.log("Adding round:"+this.round);
      this.rounds.push({
        r1punches: [],
        r2punches: [],
        number: this.round,
        scores: []
      });
    },
    addPunch: function(punch) {
      if(this.rapper==1) {
        this.rounds[this.rounds.length-1].r1punches.push(punch);
      } else {
        this.rounds[this.rounds.length-1].r2punches.push(punch);
      }
    },
    startBattle: function(rapper1,rapper2) {
      this.rapper1=rapper1;
      this.rapper2=rapper2;
      this.round=0;
      this.nextRound();
    },
    currentRapperName: function() {
      if(this.rapper==1) {
        return this.rapper1;
      } else {
        return this.rapper2;
      }
    },
    setScore: function(round,rapper,category,score) {
      this.rounds[round-1].scores[rapper-1].categories[category]=score;
    },
    totalCategoryScoresForRound: function (rapper, round) {
      var total=0;
      var categories = this.rounds[round - 1].scores[rapper - 1].categories;
        Object.keys(categories).forEach(function(category) {
          total+=categories[category];
      });
      return total;
    },
    addCategoriesForRound: function() {
      this.rounds[this.round-1].scores.push({categories: {}});
    },
    nextRapper: function() {
      if(this.rapper==1) {
        this.rapper=2;
      } else {
        this.rapper=1;
      }
    },
    scoreForRapper: function(rapper) {
      var score = 0;
      for( var i=0;i < this.rounds.length; i++) {
        var punchesKey = "r" + rapper + "punches";
        score += this.rounds[i][punchesKey].length;
        var categories = this.rounds[i].scores[rapper - 1].categories;
        Object.keys(categories).forEach(function(category) {
          score += categories[category];
        });
      }
      return score;
    }
  };
};

BattleTapez.MobileController = function($scope, Battle) {

  $scope.Battle = Battle;

  $scope.scoreForRapper = function(rapper) {
    return $scope.Battle.scoreForRapper(rapper);
  };

  $scope.startBattle = function(rapper1,rapper2) {
    console.log("Starting battle with rappers " + rapper1 + " and " + rapper2);
    $scope.Battle.startBattle(rapper1,rapper2);
    $scope.rapperName=$scope.Battle.currentRapperName();
  };

  $scope.addPunch = function() {
    var time = Date.now();
    console.log("added a punch for round " + $scope.Battle.round + " with time " + time + " for rapper " + $scope.Battle.currentRapperName());
    $scope.Battle.addPunch( {rapper: $scope.Battle.currentRapperName(), round: $scope.Battle.round, time: time});
  };

  $scope.finishedRound = function() {
    $scope.Battle.addCategoriesForRound();
    if($scope.Battle.rapper==1) {
      $scope.punches=$scope.Battle.rounds[$scope.Battle.round-1].r1punches.length;
    } else {
      $scope.punches=$scope.Battle.rounds[$scope.Battle.round-1].r2punches.length;
    }
  };

  $scope.addCategoriesForRound = function() {
    $scope.Battle.addCategoriesForRound();
  };

  $scope.nextRapper = function() {
    $scope.Battle.nextRapper();
  };

  $scope.setScore=function(category,score) {
    console.log("Setting score for " + category + " to " + score);
    $scope.Battle.setScore($scope.Battle.round,$scope.Battle.rapper,category,score);
    $scope.total = $scope.punches + Battle.totalCategoryScoresForRound($scope.Battle.rapper, $scope.Battle.round);
    for(var i=1; i<=5; i++) {
      var elementToUpdate = angular.element( document.querySelector( "#" + category + "-" + i ) );
      if(i <= score) {
        elementToUpdate.css('color','#ff0000');
      } else {
        elementToUpdate.css('color','#0000ff');
      }
    }
  };

  $scope.setErrors=function(category,score) {
    console.log("Setting errors for " + category + " to " + score);
    $scope.Battle.setScore($scope.Battle.round,$scope.Battle.rapper,category,score*-1);
    $scope.total = $scope.punches + Battle.totalCategoryScoresForRound($scope.Battle.rapper, $scope.Battle.round);
    for(var i=1; i<=10; i++) {
      var elementToUpdate = angular.element( document.querySelector( "#" + category + "-" + i ) );
      if(i <= score) {
        elementToUpdate.css('color','#ff0000');
      } else {
        elementToUpdate.css('color','#0000ff');
      }
    }
  };

  $scope.nextRound=function() {
    if($scope.Battle.rapper==2) {
      $scope.Battle.nextRound();
    }
    $scope.Battle.nextRapper();
    $scope.rapperName=$scope.Battle.currentRapperName();

    var categories = this.Battle.rounds[0].scores[0].categories;
    Object.keys(categories).forEach(function(category) {
      for(var i=1; i<=5; i++) {
        var elementToUpdate = angular.element( document.querySelector( "#" + category + "-" + i ) );
        elementToUpdate.css('color','#0000ff');
      }
    });

  };

  $scope.computeFinals=function() {
    $scope.rapper1Score = $scope.Battle.scoreForRapper(1);
    $scope.rapper2Score = $scope.Battle.scoreForRapper(2);
    $scope.rapper1Name=$scope.Battle.rapper1;
    $scope.rapper2Name=$scope.Battle.rapper2;

    if($scope.rapper1Score == $scope.rapper2Score) {
      $scope.winner = "TIE!";
    } else if($scope.rapper1Score > $scope.rapper2Score) {
      $scope.winner = $scope.Battle.rapper1;
    } else {
      $scope.winner = $scope.Battle.rapper2;
    }
  };

};

BattleTapez.BARS = angular.module("bars", ['ngRoute']);
BattleTapez.BARS.factory("Battle", BattleTapez.BattleService);
BattleTapez.BARS.controller("mobileCtrl", BattleTapez.MobileController);
