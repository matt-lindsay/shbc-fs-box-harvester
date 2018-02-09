'use strict';

const Box = require('box-node-sdk');
const fs = require('fs');

var boxClient = function() {
    var boxClientID = process.env.boxClientID;
    var boxClientSecret = process.env.boxClientSecret;
    var privateKey = fs.readFileSync(__dirname + '/private_key.pem', { encoding: 'utf8' });
    var publicKeyId = process.env.boxKeyID;
    var publicKeyPassphrase = process.env.boxKeyPassphrase;
    var boxEnterpriseId = process.env.boxEnterpriseId;
    var boxUser = process.env.boxFsUser;

    var sdk = new Box({
        clientID: boxClientID,
        clientSecret: boxClientSecret,
        appAuth: {
            keyID: publicKeyId,
            privateKey: privateKey,
            passphrase: publicKeyPassphrase
          }
      });

    var client = sdk.getAppAuthClient('enterprise', boxEnterpriseId);
    client.asUser(boxUser);

    return client;
  };
module.exports = boxClient;
