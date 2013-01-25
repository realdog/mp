var fs = require('fs');
var redis = require("redis");
var client = redis.createClient();
var _ = require('underscore');
var crypto = require('crypto');
var userUtil = require('../util/util');
var util = require('util');
var genTextXml = userUtil.genTextXml;

var userStatus = function(uniqueHashKey) {
    this.status = undefined;
    this.uniqueHashKey = uniqueHashKey;
    this.error = false;
};

userStatus.prototype.get = function(callback) {
    var that = this;
    client.HGET("status", that.uniqueHashKey, function(err, reply){
        if (!!err) {
            that.error = true;
            callback(err, false);
        } else {
            console.log(reply);
            that.status = JSON.parse(reply);
            callback(err, that.status);
        }
    });

};

userStatus.prototype.set = function(uniqueHashKey, value, callback) {
    var that = this;
    client.HSET("status", uniqueHashKey, value, function(err){
        if (!!err) {
            console.log("set error");
            that.error = true;
            callback(false);
        } else {
            console.log("set ok");
            that.error = false;
            callback(true);
        }
    });
}

userStatus.prototype.del = function(uniqueHashKey,  callback) {
    var that = this;
    client.HDEL("status", uniqueHashKey, function(err){
        if (!!err) {
            that.error = true;
            callback(false);
        } else {
            that.error = false;
            callback(true);
        }
    });
}

exports.UserStatus = userStatus;