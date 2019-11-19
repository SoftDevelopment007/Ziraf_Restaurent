var express = require('express');
var http = require('http');
var logger = require('morgan');
var bodyParser  = require('body-parser');
var mongoose = require('mongoose');
var connection = require('./config/database')(mongoose);
var models = require('./models/models')(connection);
var app = express();
app.set('port', 8080);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true, limit: '20mb'}));
app.use(bodyParser.json({limit: '20mb'}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});
require('./app/routes.js')(app, models);

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + JSON.stringify(server.address()));
});