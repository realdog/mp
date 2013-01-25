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
        var message = '';
        if (person.status != 'fullRegister') {
            console.log(person);
            if (!!person.error) {
                switch (person.status) {
                    case 'getRedisRecorderMissing':
                        message = genTextXml(person.playerWeiId, person.businessWeiId, person.staus, 0);
                        break;
                    default:
                        break;
                }
            } else {
                message = genTextXml(person.playerWeiId, person.businessWeiId, "1.部落有啥\r\n2.部落有啥优惠\r\n3.最近活动\r\n4.有奖猜猜看", 0);
            }
        } else {
            message = genTextXml(person.playerWeiId, person.businessWeiId, "1.部落有啥\r\n2.部落有啥优惠\r\n3.最近活动\r\n4.私人管家", 0);
        }
        res.send(message);
    };    
    //person = new Register(targetUser, fromUser, begin, data);
    var guessNum = new GuessNum(targetUser, fromUser, begin, data);
    guessNum.check();
}