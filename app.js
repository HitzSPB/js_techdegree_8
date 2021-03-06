// Requires
const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const bookRoutes = require('./routes/books');
const seq = require('./models').sequelize;
let app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Usings
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/books', bookRoutes);

// Sync database model
// seq.authenticate() ;
seq.sync();

// Checking for 404
app.use(function(req, res, next) {
  console.log('Page Not found have been entered');
  const err = new Error()
  err.status = 404;
  err.error = "Page Not Found";
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(`error status :: ${err.status} with message ${err.message}`);
  if(err.status === 404)
  {
    res.render('page-not-found', {title: "Page Not Found"});
  }
  else
  {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
}
});

module.exports = app;
