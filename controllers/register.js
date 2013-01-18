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


var Register = function(userWeiId, businessWeiId, callback, data) {
    this.userWeiId = userWeiId;
    this.businessWeiId = businessWeiId;
    this.status = '';
    this.content = data['xml']['Content'].toString().replace(/ /g, '');
    this.callback = callback;
    this.error = false;
    this.message = '';
    this.runningFunction = undefined;

    var hash = crypto.createHash('md5');
    hash.update(this.businessWei + this.userWeiId);
    this.uniqueHashKey = hash.digest('hex');
    
    if ((this.content.length >>> 0) <= 0 ) {
        this.error = true;
        this.status = 'nullContent';
    }
};

util.inherits(Register, _Register);

Register.prototype._callback = function() {
    if (this.error == false) {
        if (this.status == 'justRegBaseInfo') {
            this.message = genTextXml(this.userWeiId, this.businessWeiId, "亲爱的，欢迎你来注册哦! 嘿嘿，那我要怎么称呼您呢？告诉我才好开始哦!", 0);
            this.register();
            return;            
        } else if (this.status == 'timeout') {
            this.message = genTextXml(this.userWeiId, this.businessWeiId, '<a href="http://www.lessky.com">亲，刚才小编我睡着了，能否重新告诉我你的大名呀!</a>', 0);
        } else if (this.status == 'updateVisitTime') {
             this.message = genTextXml(this.userWeiId, this.businessWeiId, 'O(∩_∩)O', 0);
        } else if (this.status == 'hadRegBaseInfo') {
            this.register();
            return;
        } else if (this.status == "fullRegister" && this.runningFunction == this.register) {
            this.message = genTextXml(this.userWeiId, this.businessWeiId, "注册成功啦哈哈", 0);
        } else if (this.status == "fullRegister" && this.runningFunction == this.check) {
            this.message = genTextXml(this.userWeiId, this.businessWeiId, "您早就注册过啦", 0);
        } else if (this.status == "lastStepRegError") {
            this.message = genTextXml(this.userWeiId, this.businessWeiId, "亲，你的名字好帅呀。不过，似乎现在系统正在维护哦!", 1);
        } else if (this.status == "multiRecorder") {
            this.message = genTextXml(this.userWeiId, this.businessWeiId, "奇怪，难道我们之前认识。。。找xx反应下吧", 1);
        } else if (this.status == "unknow") {
            this.message = genTextXml(this.userWeiId, this.businessWeiId, "小编把机器给弄坏了。。。", 1);
        }
    } else if(this.error == true) {
        this.message = genTextXml(this.userWeiId, this.businessWeiId, "亲，似乎现在系统正在维护！稍后试验下吧", 1);
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
            that.errorMessage = genTextXml(that.userWeiId, that.businessWei, "服务器解析错误:" + err.toString(), 1);
            that._callback();
        } else {
            if (!!reply) {
                that.error = false;
                that.status = 'missRedisRecorder';
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
