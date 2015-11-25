describe("BattleService", function() {

    var svc;
    var testRapper1 = "rapper one";
    var testRapper2 = "rapper two";

    beforeEach(function() {
        svc = BattleTapez.BattleService();
        svc.startBattle(testRapper1, testRapper2);
    });

    it("Can start battles",function() {
        expect(svc.rapper).toBe(1);
        expect(svc.round).toBe(1);
    });

    it("Can return the current rapper's name", function() {
        expect(svc.currentRapperName()).toBe(testRapper1);
    });
    it("Can track punches", function() {
        svc.addPunch({});
        svc.addPunch({});
        expect(svc.scoreForRapper(svc.rapper)).toBe(2);
    });
    it("Can track categories", function() {
        svc.setScore('test category', 5);
        svc.setScore('test category 2', 5);
        expect(svc.scoreForRapper(svc.rapper)).toBe(10);
    });
    it("Can score rounds", function() {
        svc.addPunch({});
        svc.addPunch({});
        expect(svc.scoreForRapper(svc.rapper)).toBe(2);
        svc.setScore('test category', 5);
        svc.setScore('test category 2', 5);
        expect(svc.scoreForRapper(svc.rapper)).toBe(12);
    });
    it("Can advance to the second in a round", function() {
        svc.nextRapper();
        expect(svc.currentRapperName()).toBe(testRapper2);
    });
    it("Can advance to the next round in a battle", function() {
        svc.nextRound();
        expect(svc.round).toBe(2);
    });
    it("Can track and score multi-rapper multi-round battles", function() {
        // first rapper first round
        svc.addPunch({});
        svc.addPunch({});
        expect(svc.scoreForRapper(svc.rapper)).toBe(2);
        svc.setScore('test category', 5);
        svc.setScore('test category 2', 5);
        expect(svc.scoreForRapper(svc.rapper)).toBe(12);

        // second rapper first round
        svc.nextRapper();
        svc.addPunch({});
        svc.addPunch({});
        svc.addPunch({});
        expect(svc.scoreForRapper(svc.rapper)).toBe(3);
        svc.setScore('test category', 4);
        svc.setScore('test category 2', 3);
        expect(svc.scoreForRapper(svc.rapper)).toBe(10);

        // first rapper second round
        svc.nextRound();
        svc.nextRapper();
        expect(svc.scoreForRapper(svc.rapper)).toBe(12);
        svc.addPunch({});
        svc.setScore('test category', 1);
        svc.setScore('test category 2', 2);
        expect(svc.scoreForRapper(svc.rapper)).toBe(16);

        // second rapper second round
        svc.nextRapper();
        expect(svc.scoreForRapper(svc.rapper)).toBe(10);
        svc.addPunch({});
        svc.addPunch({});
        svc.addPunch({});
        svc.addPunch({});
        svc.setScore('test category', 5);
        svc.setScore('test category 2', 5);
        svc.setScore('test category 3', 5);
        svc.setScore('test category 4', 5);
        expect(svc.scoreForRapper(svc.rapper)).toBe(34);

        expect(svc.getWinner()).toBe(svc.rapper2);
    });

    it("Can detect a tie", function() {
        // ARRANGE
        // first rapper
        svc.addPunch({});

        svc.nextRapper();

        // second rapper
        svc.addPunch({});

        // ACT & ASSERT
        expect(svc.getWinner()).toBe("TIE");
        expect(svc.winComparison()).toBe("0-0");
    });

    it("Can specify how many rounds a rapper won", function() {
        // first rapper first round
        svc.addPunch({});
        svc.addPunch({});

        // second rapper first round
        svc.nextRapper();

        svc.addPunch({});

        // rapper 1 wins

        // first rapper second round
        svc.nextRound();
        svc.nextRapper();

        svc.addPunch({});
        svc.addPunch({});

        // second rapper second round
        svc.nextRapper();

        svc.addPunch({});

        // rapper 1 wins

        // first rapper second round
        svc.nextRound();
        svc.nextRapper();

        svc.addPunch({});

        // second rapper second round
        svc.nextRapper();

        svc.addPunch({});
        svc.addPunch({});

        // rapper 2 wins

        expect(svc.winComparison()).toBe("2-1");
    });

    it("Can get the specific score for a specific rapper for a specific round", function() {
        svc.addPunch({});
        svc.addPunch({});
        expect(svc.scoreForRapperInRound(svc.rapper,0)).toBe(2);

        svc.nextRound();
        svc.nextRapper();

        svc.addPunch({});
        svc.addPunch({});
        svc.addPunch({});
        expect(svc.scoreForRapperInRound(svc.rapper,1)).toBe(3);
    });

});