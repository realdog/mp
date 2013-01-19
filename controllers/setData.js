var fs = require('fs');
var redis = require("redis");
var client = redis.createClient();
var env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , mongoose = require('mongoose');
mongoose.connect(config.db);
var models_path = __dirname + '/../models'
fs.readdirSync(models_path).forEach(function (file) {
  console.log(file);
  require(models_path+'/'+file)
});

var Business = mongoose.model('Business');
var Player = mongoose.model('Player');
var Status = mongoose.model('Status');
var _ = require('underscore');
var crypto = require('crypto');
var newPlayer = new Player({});
var message = {};
newPlayer.playerWeiId = 'orNerjiR0K02BAtWpu9eOxVVqAeE';
message.playerWeiId = 'orNerjiR0K02BAtWpu9eOxVVqAeE';
newPlayer.busiunesWeiId = 'gh_b604880bf027';
message.busiunesWeiId = 'gh_b604880bf027';
newPlayer.status = 'fullRegister';
message.status = 'fullRegister';
newPlayer.playName = '老狗'
message.playName = '老狗'
newPlayer.uniqueHashKey = '4e98db17f2e0ba73989dfb39bff2d1f4';
message.uniqueHashKey = '4e98db17f2e0ba73989dfb39bff2d1f4';
newPlayer.createDate = new Date();
message.createDate = new Date();
newPlayer.save(function(err){
    client.set(message.uniqueHashKey, JSON.stringify(message), function(err){
        console.log(err);
    });
});

