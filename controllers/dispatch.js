var fs = require('fs');
var mongoose = require('mongoose');
var _ = require('underscore');
var Player = mongoose.model('Player');
var Business = mongoose.model('Business');
var Player = mongoose.model('Player');
var Status = mongoose.model('Status');
var userUtil = require('../util/util');
var games_path = __dirname + '/games';
var Register = require('./register').Register;
var games_list = {};
var genTextXml = util.genTextXml;

fs.readdirSync(games_path).forEach(function (file) {
   var tmpObj = require(games_path+'/'+file);
   games_list[tmpObj.alias] = tmpObj;
});


exports.dispatch = function(req, res, data) {
    var msgType = data['xml']['MsgType'];
    var targetUser = data['xml']['FromUserName'];
    var fromUser = data['xml']['ToUserName'];
    console.log(JSON.stringify(data));
    Player
    .find({playerWeiId: targetUser, businessWeiId: fromUser})
    .exec(function(error, player) {
        console.log(error);
        if (!!error) {
            var text = genTextXml(targetUser, fromUser, JSON.stringify(), 1);
            res.send(text);
        } else {
            if (player.length == 0) {
                var begin = function(msgObj) {
                    res.send(msgObj.msg);
                };
                Register(req, res, targetUser, fromUser, false, begin, data);
            } else if (player.length > 1) {
                
            } else {
                begin(player.name);
            }
        }
        console.log("error:" + error);
        console.log("player:" + player);
    });

}