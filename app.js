'use strict';

const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const app = express();
const port = process.env.PORT || 8080;

var BoxClient = require('./src/resources/box');
let client = new BoxClient();

const indexRouter = require('./src/routes/indexRoutes')();
const apiRouter = require('./src/routes/apiRoutes')(client);
const yearDateFormat = 'YYYY';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', indexRouter);
app.use('/api', apiRouter);

app.locals.moment = moment;
app.locals.yearDateFormat = yearDateFormat;

app.listen(port, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Server is running on port ' + port);
    }
  });
