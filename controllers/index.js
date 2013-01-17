var crypto = require('crypto');
var parser = require('xml2json');
var dispatch = require('./dispatch').dispatch;
var userUtil = require('../util/util');
var genTextXml = util.genTextXml;
var redis = require("redis");
var client = redis.createClient();
var TOKEN = "e7ax1976zerotest";
var games_list = [];

exports.getIndex = function(req, res) {
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var tmpArray = [];
    tmpArray.push(TOKEN);
    tmpArray.push(timestamp);
    tmpArray.push(nonce);

    tmpArray = tmpArray.sort(function (a, b) {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    });
    var hash = crypto.createHash('sha1');
    hash.update(tmpArray.join(''));
    var tmpStr = hash.digest('hex');
    console.log(tmpStr.toString())
    if (signature != tmpStr.toString()) {
        res.send('false')
    } else {
        console.log(echostr);
        res.send(echostr);
    }

};

exports.postIndex = function(req, res) {
    var body = parser.toJson(req.rawBody);
    var data = JSON.parse(body);
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var tmpArray = [];
    tmpArray.push(TOKEN);
    tmpArray.push(timestamp);
    tmpArray.push(nonce);
    tmpArray = tmpArray.sort(function (a, b) {
        if (a > b) return 1;
        if (a < b) return -1;
        return 0;
    });
    var hash = crypto.createHash('sha1');
    hash.update(tmpArray.join(''));
    var tmpStr = hash.digest('hex');
    console.log(data)
    if (signature != tmpStr.toString()) {
        res.send('false');
    } else {
        if ((!!data['xml']['ToUserName']) && (!!data['xml']['FromUserName']) && (!!data['xml']['MsgType'])) {
            client.get(data['xml']['ToUserName'], function(err, reply){
                if (!!err) {
                    var xml = genTextXml(data['xml']['FromUserName'], data['xml']['ToUserName'], "服务器解析错误:" + err.toString(), 1);
                    console.log(xml);
                    res.send(xml);
                } else if (!!reply) {
                    data.userName = reply.userName;
                    dispatch(req, res, data);
                } else { 
                    dispatch(req, res, data);
                }
            });
        
            
            return;
            var msgType = data['xml']['MsgType'];
            var targetUser = data['xml']['FromUserName'];
            var fromUser = data['xml']['ToUserName'];
            switch(msgType) {
                case 'text':
                    var xml = '<xml>'
                    + '<ToUserName><![CDATA[' + targetUser + ']]></ToUserName>'
                    + '<FromUserName><![CDATA[' + fromUser + ']]></FromUserName>'
                    + '<CreateTime>' + new Date().getTime() + '</CreateTime>'
                    + '<MsgType><![CDATA[text]]></MsgType>'
                    + '<Content><![CDATA[' + targetUser + ']]></Content>'
                    + '<FuncFlag>0</FuncFlag>'
                    + '</xml>'
                    break;
                case 'voice':
                    var xml = '<xml>'
                    + '<ToUserName><![CDATA[' + targetUser + ']]></ToUserName>'
                    + '<FromUserName><![CDATA[' + fromUser + ']]></FromUserName>'
                    + '<CreateTime>' + new Date().getTime() + '</CreateTime>'
                    + '<MsgType><![CDATA[voice]]></MsgType>'
                    + '<Content><![CDATA[nJ4wNHNXFSl-IU8Qd7g0KCprcYJOJ3DZwBrqQMb4wVxNV5JD4KOQaWw988Se3j_H]]></Content>'
                    + '<FuncFlag>0</FuncFlag>'
                    + '</xml>'
                    break;
                default:
                    var xml = '<xml>'
                    + '<ToUserName><![CDATA[' + targetUser + ']]></ToUserName>'
                    + '<FromUserName><![CDATA[' + fromUser + ']]></FromUserName>'
                    + '<CreateTime>' + new Date().getTime() + '</CreateTime>'
                    + '<MsgType><![CDATA[text]]></MsgType>'
                    + '<Content><![CDATA[无法识别]]></Content>'
                    + '<FuncFlag>0</FuncFlag>'
                    + '</xml>'
                
                    break;
             }
        }
        res.send(xml);
    }    
};