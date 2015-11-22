describe("Mobile Controller", function() {

    var testRapper1 = "rapper one";
    var testRapper2 = "rapper two";

    var $scope;
    var controller;

    beforeEach(function() {
        module('bars');
    });

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
        $scope = {};
        controller = $controller('mobileCtrl',{$scope: $scope});
        $scope.startBattle(testRapper1,testRapper2);
    }));

    it("Exposes the current round", function() {
        expect($scope.getRound()).toBe(1);
    });

    it("Tracks punches", function() {
        // Rapper one ... one punch
        $scope.addPunch();

        $scope.nextRound();

        // Rapper two ... two punches
        $scope.addPunch();
        $scope.addPunch();

        $scope.computeFinals();
        expect($scope.winner).toBe(testRapper2);
    });

    it("Calculates errors against final score", function() {
        // ARRANGE
        // Rapper one ... two punches
        $scope.addPunch();
        $scope.addPunch();

        $scope.nextRound();

        // Rapper two ... two punches
        $scope.addPunch();
        $scope.addPunch();

        //ACT - Rapper two, one error
        $scope.setErrors("error cat", 1);

        // ASSERT
        $scope.computeFinals();
        expect($scope.winner).toBe(testRapper1);
        expect($scope.rapper2Score).toBe(1);
    });

    it("Exposes a winner", function() {
        // ARRANGE
        // Rapper one ... one punch, score of 3 for test category
        $scope.addPunch();
        $scope.setScore("test cat",3);

        $scope.nextRound();

        // Rapper two ... one punch, score of 3 for test category, subtract one error
        $scope.addPunch();
        $scope.setScore("test cat", 3);
        $scope.setErrors("error cat", 1);

        // ACT
        $scope.computeFinals();

        // ASSERT
        expect($scope.winner).toBe(testRapper1);
        expect($scope.rapper1Score).toBe(4);
        expect($scope.rapper2Score).toBe(3);
        expect($scope.rapper1Name).toBe(testRapper1);
        expect($scope.rapper2Name).toBe(testRapper2);
    });
});