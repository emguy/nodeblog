import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './routes/index';
import users from './routes/users';
import session from 'express-session';
import moment from 'moment';
import flash from 'connect-flash';
import multer from 'multer';
import expressValidator from 'express-validator';
import expressMessages from 'express-messages';
import monk from 'monk';

let app = express();
let db = monk('localhost/nodeblog');
let upload = multer({ dest: 'uploads/' });

/* view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* session */
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

/* express validator */
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    let namespace = param.split('.');
    let root = namespace.shift();
    let formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

/* connect-flash */
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  next();
});

/* make our db accesible to our router */
app.use((req, res, next) => {
  req.db =db;
  next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

export { app as default };
