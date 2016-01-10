var EC = protractor.ExpectedConditions

describe('B.A.R.S.', function() {
    browser.ignoreSynchronization = true;
    var page;    

    beforeEach(function () {
        page = new BarsPage(EC);
    });
  
    it('should show instructions for scoring', function() {
        page.viewInstructionsButton.click().then(function() {
            expect(page.scoreInstructionsDiv.getText()).toMatch("Once the rappers names have been entered")
        })
        
    });
    
    it('should allow judges to score a battle',function() {
        page.startBattle.click()
        page.enterRapperOne('rapper one')
        expect(page.rapperOneButton.getText()).toMatch('rapper one')
        
        page.enterRapperTwo('rapper two')
        page.rapperTwoButton.click()
        expect(page.punchScoringTitle.getText()).toMatch('Scoring punches for rapper two round 1')
        
        page.punchButton.click()
        page.punchButton.click()
        expect(page.punchTally.getText()).toMatch('2')
        page.roundFinishedButton.click()
        
        page.categoryScore('jokes',4).click()
        page.categoryScore('rapping',5).click()
        page.categoryScore('errors',1).click()
        expect(page.errorTally.getText()).toMatch('Subtracting -1 points for errors')
        
        page.nextRoundButton.click()
        page.punchButton.click()
        page.punchButton.click()
        page.punchButton.click()
        page.punchButton.click()
        page.roundFinishedButton.click()
        page.categoryScore('antics',2).click()
        page.categoryScore('freshness',3).click()
        page.finishBattleButton.click()
        
        expect(page.winner.getText()).toMatch('Winner: rapper two!')
    });
});


var BarsPage = function () {
    browser.get('http://localhost:8000');
};

var waitForElement = function(element)  {
    browser.wait(EC.visibilityOf(element),5000)
    return element
}

BarsPage.prototype = Object.create({}, {
    punchScoringTitle:      { get: function() { return waitForElement( $('#punch-scoring-title'))}},
    viewInstructionsButton: { get: function() { return waitForElement( $('#btn-how-to-score'))}},
    scoreInstructionsDiv:   { get: function() { return waitForElement( $('#text-how-to-score'))}},
    startBattle:            { get: function() { return waitForElement( $('#btn-start-battle'))}},
    rapperOneButton:        { get: function() { return waitForElement( $('#btn-r1-start'))}},
    rapperTwoButton:        { get: function() { return waitForElement( $('#btn-r2-start'))}},
    punchButton:            { get: function() { return waitForElement( $('#btnPunch'))}},
    punchTally:             { get: function() { return waitForElement( $('#punch-tally'))}},
    roundFinishedButton:    { get: function() { return waitForElement( $('#btn-round-finished'))}},
    nextRoundButton:        { get: function() { return waitForElement( $('#btn-next-round'))}},
    errorTally:             { get: function() { return waitForElement( $('#error-tally'))}},
    finishBattleButton:     { get: function() { return waitForElement( $('#btn-finish-battle'))}},
    winner:                 { get: function() { return waitForElement( $('#text-winner'))}},
    rapperOneField:         { get: function() { return waitForElement(element(by.model('rapper1Name')))}},
    rapperTwoField:         { get: function() { return waitForElement(element(by.model('rapper2Name')))}},
    enterRapperOne:         { value: function(keys) { return this.rapperOneField.sendKeys(keys)}},
    enterRapperTwo:         { value: function(keys) { return this.rapperTwoField.sendKeys(keys)}}
});

BarsPage.prototype.categoryScore = function (categoryName,score) {
    return waitForElement(  $( "#" + categoryName + "-" + score) )
}

