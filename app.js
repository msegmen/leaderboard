var createError = require('http-errors');
const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

const app = express();
const port = 5000;

var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, "MongoDB connection error: "));

var leaderboardRouter = require('./routes/leaderboard');
var scoreRouter = require('./routes/score');
var userRouter = require('./routes/user');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use('/leaderboard', leaderboardRouter);
app.use('/score', scoreRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
      });
 });

app.listen(port, () => console.log(`Hello world app listening on port ${port}`));

module.exports = app;