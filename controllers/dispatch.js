var fs = require('fs');
var mongoose = require('mongoose');
var _ = require('underscore');
var Player = mongoose.model('Player');
var Business = mongoose.model('Business');
var Player = mongoose.model('Player');
var Status = mongoose.model('Status');
var userUtil = require('../util/util');
var games_path = __dirname + '/games';
var Register = require('./register').Register;
var games_list = {};
var genTextXml = userUtil.genTextXml;

fs.readdirSync(games_path).forEach(function (file) {
   var tmpObj = require(games_path+'/'+file);
   games_list[tmpObj.alias] = tmpObj;
});


exports.dispatch = function(req, res, data) {
    var msgType = data['xml']['MsgType'];
    var targetUser = data['xml']['FromUserName'];
    var fromUser = data['xml']['ToUserName'];
    var person = undefined;
    console.log(JSON.stringify(data));
    var begin = function() {
        console.log(person);
        if (person.error == false) {
            if (person.status == 'justRegBaseInfo') {
                var text = genTextXml(person.userWeiId, person.businessWeiId, "亲爱的，您是第一次来吧! 嘿嘿，那我要怎么称呼您呢？告诉我才好开始哦!", 0);
            } else if (person.status == 'timeout') {
                var text = genTextXml(person.userWeiId, person.businessWeiId, '<a href="http://www.lessky.com">亲，刚才小编我睡着了，能否重新告诉我你的大名呀!</a>', 0);
            } else if (person.status == 'hadRegBaseInfo') {
                var text = genTextXml(person.userWeiId, person.businessWeiId, '<a href="http://www.lessky.com">亲，马上就给你注册啦!</a>', 0);                
            }      
        } else if(person.error == true) {
            var text = genTextXml(person.userWeiId, person.businessWeiId, "亲，似乎现在系统正在维护！稍后试验下吧", 1);
        }
        res.end(text);
    };    
    person = new Register(targetUser, fromUser, begin, data);
    person.check();
}