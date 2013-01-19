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

var _Register = function(playerWeiId, businessWeiId, callback, data) {
    this.playerWeiId = playerWeiId;
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
    .find({playerWeiId: this.playerWeiId, businessWeiId: this.businessWeiId})
    .exec(function(error, players) {
        if (!!error) {
            that.error = true;
            that.status = error;
            that._callback();
        } else if (players.length == 0){
            var newPlayer = new Player({});
            var tempPlayer = {};
            newPlayer.playerWeiId = that.playerWeiId;
            tempPlayer.playerWeiId = that.playerWeiId;
            
            newPlayer.businessWeiId = that.businessWeiId;
            tempPlayer.businessWeiId = that.businessWeiId;
            
            newPlayer.status = 'justRegBaseInfo';
            tempPlayer.status = 'justRegBaseInfo';
            
            newPlayer.uniqueHashKey = that.uniqueHashKey;
            tempPlayer.uniqueHashKey = that.uniqueHashKey;
            
            newPlayer.playerWeiIdHashId = that.playerWeiIdHashKey;
            tempPlayer.playerWeiIdHashId = that.playerWeiIdHashKey;
            
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
                    that.message = JSON.stringify(tempPlayer);
                    that._callback();
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
    .find({playerWeiId: this.playerWeiId, businessWeiId: this.businessWeiId})
    .exec(function(error, players) {
        if (!!error) {
            that.error = true;
            that.status = error;
            that._callback();
        } else if (players.length == 0){
            var newPlayer = new Player({});
            var tempPlayer = {};
            newPlayer.playerWeiId = that.playerWeiId;
            tempPlayer.playerWeiId = that.playerWeiId;
            
            newPlayer.businessWeiId = that.businessWeiId;
            tempPlayer.businessWeiId = that.businessWeiId;
            
            newPlayer.status = 'fullRegister';
            tempPlayer.status = 'fullRegister';
            
            newPlayer.playerName = that.content;
            tempPlayer.playerName = that.content;
            
            newPlayer.uniqueHashKey = that.uniqueHashKey;
            tempPlayer.uniqueHashKey = that.uniqueHashKey;
            
            newPlayer.playerWeiIdHashId = that.playerWeiIdHashKey;
            tempPlayer.playerWeiIdHashId = that.playerWeiIdHashKey;
            
            newPlayer.businessWeiIdHashKey = that.businessWeiIdHashKey;            
            tempPlayer.businessWeiIdHashKey = that.businessWeiIdHashKey;            
            
            newPlayer.save(function(err){
                if (!!err) {
                    that.error = true;
                    that.status = 'fullRegister';
                    that.insert = false;
                    tempPlayer.insert = false;
                } else {
                    that.error = false;
                    that.status = 'fullRegister';
                    that.insert = true;
                    tempPlayer.insert = true;
                }
                console.log("new save");
                that.message = JSON.stringify(tempPlayer);
                that._callback();                
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
                    players[0].createDate = new Date();
                    players[0].status = 'fullRegister'
                    players[0].playerName = that.content;
                    players[0].save(function(err){
                        console.log("reg save1:" + players[0]);
                        var tempPlayer = {};
                        if (!!err) {
                            that.error = true;
                            that.status = 'lastStepRegError';
                            tempPlayer.insert = false;
                        } else {
                            that.error = false;
                            that.status = 'fullRegister';
                            tempPlayer.insert = true;
                        }
                        tempPlayer.playerWeiId = players[0].playerWeiId;
                        tempPlayer.businessWeiId = players[0].businessWeiId;
                        tempPlayer.status = players[0].status;
                        tempPlayer.playerName = players[0].playerName;
                        tempPlayer.uniqueHashKey = players[0].uniqueHashKey;
                        tempPlayer.playerWeiIdHashId = players[0].playerWeiIdHashId;
                        tempPlayer.businessWeiIdHashKey = players[0].businessWeiIdHashKey; 
                        that.message = JSON.stringify(tempPlayer);
                        that._callback();
                    });              
                    return;
                default:
                    that.error = false;
                    that.status = 'unknow';
                    that.message = '';
                    that._callback();
            }
        } else {
            that.error = false;
            that.status = 'multiRecorder';
            that.message = '';
            that._callback();
            //var text = genTextXml(playerWeiId, businessWeiId, "奇怪，难道我们之前认识。。。找xx反应下吧", 1);
            //callback({error: false,  msg: text});
        }
        
    
    });
};

exports._Register = _Register;
