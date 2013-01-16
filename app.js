var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , parser = require('xml2json')
  , fs = require('fs')
  , crypto = require('crypto');

var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(config.db);
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  console.log(file);
  require(models_path+'/'+file)
});

var util = require('util');
var app = express();
require('./config/express')(app);
require('./config/routes')(app);
var port = process.env.PORT || 80;
app.listen(port);
console.log('Express app started on port '+port);
/*
app.configure(function(){
  app.set('port', process.env.PORT || 80);  
  app.set('address', '199.193.249.116');  
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(function(req, res, next) {
    req.rawBody = '';
    var data = ''
    req.setEncoding('utf8');
    req.on('data', function(chunk) { data += chunk });
    req.on('end', function(chunk) { req.rawBody = data; next();})
  });    
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, '出错了');
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
});


app.get('/checkUrl', function(req, res, next){
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var tmpArray = [];
    tmpArray.push(TOKEN);
    tmpArray.push(timestamp);
    tmpArray.push(nonce);
    tmpArray = sort(tmpArray);
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

});


app.post('/checkUrl', function(req, res, next){
    
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
    tmpArray = sort(tmpArray);
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
        res.send('false');
    } else {
        if ((!!data['xml']['ToUserName']) && (!!data['xml']['FromUserName']) && (!!data['xml']['MsgType'])) {
            var msgType = data['xml']['MsgType'];
            var targetUser = data['xml']['FromUserName'];
            var fromUser = 'chinaolddog';
            switch(msgType) {
                case 'text':
                    var xml = '<xml>'
                    + '<ToUserName><![CDATA[' + targetUser + ']]></ToUserName>'
                    + '<FromUserName><![CDATA[' + fromUser + ']]></FromUserName>'
                    + '<CreateTime>' + new Date().getTime() + '</CreateTime>'
                    + '<MsgType><![CDATA[text]]></MsgType>'
                    + '<Content><![CDATA[测试]]></Content>'
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
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
*/