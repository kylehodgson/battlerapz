BattleTapez = typeof BattleTapez === "undefined" ? {} : BattleTapez;

BattleTapez.BattleService = function () {
    return {
        rapper1: "",
        rapper2: "",
        rounds: [],
        rapper: 1,
        round: 0,
        setupCategoriesForCurrentRound: function () {
            if (typeof this.round == 0) return;
            if (typeof this.rounds[this.round - 1] === "undefined") return;
            if (typeof this.rounds[this.round - 1].scores[this.rapper - 1] === "undefined") {
                this.rounds[this.round - 1].scores.push({categories: {}});
            }
        },
        nextRound: function () {
            this.round++;
            this.rounds.push({
                r1punches: [],
                r2punches: [],
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
        getScoreForCategory: function (category) {
            if (typeof this.round == 0) return;
            if (typeof this.rounds[this.round - 1] === "undefined") return;
            if (typeof this.rounds[this.round - 1].scores[this.rapper -1] === "undefined") return;
            return this.rounds[this.round - 1].scores[this.rapper -1].categories[category];
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
            for (var round = 0; round < this.rounds.length; round++) {
                score += this.scoreForRapperInRound(rapper, round);
            }
            return score;
        },
        winComparison: function() {
            var r1Wins = 0;
            var r2Wins = 0;
            for(var round=0;round<this.rounds.length;round++) {
                var scoreForRapper1 = this.scoreForRapperInRound(1, round);
                var scoreForRapper2 = this.scoreForRapperInRound(2, round);
                if (scoreForRapper1 > scoreForRapper2) {
                    r1Wins++;
                } else if(scoreForRapper1 < scoreForRapper2) {
                    r2Wins++;
                }
            }
            return r1Wins+"-"+r2Wins;
        },
        scoreForRapperInRound: function (rapper, round) {
            var score = 0;
            var punchesKey = "r" + rapper + "punches";
            score += this.rounds[round][punchesKey].length;
            if (!(typeof this.rounds[round].scores[rapper - 1] === "undefined")) {
                var categories = this.rounds[round].scores[rapper - 1].categories;
                Object.keys(categories).forEach(function (category) {
                    score += categories[category];
                });
            }
            return score;
        }
    };
};