module.exports = function (app) {
    var index = require('../controllers/index');
    app.get('/index', index.getIndex);
    app.post('/index', index.postIndex);
};