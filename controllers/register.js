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
    this.content = data['xml']['Content'].replace(/ /g, '');
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
    client.get(this.businessHashKey, function(err, reply){
        if (!!err) {
            this.error = true;
            this.status = 'missReisRecorder';
            this.errorMessage = genTextXml(this.userWeiId, this.businessWei, "服务器解析错误:" + err.toString(), 1);
            this._callback();
        } else {
            this._check();
        }
        if (!!reply) {
            this.error = false;
            this.status = 'missRedisRecorder';
            this.message = JSON.parse(reply);
            this._callback();
        } else { 
            this._check();
            console.log("no reg")
            //dispatch(req, res, data);
        }
    });

    
};


exports.Register = Register;
