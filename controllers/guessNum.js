var fs = require('fs');
var redis = require("redis");
var client = redis.createClient();
var _ = require('underscore');
var crypto = require('crypto');
var userUtil = require('../util/util');
var util = require('util');
var genTextXml = userUtil.genTextXml;
var _Guess = require('./_guess')._Guess;
var US = require('./userStatus').UserStatus;



var GuessNum = function(playerWeiId, businessWeiId, callback, data) {
    this.playerWeiId = playerWeiId;
    this.businessWeiId = businessWeiId;
    this.content = data['xml']['Content'].replace(/ /g, '');
    this.callback = callback;
    this.error = false;
    
    this.remainTimes = 0;
    
    
    var hash = crypto.createHash('md5');
    hash.update(this.playerWeiId);
    this.playerWeiIdHashKey = hash.digest('hex');

    hash = crypto.createHash('md5');
    hash.update(this.businessWeiId);
    this.businessWeiIdHashKey = hash.digest('hex');
    
    hash = crypto.createHash('md5');
    hash.update(this.businessWeiId + this.playerWeiId);
    this.uniqueHashKey = hash.digest('hex');    
    
    this.us = new US(this.uniqueHashKey);
    
    if ((this.content.length >>> 0) <= 0 ) {
        this.error = true;
        this.status = undefined;
    }
};

util.inherits(GuessNum, _Guess);

GuessNum.prototype._callback = function(error, testOk) {
    var that = this;
    if (!!error) {
        this.message = genTextXml(this.playerWeiId, this.businessWeiId, "小编把服务器给搞瘫痪了", 1);
    } else {
        if (that.userStatus.remainTimes <= that.userStatus.tryTimes) {
            this.message = genTextXml(this.playerWeiId, this.businessWeiId, "亲，下面就可以开始猜数了哦，我已经帮您选择好了数字，请开始猜这个数到底是多少吧", 0);
        } else {
            if (!!testOk) {
                this.message = genTextXml(this.playerWeiId, this.businessWeiId, "恭喜您猜对啦", 0);
            } else {
                if (that.userStatus.remainTimes > 0 ) {
                    this.message = genTextXml(this.playerWeiId, this.businessWeiId, "太可惜啦，继续猜~~~您还有" + (that.userStatus.remainTimes) +"次机会哦", 0);
                } else {
                    this.message = genTextXml(this.playerWeiId, this.businessWeiId, "太可惜啦，等下次机会再继续吧", 0);
                }
            }        
        }
    }
    this.callback();
};

GuessNum.prototype.check = function() {
    this.runningFunction = this.check;
    var that = this;
    that.us.get(function(err, reply) {
        if (!!err) {
            that.error = true;
            that.errorMessage = genTextXml(that.playerWeiId, that.businessWeiID, "服务器解析错误:" + err.toString(), 1);
            that._callback();
        } else {
            try {
                that.userStatus = undefined;
                that.userStatus = JSON.parse(reply);
            } catch(e) {

            } finally {
                if (that.userStatus == undefined) {
                    that.userStatus = {};
                    that.userStatus.randNum = Math.random() * 100 + 1;
                    that.userStatus.tryTimes = 3;
                    that.userStatus.step = 0;
                    that.userStatus.runningType = "Game";
                    that.userStatus.remainTimes = 4;
                    that.userStatus.updateTime = Date.now();
                    that.userStatus.lastStatus = undefined;
                    that.userStatus.testOk = false;
                }
                
                if (that.userStatus.remainTimes <= that.userStatus.tryTimes) {
                    if (that.content.toString() == that.userStatus.randNum.toString()) {
                        that.userStatus.testOk = true;
                    } else {
                        that.userStatus.testOk = false;
                    }
                    that.userStatus.remainTimes--;
                    if (that.userStatus.remainTimes == 0) {
                        that.us.del(that.uniqueHashKey, function(err){
                            if (!!err) {
                                that.error = true;
                                that._callback(false, false);
                            } else {
                                that.error = false;
                                if (!!that.userStatus.testOk) {
                                    that._callback(false, true);
                                } else {
                                    that._callback(false, false);
                                }
                            }
                        });                        
                    } else {
                        that.us.set(that.uniqueHashKey, json.stringify(that.userStatus), function(err){
                            if (!!err) {
                                that.error = true;
                                that._callback(false, false);
                            } else {
                                that.error = false;
                                if (!!that.userStatus.testOk) {
                                    that._callback(false, true);
                                } else {
                                    that._callback(false, false);
                                }
                            }
                        });                        
                    }

                } else {
                    that._callback(false, true);
                }
            }
        }    
    });
}

