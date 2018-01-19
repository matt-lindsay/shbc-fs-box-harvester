'use strict';

//const BoxHTaskService = require('../services/BoxHTaskService');
//const boxClient = require('../resources/box');

var apiController = function() {

    var hello = function(req, res) {
      res.status(200).send('Hello, this is the API route!');
    };

    var postReferral = function(req, res) {
        // let client = new boxClient();

        // let data = req.body;

        // // Box.
        // var htaskBox = new BoxHTaskService(client);
        // htaskBox.createTaskFolders(data, function(err, result) {
        //     if (err) {
        //       res.status(500).send(err);
        //     } else {
        //       res.status(201).send(result);
        //     }
        //   });
        // console.log(data); // DEBUG TASK SYSTEM OUTPUT TO CONSOLE.
        // res.status(200).send(data);
        res.status(200).send('Hello!');
      };

    return {
        hello: hello,
        postReferral: postReferral
      };
  };
module.exports = apiController;
