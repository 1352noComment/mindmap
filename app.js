var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var socket = require('socket.io');


mongoose.connect('mongodb://localhost/mindconnect');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var accounts = require('./routes/accounts');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.use('/', routes);
app.use('/users', users);
app.use('/accounts', accounts);

//mongoose.connect('mongodb://localhost/testdb');

/*db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function() {

/*app.get('/data', function(req, res){
    db.find().toArray(function(err, data){
        //set id property for all records
        for (var i = 0; i < data.length; i++)
            data[i].id = data[i]._id;

        //output response
        res.send(data);
    });
});

app.post('/data', function(req, res){
    var data = req.body;

    //get operation type
    var mode = data["!nativeeditor_status"];
    //get id of record
    var sid = data.id;
    var tid = sid;

    //remove properties which we do not want to save in DB
    delete data.id;
    delete data.gr_id;
    delete data["!nativeeditor_status"];


    //output confirmation response
    function update_response(err, result){
        if (err)
            mode = "error";
        else if (mode == "inserted")
            tid = data._id;

        res.setHeader("Content-Type","text/xml");
        res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
    }

     if (mode == "updated")
        db.events.updateById( sid, data, update_response);
    else if (mode == "inserted")
        db.events.save(data, update_response);
    else if (mode == "deleted")
        db.events.removeById( sid, update_response);
    else
        res.send("Not supported operation");
});*/


// Set Port
app.set('port', (process.env.PORT || 3000));

var server = app.listen(app.get('port'), function(){
  console.log('Server Started on Port '+ app.get('port'));
});


//Socket Setup

var io = socket(server);

io.sockets.on('connection', function(socket){
  
  console.log('socket connection made with id ' + socket.id);

  socket.on('edit', function(info){
    io.sockets.emit('edit', info);
  });

  socket.on('addQuestion', function(info){
    io.sockets.emit('addQuestion', info);
  });

  socket.on('addQuestionCore', function(info) {
    io.sockets.emit('addQuestionCore', info);
  });

  socket.on('addAnswer', function(info) {
    io.sockets.emit('addAnswer', info);
  });

  socket.on('addAnswerOnCore', function(info) {
    io.sockets.emit('addAnswerOnCore', info);
  });

});