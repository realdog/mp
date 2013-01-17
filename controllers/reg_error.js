var fs = require('fs');
var mongoose = require('mongoose');
var _ = require('underscore');
var Player = mongoose.model('Player');
var Business = mongoose.model('Business');
var Player = mongoose.model('Player');
var Status = mongoose.model('Status');
var userUtil = require('../util/util');
var genTextXml = userUtil.genTextXml;
exports.reg = function(req, res, userWeiId, businessWeiId, gameId, callback, data) {
    console.log('reg');
    Status
    .find({playerWeiId: userWeiId, busiunesWeiId: businessWeiId})
    .exec(function(error, status) {
        console.log(error);
        console.log(status);
        if (!!error) {
            callback({error: true, res: res, msg: '服务升级中'});
        } else if (status.length == 0){
            var newStatus = new Status({});
            newStatus.playerWeiId = userWeiId;
            newStatus.busiunesWeiId = businessWeiId;
            newStatus.step = 'reg';
            if (!!gameId) {
                newStatus.gameId = gameId;
            }
            newStatus.save(function(err){
                var text = genTextXml(userWeiId, businessWeiId, "亲爱的，您是第一次来吧! 嘿嘿，那我要怎么称呼您呢？告诉我才好开始哦!", 0);
                res.send(text);
            });
        } else if (status.length == 1) {
            var step = status.step;
            switch (step) {
                case 'reg':
                    status.step = 'regOk'
                    var userName = data['xml']['Content'].replace(/ /g, '');
                    if ((userName.length >>> 0) <= 0 ) {
                        var text = genTextXml(userWeiId, businessWeiId, "亲你不能叫空格哦!", 0);
                        res.send(text);
                    } else {
                        status.userName = userName;
                        status.save(function(err){
                            if (!!err) {
                                var text = genTextXml(userWeiId, businessWeiId, "亲，你的名字好帅呀。不过，似乎现在系统正在维护哦!", 1);
                                res.send(text);
                            } else {
                                var text = genTextXml(userWeiId, businessWeiId, "亲，你的名字好帅呀。", 0);
                                res.send(t4ext);
                            }
                        });
                    
                    }
                    
                    
                    break;
                default:
                    
                    
            }
        } else {
            var text = genTextXml(userWeiId, businessWeiId, "奇怪，难道我们之前认识。。。找xx反应下吧", 1);
            res.send(text);
        }
    });
};