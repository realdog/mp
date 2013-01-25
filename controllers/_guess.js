var fs = require('fs');
var redis = require("redis");
var client = redis.createClient();
var _ = require('underscore');
var genTextXml = userUtil.genTextXml;

var _Guess = function(playerWeiId, businessWeiId, callback, data) {
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

_Guess.prototype._callback = function() {
    console.log("_Guess");
    this.callback();
};

_Guess.prototype._check = function(){
    var that = this;
    that._callback();
};

_Guess.prototype._gen = function(){
    var that = this;
    that._callback();
};


exports._Guess = _Guess;