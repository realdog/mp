var express = require('express');
var path = require('path');
var log4js = require('log4js');
log4js.addAppender(log4js.appenders.file('logs/cheese.log'), 'cheese');
var logger = log4js.getLogger('cheese');
logger.setLevel('INFO');
module.exports = function (app) {
    app.use(express.compress({
      filter: function (req, res) {
        console.log(res.getHeader('Content-Type'));
        return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
      },
      level: 9
    }))

    app.configure(function () {
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
      app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }));      
      app.use(app.router);
      
      app.use(require('stylus').middleware(__dirname + '/public'));
      app.use(express.static(path.join(__dirname, 'public')));
      app.use(function(err, req, res, next){
        console.error(err.stack);
        res.send(500, '出错了');
      });
    });
};