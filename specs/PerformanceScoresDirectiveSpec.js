describe("Performance Scores Directive",function() {
    var directive = null;
    beforeEach(function() {
        directive = BattleTapez.PerformanceScoresDirective();
    });
    it("exists",function() {
        expect(directive.templateUrl).toBe('partials/performance-scores.html');
    });
});