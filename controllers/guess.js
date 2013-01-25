var fs = require('fs');
var redis = require("redis");
var client = redis.createClient();
var _ = require('underscore');
var crypto = require('crypto');
var userUtil = require('../util/util');
var util = require('util');
var genTextXml = userUtil.genTextXml;
var _Guess = require('./_guess')._Guess;


var Guess = function(playerWeiId, businessWeiId, callback, data) {
    this.playerWeiId = playerWeiId;
    this.businessWeiId = businessWeiId;
    this.content = data['xml']['Content'].replace(/ /g, '');
    this.callback = callback;
    this.error = false;
    
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

util.inherits(Guess, _Guess);

Guess.prototype._callback = function() {

};

Guess.prototype.check = function() {

}

