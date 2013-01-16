var parser = require('xml2json');
var a = '<xml>' 
+ '<ToUserName><![CDATA[toUser]]></ToUserName>'
+ '<FromUserName><![CDATA[fromUser]]></FromUserName>'
+ '<CreateTime>1348831860</CreateTime>'
+ '<MsgType><![CDATA[text]]></MsgType>'
+ '<Content><![CDATA[this is a test]]></Content>'
+ '</xml>';
 var json = parser.toJson(xml);
 console.log(json);
