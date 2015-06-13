var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var routes       = require('./routes/index');

var redis        = require("redis").createClient();
var io           = require("socket.io").listen(process.env.PORT || 3001);

var app          = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public/bower_components'));

app.use('/', routes);

redis.subscribe("song_added");
redis.subscribe("song_deleted");

io.on("connection", function(socket){
    console.log("connected socket");
    socket.on("disconnect", function(){
        console.log("client disconnected");
        socket.disconnect();
    });
});

redis.on("message", function(channel, message){
    //el mensaje es la songUrl
    console.log(message);
    if (channel === 'song_added') {
        io.sockets.emit(channel, message);
        console.log("channel "+ channel);
    };
    if (channel === 'song_deleted') {
        io.sockets.emit(channel, message);
        console.log("channel "+ channel);
    };
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
