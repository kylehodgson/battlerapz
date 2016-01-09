describe('B.A.R.S.', function() {
    
    var page;
    var EC = protractor.ExpectedConditions

    beforeEach(function () {
        page = new BarsPage(EC);
    });
  
    it('should show instructions for scoring', function() {
        page.viewInstructionsButton.click().then(function() {
            browser.wait(EC.visibilityOf(page.scoreInstructionsDiv),5000)
            expect(page.scoreInstructionsDiv.getText()).toMatch("Once the rappers names have been entered")
        })
        
    });
    
    it('should allow judges to enter the rappers for a battle',function() {
        page.startBattle.click()
        page.enterRapperOne('rapper one')
        
        expect(page.rapperOneButton.getText()).toMatch('rapper one')
    //     page.enterRapperOne('rapper one')
    //     page.enterRapperTwo('rapper two')
    //     page.rapperTwoButton.click()
    //     expect(page.text).toMatch("Scoring round for rapper two")
    });
    
    // it('should allow judges to score a battle',function() {
    //     page.enterRapperOne('rapper one')
    //     page.enterRapperTwo('rapper two')
    //     page.rapperOneButton.click()
        
    //     page.punchButton.click()
    //     page.punchButton.click()
    //     page.punchButton.click()
    //     page.nextRoundButton.click()
    //     page.category('jokes').stars(1).click()
    //     page.nextRoundButton.click()
    //     page.punchButton.click()
    //     page.punchButton.click()
    //     page.nextRoundButton.click()
    //     page.category('jokes').stars(1).click()
        
    //     page.finishBattleButton.click()
    //     expect(page.winner).toBe('rapper one')
        
    // })
});


var BarsPage = function () {
    browser.get('http://localhost:8000');
};

BarsPage.prototype = Object.create({}, {
    viewInstructionsButton: { 
        get: function() { 
            return $('#btn-how-to-score')
        }
    },
    scoreInstructionsDiv: { 
        get: function() { 
            return $('#text-how-to-score')
        } 
    },
    startBattle: {
        get: function() {
            return $('#btn-start-battle')
        }
    },
    rapperOneField: { 
        get: function() {
            return element(by.model('rapper1Name'))
        }
    },
    rapperTwoField: {
        get: function() {
            return element(by.model('rapper1Name'))
        }
    },
    rapperOneButton: {
        get: function() {
            return $('#btn-r1-start')
        }
    },
    rapperTwoButton: {
        get: function() {
            return $('#btn-r2-start')
        }
    },
    enterRapperOne: {
        value: function(keys) {
            var promise = this.rapperOneField.sendKeys(keys)
            return promise;
        }
    },
    enterRapperTwo: {
        value: function(keys) {
            return this.rapperTwoField.sendKeys(keys)
        }
    }
  });
