var fs = require('fs');
var mongoose = require('mongoose');
var _ = require('underscore');
var Player = mongoose.model('Player');
var Business = mongoose.model('Business');
var Status = mongoose.model('Status');
var util = require('../util/util');
var genTextXml = util.genTextXml;
exports.reg = function(req, res, userWeiId, businessWeiId, gameId, callback, data) {
    
    Player
    .find({playerWeiId: userWeiId, busiunesWeiId: businessWeiId})
    .exec(function(error, players) {
        if (!!error) {
            callback({error: true,  msg: '服务升级中'});
        } else if (players.length == 0){
            var newPlayer = new Player({});
            newPlayer.playerWeiId = userWeiId;
            newPlayer.busiunesWeiId = businessWeiId;
            newPlayer.status = 'reg';
            if (!!gameId) {
                newPlayer.gameId = gameId;
            }
            newPlayer.save(function(err){
                var text = genTextXml(userWeiId, businessWeiId, "亲爱的，您是第一次来吧! 嘿嘿，那我要怎么称呼您呢？告诉我才好开始哦!", 0);
                callback({error: false,  msg: text});
            });
        } else if (players.length == 1) {
            var status = players[0].status;
            switch (status) {
                case 'reg':
                    var lastTime = new Date(players[0].createDate);
                    if (Date.now() - lastTime >= 10000) {
                        players[0].createDate = new Date();
                        players[0].save(function(err){
                            if (!!err) {
                                var text = genTextXml(userWeiId, businessWeiId, "亲，似乎现在系统正在维护！稍后试验下吧", 1);
                            } else {
                                var text = genTextXml(userWeiId, businessWeiId, '<a href="http://www.lessky.com">亲，刚才小编我睡着了，能否重新告诉我你的大名呀!</a>', 0);
                            }
                            callback({error: false,  msg: text});
                        });
                        
                    } else {
                        players[0].status = 'regOk'
                        var userName = data['xml']['Content'].replace(/ /g, '');
                        if ((userName.length >>> 0) <= 0 ) {
                            var text = genTextXml(userWeiId, businessWeiId, "亲你不能叫空格哦!", 0);
                            res.send(text);
                        } else {
                            players[0].playName = userName;
                            players[0].save(function(err){
                                if (!!err) {
                                    var text = genTextXml(userWeiId, businessWeiId, "亲，你的名字好帅呀。不过，似乎现在系统正在维护哦!", 1);
                                    callback({error: true,  msg: text});
                                } else {
                                    var text = genTextXml(userWeiId, businessWeiId, "亲，你的名字好帅呀。", 0);
                                    callback({error: false,  msg: text});
                                }
                                
                            });
                        }                   
                    }
                    break;
                default:
                    
                    
            }
        } else {
            var text = genTextXml(userWeiId, businessWeiId, "奇怪，难道我们之前认识。。。找xx反应下吧", 1);
            callback({error: false,  msg: text});
        }
    });
};