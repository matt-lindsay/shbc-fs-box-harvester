'use strict';

var indexController = function() {

    var welcome = function(req, res) {
        res.status(200).send('SHBC Family Support Blue Creature.');
      };

    return {
        welcome: welcome
      };
  };
module.exports = indexController;
