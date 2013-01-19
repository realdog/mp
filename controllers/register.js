var fs = require('fs');
var redis = require("redis");
var client = redis.createClient();
var mongoose = require('mongoose');
var Business = mongoose.model('Business');
var Player = mongoose.model('Player');
var Status = mongoose.model('Status');
var _ = require('underscore');
var crypto = require('crypto');
var userUtil = require('../util/util');
var util = require('util');
var genTextXml = userUtil.genTextXml;
var _Register = require('./_register')._Register;


var Register = function(playerWeiId, businessWeiId, callback, data) {
    this.playerWeiId = playerWeiId;
    this.businessWeiId = businessWeiId;
    this.status = '';
    this.content = data['xml']['Content'].toString().replace(/ /g, '');
    this.callback = callback;
    this.error = false;
    this.message = '';
    this.runningFunction = undefined;

    var hash = crypto.createHash('md5');
    hash.update(this.playerWeiId);
    this.playerWeiIdHashKey = hash.digest('hex');

    hash = crypto.createHash('md5');
    hash.update(this.businessWeiId);
    this.businessWeiIdHashKey = hash.digest('hex');
    
    hash = crypto.createHash('md5');
    hash.update(this.businessWeiId + this.playerWeiId);
    this.uniqueHashKey = hash.digest('hex');
    
    if ((this.content.length >>> 0) <= 0 ) {
        this.error = true;
        this.status = 'nullContent';
    }
};

util.inherits(Register, _Register);

Register.prototype._callback = function() {
    var that = this
    if (this.error == false) {
        if (this.message != '') {
            console.log(this.message)
            client.set(this.uniqueHashKey, this.message, function(err){
                if (!!err) {
                    that.error = true;
                    that.status = "getRedisRecorderMissing";
                    // save to file
                }
                if (this.status == 'justRegBaseInfo') {
                    that.callback();
                    return
                    //this.message = genTextXml(this.playerWeiId, this.businessWeiId, "亲爱的，欢迎你来注册哦! 嘿嘿，那我要怎么称呼您呢？告诉我才好开始哦!", 0);
                } else if (this.status == 'timeout') {
                    this.message = genTextXml(this.playerWeiId, this.businessWeiId, '<a href="http://www.lessky.com">亲，刚才小编我睡着了，能否重新告诉我你的大名呀!</a>', 0);
                } else if (this.status == 'updateVisitTime') {
                     this.message = genTextXml(this.playerWeiId, this.businessWeiId, 'O(∩_∩)O', 0);
                } else if (this.status == 'hadRegBaseInfo') {
                    this.register();
                    return;
                } else if (this.status == "fullRegister" && this.runningFunction == this.register) {
                    this.message = genTextXml(this.playerWeiId, this.businessWeiId, "注册成功啦哈哈", 0);
                } else if (this.status == "fullRegister" && this.runningFunction == this.check) {
                    this.message = genTextXml(this.playerWeiId, this.businessWeiId, "您早就注册过啦", 0);
                } else if (this.status == "lastStepRegError") {
                    this.message = genTextXml(this.playerWeiId, this.businessWeiId, "亲，你的名字好帅呀。不过，似乎现在系统正在维护哦!", 1);
                } else if (this.status == "multiRecorder") {
                    this.message = genTextXml(this.playerWeiId, this.businessWeiId, "奇怪，难道我们之前认识。。。找xx反应下吧", 1);
                } else if (this.status == "unknow") {
                    this.message = genTextXml(this.playerWeiId, this.businessWeiId, "小编把机器给弄坏了。。。", 1);
                }                
            });            
        } else {
            this.message = genTextXml(this.playerWeiId, this.businessWeiId, "小编把服务器给弄坏了。。。", 1);
        }
    } else if(this.error == true) {
        this.message = genTextXml(this.playerWeiId, this.businessWeiId, "亲，似乎现在系统正在维护！稍后试验下吧", 1);
    }
    this.callback();
}

Register.prototype.check = function() {
    this.runningFunction = this.check;
    var that = this;
    client.get(this.uniqueHashKey, function(err, reply){
        if (!!err) {
            that.error = true;
            that.status = 'visitRedisFail';
            that.errorMessage = genTextXml(that.playerWeiId, that.businessWei, "服务器解析错误:" + err.toString(), 1);
            that._callback();
        } else {
            if (!!reply) {
                that.error = false;
                that.status = JSON.parse(reply)["status"];
                that.message = JSON.parse(reply);
                that._callback();
            } else { 
                that._check();
                //dispatch(req, res, data);
            }
        }
    });

    
};

Register.prototype.register = function() {
    this.runningFunction = this.register;
    this._register();
};

exports.Register = Register;
