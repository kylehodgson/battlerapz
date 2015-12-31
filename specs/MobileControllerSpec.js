describe("Mobile Controller", function() {

    var testRapper1 = "rapper one";
    var testRapper2 = "rapper two";
    var $scope;

    beforeEach(function() {
        mockDeviceFeedback();
        module('bars');
    });

    beforeEach(inject(function(_$controller_){
        var $controller = _$controller_;
        $scope = {};
        $scope.$apply=function() {
            //console.log("applying scope")
        }
        $controller('mobileCtrl',{$scope: $scope});
        $scope.startBattle(testRapper1,testRapper2);
    }));
    
    function mockDeviceFeedback() {
        if(typeof window === "undefined") window={}
        if(typeof window.plugins === "undefined") window.plugins={}
        if(typeof window.plugins.deviceFeedback === "undefined") window.plugins.deviceFeedback={}
        window.plugins.deviceFeedback.haptic=function() {
            //console.log("Buzz!");
        }
    }

    it("Exposes the current round", function() {
        expect($scope.getRound()).toBe(1);
    });
    
    it("Correctly exposes the current rapper", function() {
        
        expect($scope.rapperName()).toBe(testRapper1, "Battle didnt start with correct rapper name");
        
        $scope.nextRound();
        expect($scope.rapperName()).toBe(testRapper2, "Advancing to next round didnt change rapperName to second rapper");
    })

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

    it("Should compose a tweet for users",function() {
        // Rapper one ... one punch
        $scope.addPunch();

        $scope.nextRound();

        // Rapper two ... two punches
        $scope.addPunch();
        $scope.addPunch();

        $scope.computeFinals();

        expect($scope.tweet).toBe(
            "Just finished scoring "+testRapper1+" vs "+testRapper2+". "+testRapper2+" wins 0-1, " +
            "punch score "+testRapper1+": 1, "+testRapper2+": 2"
        );

    });
    
    it("Should clear the previous battle when clearing a battle",function() {
        // Rapper one ... one punch
        $scope.addPunch()

        $scope.nextRound()

        // Rapper two ... two punches
        $scope.addPunch()
        $scope.addPunch()

        $scope.computeFinals()
        
        expect($scope.rapper1Score).toBe(1)
        expect($scope.rapper2Score).toBe(2)
        
        expect($scope.rapper1Name).toBe(testRapper1)
        expect($scope.rapper2Name).toBe(testRapper2)
        
        $scope.clearBattle()
        
        expect($scope.rapper1Score).toBe(0)
        expect($scope.rapper2Score).toBe(0)
        
        expect($scope.rapper1Name).toBe("")
        expect($scope.rapper2Name).toBe("")

    });
    
    it("Should report extensive scoring upon completion of the battle",function() {
        
        // ROUND 1 (Rapper 2 wins)
        // Rapper one ... one punch
        $scope.addPunch()
        $scope.setScore('jokes',3)

        $scope.nextRound();

        // Rapper two ... two punches
        $scope.addPunch()
        $scope.addPunch()
        $scope.setScore('jokes',4)
        
        // ROUND 2 (Tie)
        $scope.nextRound()
        
        // Rapper one ... one punch
        $scope.addPunch()

        $scope.nextRound()
        
        // Rapper two ... one punch
        $scope.addPunch()
        
        // ROUND 3 (Rapper 1 wins)
        $scope.nextRound()
        
        // Rapper one ... two punches
        $scope.addPunch()
        $scope.addPunch()

        $scope.nextRound()
        
        // Rapper two ... one punch
        $scope.addPunch()
        
        // ROUND 4 (Rapper 1 wins)
        $scope.nextRound()
        
        // Rapper one ... four punches
        $scope.addPunch()
        $scope.addPunch()
        $scope.addPunch()
        $scope.addPunch()

        $scope.nextRound()
        
        // Rapper two ... one punch
        $scope.addPunch()
        
        $scope.computeFinals()
        
        
        expect($scope.winner).toBe(testRapper1)
        expect($scope.rapper1Score).toBe(11)
        expect($scope.rapper2Score).toBe(9)
        expect($scope.rapper1Name).toBe(testRapper1)
        expect($scope.rapper2Name).toBe(testRapper2)

        // per rapper
        // per round: punch scores
        expect($scope.battle().round(1).rapper(1).punches()).toBe(1) 
        expect($scope.battle().round(1).rapper(2).punches()).toBe(2)
        
        // per round: performance scores
        expect($scope.battle().round(1).rapper(1).category('jokes')).toBe(3) 
        expect($scope.battle().round(1).rapper(2).category('jokes')).toBe(4) 
        
        // per round: total performance scores
        expect($scope.battle().round(1).rapper(1).totalCategoryScore()).toBe(3)
        expect($scope.battle().round(1).rapper(2).totalCategoryScore()).toBe(4) 
        
        // per round: total scores
        expect($scope.battle().round(1).rapper(1).total()).toBe(4)
        expect($scope.battle().round(1).rapper(2).total()).toBe(6)
        
        // round winner
        expect($scope.battle().round(1).winner()).toBe(testRapper2)
        expect($scope.battle().round(2).winner()).toBe("TIE")
        expect($scope.battle().round(3).winner()).toBe(testRapper1)
        expect($scope.battle().round(4).winner()).toBe(testRapper1)
        
        // per rapper
        // overall scores
        expect($scope.battle().rapper(1).total()).toBe(11)
        expect($scope.battle().rapper(2).total()).toBe(9)
        
        // overall winner by rounds won
        expect($scope.battle().winner()).toBe(testRapper1)
        
        // overall punch score
        expect($scope.battle().rapper(1).punches()).toBe(8)
        expect($scope.battle().rapper(2).punches()).toBe(5)
        
        // per category: category score
        $scope.battle().categories().forEach(function(categoryName) {
            expect($scope.battle().rapper(1).category(categoryName)).toBe(3)
            expect($scope.battle().rapper(2).category(categoryName)).toBe(4)
        });
        
        // total of all categories
        expect($scope.battle().rapper(1).totalCategoryScore()).toBe(3)
        expect($scope.battle().rapper(2).totalCategoryScore()).toBe(4)
        
        // overall scores table
        
        // rounds won
        expect($scope.battle().rapper(1).roundsWon()).toBe(2)
        expect($scope.battle().rapper(2).roundsWon()).toBe(1)
        
    })
    
    it("Should be able to initialize without complaining about undefined values in the data structure",function() {
        //$scope.computeFinals()

        // per rapper
        // per round: punch scores
        expect($scope.battle().round(1).rapper(1).punches()).toBe(0) 
        expect($scope.battle().round(1).rapper(2).punches()).toBe(0)
        
        // per round: performance scores
        expect($scope.battle().round(1).rapper(1).category('jokes')).toBe(0)
        expect($scope.battle().round(1).rapper(2).category('jokes')).toBe(0) 

        // per round: total performance scores
        expect($scope.battle().round(1).rapper(1).totalCategoryScore()).toBe(0)
        expect($scope.battle().round(1).rapper(2).totalCategoryScore()).toBe(0) 
        
        // per round: total scores
        expect($scope.battle().round(1).rapper(1).total()).toBe(0)
        expect($scope.battle().round(1).rapper(2).total()).toBe(0)
        
        // round winner
        expect($scope.battle().round(1).winner()).toBe("TIE")
        
        // per rapper
        // overall scores
        expect($scope.battle().rapper(1).total()).toBe(0)
        expect($scope.battle().rapper(2).total()).toBe(0)
        
        // overall winner by rounds won
        expect($scope.battle().winner()).toBe("TIE")
        
        // overall punch score
        expect($scope.battle().rapper(1).punches()).toBe(0)
        expect($scope.battle().rapper(2).punches()).toBe(0)
        
        // per category: category score
        $scope.battle().categories().forEach(function(categoryName) {
            expect($scope.battle().rapper(1).category(categoryName)).toBe(0)
            expect($scope.battle().rapper(2).category(categoryName)).toBe(0)
        });
        
        // total of all categories
        expect($scope.battle().rapper(1).totalCategoryScore()).toBe(0)
        expect($scope.battle().rapper(2).totalCategoryScore()).toBe(0)
    })
    
    it("can return a list of rounds suitable for a repeater",function() {
        // We start at Round One
        
        // Round Two
        $scope.nextRound()
        $scope.nextRound()
        
        // Round Three
        $scope.nextRound()
        $scope.nextRound()
        
        expect($scope.battle().listOfRounds()).toEqual([1,2,3])
    })
    
    it("can return a list of categories suitable for a repeater",function() {
        $scope.setScore('cat1',1)
        $scope.setScore('cat2',2)
        $scope.setScore('cat3',3)
        $scope.setScore('error',-4)
        $scope.nextRound()
        $scope.setScore('cat1',1)
        $scope.setScore('cat2',2)
        $scope.setScore('cat3',3)
        $scope.setScore('error',-4)
        $scope.nextRound()
        
        $scope.setScore('cat1',1)
        $scope.setScore('cat2',2)
        $scope.setScore('cat3',3)
        $scope.setScore('error',-4)
        $scope.nextRound()
        $scope.setScore('cat1',1)
        $scope.setScore('cat2',2)
        $scope.setScore('cat3',3)
        $scope.setScore('error',-4)
        
        expect($scope.battle().listOfScoreCategories()).toEqual(['cat1','cat2','cat3'])
        expect($scope.battle().listOfErrorCategories()).toEqual(['error'])
    })
});