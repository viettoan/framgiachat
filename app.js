var express = require('express');
var app = express();
var server = require("http").Server(app);
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({secret: 'secret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

webRouter = require('./routes/web.js');
webRouter(app, passport);

var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var chatSocketEvent = require('./chatSocketEvent.js');
chatSocketEvent(io);

server.listen(port);
