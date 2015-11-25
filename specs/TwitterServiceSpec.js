describe("TwitterService", function() {
    var svc  = null;
    var testMessage = "This is a tweet, yo!";

    beforeEach(function() {
        svc = BattleTapez.TwitterService();
    });

    it("Should exist",function() {
        expect(svc).not.toBeNull();
    });

    it("Should send messages",function() {
        var result = svc.postStatus(testMessage);
        expect(result).toBe("SUCCESS");
    });
});