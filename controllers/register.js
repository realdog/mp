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
    this.businessWei = businessWeiId;
    this.status = '';
    this.content = data['xml']['Content'].toString().replace(/ /g, '');
    this.callback = callback;
    this.error = false;
    var hash = crypto.createHash('md5');
    hash.update(this.businessWei + this.userWeiId);
    this.userHashKey = hash.digest('hex');
    hash = crypto.createHash('md5');
    hash.update(this.businessWei + this.userWeiId);
    this.businessHashKey = hash.digest('hex');
    if ((this.content.length >>> 0) <= 0 ) {
        this.error = true;
        this.status = 'nullContent';
    }
};

util.inherits(Register, _Register);

Register.prototype._callback = function() {
    console.log("register");
    this.callback();
}

Register.prototype.check = function() {
    console.log("Register.prototype.check:" + this.businessHashKey);
    var that = this;
    client.get(this.businessHashKey, function(err, reply){
        if (!!err) {
            that.error = true;
            that.status = 'missReisRecorder';
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


exports.Register = Register;
