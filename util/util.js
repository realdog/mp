var genTextXml = function(targetUser, fromUser, msg, funcFlag) {
    var xml = '<xml>'
    + '<ToUserName><![CDATA[' + targetUser + ']]></ToUserName>'
    + '<FromUserName><![CDATA[' + fromUser + ']]></FromUserName>'
    + '<CreateTime>' + new Date().getTime() + '</CreateTime>'
    + '<MsgType><![CDATA[text]]></MsgType>'
    + '<Content><![CDATA['+ msg.toString() +']]></Content>'
    + '<FuncFlag>' + funcFlag + '</FuncFlag>'
    + '</xml>';
    return xml;
};

exports.genTextXml = genTextXml;

var genPicXml = function(targetUser, fromUser, msg, funcFlag) {
    var xml = '<xml>'
    + '<ToUserName><![CDATA[' + targetUser + ']]></ToUserName>'
    + '<FromUserName><![CDATA[' + fromUser + ']]></FromUserName>'
    + '<CreateTime>' + new Date().getTime() + '</CreateTime>'
    + '<MsgType><![CDATA[text]]></MsgType>'
    + '<Content><![CDATA['+ msg.toString() +']]></Content>'
    + '<FuncFlag>' + funcFlag + '</FuncFlag>'
    + '</xml>';
    return xml;
};

exports.genPicXml = genPicXml;