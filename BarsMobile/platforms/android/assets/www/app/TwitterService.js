BattleTapez = typeof BattleTapez === "undefined" ? {} : BattleTapez;

BattleTapez.TwitterService = function() {
    return {
        postStatus: function(message) {
            return "SUCCESS";
        }
    }
};
