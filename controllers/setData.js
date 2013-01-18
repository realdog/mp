var fs = require('fs');
var redis = require("redis");
var client = redis.createClient();
var mongoose = require('mongoose');
var Business = mongoose.model('Business');
var Player = mongoose.model('Player');
var Status = mongoose.model('Status');
var _ = require('underscore');
var crypto = require('crypto');
var newPlayer = new Player({});

newPlayer.playerWeiId = 'orNerjiR0K02BAtWpu9eOxVVqAeE';
message.playerWeiId = 'orNerjiR0K02BAtWpu9eOxVVqAeE';
newPlayer.busiunesWeiId = 'gh_b604880bf027';
message.busiunesWeiId = 'gh_b604880bf027';
newPlayer.status = 'fullRegister';
message.status = 'fullRegister';
newPlayer.playName = '老狗'
message.playName = '老狗'
newPlayer.uniqueHashKey = '90252a856f02f73dd257bd107fc92c32';
message.uniqueHashKey = '90252a856f02f73dd257bd107fc92c32';
newPlayer.createDate = new Date();
message.createDate = new Date();
newPlayer.save(function(err){
    client.set(message.uniqueHashKey, JSON.stringify(message), function(err){
        console.log(err);
    });
});

