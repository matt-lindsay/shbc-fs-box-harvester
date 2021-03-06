'use strict';

const BoxFsService = require('../services/BoxFsService');

var apiController = function(client) {

    var hello = function(req, res) {
      client.users.get(client.CURRENT_USER_ID, { fields: 'name, login' }, function(err, response) {
        if (err) {
          res.status(200).send('Get current client error ' + err);
        } else {
          res.status(200).send('Hello ' + response.name);
        }
      });
    };

    var postReferral = function(req, res) {
        let data = req.body;

        // Box.
        var fsBox = new BoxFsService(client);
        fsBox.createReferralFolders(data, function(err, result) {
            if (err) {
              res.status(500).send(err);
            } else {
              if (result === 'Name already in use.') {
                res.status(200).send(result);
              } else {
                res.status(201).send(result);
              }
            }
          });
      };

    return {
        hello: hello,
        postReferral: postReferral
      };
  };
module.exports = apiController;
