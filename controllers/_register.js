var events = new require("events");
var redis = require("redis");
var client = redis.createClient();
var fs = require('fs');
var mongoose = require('mongoose');
var _ = require('underscore');
var Player = mongoose.model('Player');
var Business = mongoose.model('Business');
var Status = mongoose.model('Status');
var userUtil = require('../util/util');
var util = require('util');
var genTextXml = userUtil.genTextXml;

var _Register = function(userWeiId, businessWeiId, callback, data) {
    this.userWeiId = userWeiId;
    this.businessWeiId = businessWeiId;
    this.content = data['xml']['Content'].replace(/ /g, '');
    this.callback = callback;
    this.error = false;
    if ((this.content.length >>> 0) <= 0 ) {
        this.error = true;
        this.status = 'nullContent';
    }
};

util.inherits(_Register, events.EventEmitter);

_Register.prototype._callback = function() {
    console.log("_register");
    this.callback();
};

_Register.prototype._check = function() {
    var that = this;
    Player
    .find({playerWeiId: this.userWeiId, busiunesWeiId: this.businessWeiId})
    .exec(function(error, players) {
        if (!!error) {
            that.error = true;
            that.status = error;
            that._callback();
        } else if (players.length == 0){
            var newPlayer = new Player({});
            var tempPlayer = {};
            newPlayer.playerWeiId = that.userWeiId;
            tempPlayer.playerWeiId = that.userWeiId;
            
            newPlayer.busiunesWeiId = that.businessWeiId;
            tempPlayer.busiunesWeiId = that.businessWeiId;
            
            newPlayer.status = 'justRegBaseInfo';
            tempPlayer.status = 'justRegBaseInfo';
            
            newPlayer.uniqueHashKey = that.uniqueHashKey;
            tempPlayer.uniqueHashKey = that.uniqueHashKey;
            
            newPlayer.userWeiIdHashKey = that.userWeiIdHashKey;
            tempPlayer.userWeiIdHashKey = that.userWeiIdHashKey;
            
            newPlayer.businessWeiIdHashKey = that.businessWeiIdHashKey;
            tempPlayer.businessWeiIdHashKey = that.businessWeiIdHashKey;
            
            tempPlayer.insert = false;
            
            newPlayer.save(function(err){
                if (!!err) {
                    that.error = true;
                    that.status = err;
                    // save to file
                } else {
                    tempPlayer.insert = true;
                    that.error = false;
                    that.status = 'justRegBaseInfo';
                    console.log(JSON.stringify(tempPlayer));
                    console.log(typeof(tempPlayer.uniqueHashKey))
                    console.log(typeof(that.uniqueHashKey))
                    client.set("4e98db17f2e0ba73989dfb39bff2d1f4", JSON.stringify(tempPlayer), function(err, reply){
                        if (!!err) {
                        
                        } else {
                            console.log(reply);
                            that._callback();
                        }
                    });                    

                }
            });
        } else if (players.length == 1) {
            var status = players[0].status;
            switch (status) {
                case 'fullRegister':
                    that.error = false;
                    that.status = 'fullRegister';
                    that._callback();
                    break;
                case 'justRegBaseInfo':
                    var lastTime = new Date(players[0].createDate);
                    players[0].createDate = new Date();
                    players[0].save(function(err){
                        if (!!err) {
                            that.error = true;
                            that.status = err;
                        } else {
                            that.error = false;
                            that.status = 'updateVisitTime'
                        }
                        that._callback();
                    });                    
                    break;
                default:
                    that.error = false;
                    that.status = 'unknow';
                    that._callback();
                    
                    
            }
        } else {
            that.error = false;
            that.status = 'multiRecorder';
            that._callback();
        }
    });
};

_Register.prototype._register = function() {
    var that = this;
    Player
    .find({playerWeiId: this.userWeiId, busiunesWeiId: this.businessWeiId})
    .exec(function(error, players) {
        if (!!error) {
            that.error = true;
            that.status = error;
            that._callback();
        } else if (players.length == 0){
            var newPlayer = new Player({});
            var tempPlayer = {};
            newPlayer.playerWeiId = that.userWeiId;
            tempPlayer.playerWeiId = that.userWeiId;
            
            newPlayer.busiunesWeiId = that.businessWeiId;
            tempPlayer.busiunesWeiId = that.businessWeiId;
            
            newPlayer.status = 'fullRegister';
            tempPlayer.status = 'fullRegister';
            
            newPlayer.playName = that.content;
            tempPlayer.playName = that.content;
            
            newPlayer.uniqueHashKey = that.uniqueHashKey;
            tempPlayer.uniqueHashKey = that.uniqueHashKey;
            
            newPlayer.userWeiIdHashKey = that.userWeiIdHashKey;
            tempPlayer.userWeiIdHashKey = that.userWeiIdHashKey;
            
            newPlayer.businessWeiIdHashKey = that.businessWeiIdHashKey;            
            tempPlayer.businessWeiIdHashKey = that.businessWeiIdHashKey;            
            
            newPlayer.save(function(err){
                if (!!err) {
                    that.error = true;
                    that.status = 'fullRegister';
                } else {
                    that.error = false;
                    that.status = 'fullRegister';
                }
                client.set(tempPlayer.uniqueHashKey, JSON.stringify(tempPlayer), function(err){
                    if (!!err) {
                        // save to file
                    } else {
                    }
                    that._callback();
                });                   
            });
        } else if (players.length == 1) {
            var status = players[0].status;
            switch (status) {
                case 'fullRegister':
                    that.error = false;
                    that.status = 'fullRegister';
                    that._callback();
                    break;
                case 'justRegBaseInfo':
                case 'hadRegBaseInfo':
                    console.log(players[0]);
                    players[0].createDate = new Date();
                    players[0].status = 'fullRegister'
                    players[0].playName = that.content;
                    players[0].save(function(err){
                        if (!!err) {
                            that.error = true;
                            that.status = 'lastStepRegError';
                        } else {
                            that.error = false;
                            that.status = 'fullRegister';
                        }
                        that._callback();
                    });              
                    return;
                default:
                    that.error = false;
                    that.status = 'unknow';
                    that._callback();
            }
        } else {
            that.error = false;
            that.status = 'multiRecorder';
            that._callback();
            //var text = genTextXml(userWeiId, businessWeiId, "奇怪，难道我们之前认识。。。找xx反应下吧", 1);
            //callback({error: false,  msg: text});
        }
        
    
    });

/*
    
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
                case 'justRegBaseInfo':
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
*/
};

exports._Register = _Register;
