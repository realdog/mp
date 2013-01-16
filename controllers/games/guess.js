var mongoose = require('mongoose');
var _ = require('underscore');
var Game = mongoose.model('Game');

module.exports = {
    alias: 'guess',
    function: game
};
var game = function(gameId, userName, businessId){
    var gameInfo = Game
    .find({_id: gameId})
    .exec(function(err, gameInfomation) {
        if (err) return res.render('500');
        var upLimit = gameInfomation.upLimit;
        var lowLimit = gameInfomation.lowLimit;
        var num = Math.ceil(Math.random(lowLimit, upLimit) * upLimit);
        var times = gameInfomation.times;
        
    });
    
};