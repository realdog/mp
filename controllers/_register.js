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
    this.businessWei = businessWeiId;
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
    this.callback();
};

_Register.prototype._check = function() {
    Player
    .find({playerWeiId: this.userWeiId, busiunesWeiId: this.businessWeiId})
    .exec(function(error, players) {
        if (!!error) {
            this.error = true;
            this.status = error;
            callback();
        } else if (players.length == 0){
            var newPlayer = new Player({});
            newPlayer.playerWeiId = this.userWeiId;
            newPlayer.busiunesWeiId = this.businessWeiId;
            newPlayer.status = 'recordBaseRegInfo';
            newPlayer.save(function(err){
                //var text = genTextXml(userWeiId, businessWeiId, "亲爱的，您是第一次来使用这个功能吧! 嘿嘿，那我要怎么称呼您呢？告诉我才好开始哦!", 0);
                this.error = false;
                this.status = 'justRegBaseRegInfo';
                //var returnStatus = {error: false, status: "justRegBaseRegInfo"};
                callback();
            });
        } else if (players.length == 1) {
            var status = players[0].status;
            switch (status) {
                case 'fullRegister':
                    this.error = false;
                    this.status = 'fullRegister';
                    callback();
                    break;
                case 'justRegBaseRegInfo':
                    var lastTime = new Date(players[0].createDate);
                    if (Date.now() - lastTime >= 360000) {
                        players[0].createDate = new Date();
                        players[0].save(function(err){
                            if (!!err) {
                                this.error = true;
                                this.status = err;
                                //var returnStatus = {error: true,  status: err}
                                //var text = genTextXml(userWeiId, businessWeiId, "亲，似乎现在系统正在维护！稍后试验下吧", 1);
                            } else {
                                this.error = false;
                                this.status = 'timeout'
                                //var returnStatus = {error: false,  status: 'timeout'}
                                //var text = genTextXml(userWeiId, businessWeiId, '<a href="http://www.lessky.com">亲，刚才小编我睡着了，能否重新告诉我你的大名呀!</a>', 0);
                            }
                            callback();
                        });
                        
                    } else {
                        this.status = 'justRegBaseRegInfo'
                        this.error = false;
                        callback();
                    }
                    break;
                default:
                    this.error = false;
                    this.status = 'unknow';
                    callback();                
                    
                    
            }
        } else {
            this.error = false;
            this.status = 'multiRecorder';
            this._callback();
            //var text = genTextXml(userWeiId, businessWeiId, "奇怪，难道我们之前认识。。。找xx反应下吧", 1);
            //callback({error: false,  msg: text});
        }
        
    
    });
};

_Register.prototype._register = function() {
    Player
    .find({playerWeiId: this.userWeiId, busiunesWeiId: this.businessWeiId})
    .exec(function(error, players) {
        if (!!error) {
            this.error = true;
            this.status = error;
            this._callback();
        } else if (players.length == 0){
            var newPlayer = new Player({});
            newPlayer.playerWeiId = this.userWeiId;
            newPlayer.busiunesWeiId = this.businessWeiId;
            newPlayer.status = 'fullRegister';
            newPlayer.playName = this.content;            
            newPlayer.save(function(err){
                var text = genTextXml(userWeiId, businessWeiId, "亲爱的，您是第一次来使用这个功能吧! 嘿嘿，那我要怎么称呼您呢？告诉我才好开始哦!", 0);
                this.error = false;
                this.status = 'fullRegister';
                var returnStatus = {error: false, status: "fullRegister"};
                this.callback(returnStatus);
            });
        } else if (players.length == 1) {
            var status = players[0].status;
            switch (status) {
                case 'fullRegister':
                    this.error = false;
                    this.status = 'fullRegister';
                    players[0].status = 'fullRegister';
                    players[0].playName = this.content;            
                    players[0].createDate = new Date();
                    players[0].save(function(err){
                        if (!!err) {
                            this.error = true;
                            this.status = err;
                            var returnStatus = {error: true,  status: err}
                            //var text = genTextXml(userWeiId, businessWeiId, "亲，似乎现在系统正在维护！稍后试验下吧", 1);
                        } else {
                            this.error = false;
                            this.status = 'timeout'
                            var returnStatus = {error: false,  status: 'timeout'}
                            //var text = genTextXml(userWeiId, businessWeiId, '<a href="http://www.lessky.com">亲，刚才小编我睡着了，能否重新告诉我你的大名呀!</a>', 0);
                        }
                        this._callback();
                    });
                    break;            
                case 'justRegBaseRegInfo':
                    var lastTime = new Date(players[0].createDate);
                    if (Date.now() - lastTime >= 360000) {
                        players[0].status = 'fullRegister';
                        players[0].playName = this.content;            
                        players[0].createDate = new Date();
                        players[0].save(function(err){
                            if (!!err) {
                                this.error = true;
                                this.status = err;
                                var returnStatus = {error: true,  status: err}
                                //var text = genTextXml(userWeiId, businessWeiId, "亲，似乎现在系统正在维护！稍后试验下吧", 1);
                            } else {
                                this.error = false;
                                this.status = 'timeout'
                                var returnStatus = {error: false,  status: 'timeout'}
                                //var text = genTextXml(userWeiId, businessWeiId, '<a href="http://www.lessky.com">亲，刚才小编我睡着了，能否重新告诉我你的大名呀!</a>', 0);
                            }
                            this._callback();
                        });
                        
                    } else {
                        players[0].status = 'fullRegister'
                        players[0].playName = this.content;
                        players[0].save(function(err){
                            if (!!err) {
                                var text = genTextXml(userWeiId, businessWeiId, "亲，你的名字好帅呀。不过，似乎现在系统正在维护哦!", 1);
                                this.error = true;
                                this.status = 'lastRegError';
                            } else {
                                var text = genTextXml(userWeiId, businessWeiId, "亲，你的名字好帅呀。", 0);
                                this.error = false;
                                this.status = 'fullRegister';
                            }
                            this._callback();
                            
                        });
                    }
                    break;
                default:
                    
                    
            }
        } else {
            this.error = false;
            this.status = 'multiRecorder';
            this._callback();                 
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
                case 'recordBaseRegInfo':
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