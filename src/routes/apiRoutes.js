'use strict';

const express = require('express');
const apiRouter = express.Router();

var router = function(client) {
    var apiController = require('../controllers/apiController')(client);

    apiRouter.route('/')
      .get(apiController.hello);

    apiRouter.route('/postReferral')
        .post(apiController.postReferral);

    return apiRouter;
  };
module.exports = router;
