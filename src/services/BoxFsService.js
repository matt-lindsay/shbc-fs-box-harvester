'use strict';

const fs = require('fs');

var BoxFsService = function(client) {
    let moment = require('moment');

    var createReferralFolders = function(data, cb) {

        let subFolders = JSON.parse(fs.readFileSync(__dirname + '/../data/subFolderArray.json'));
        var timestamp = moment().format('YYYY-MM-DD h:mm:ss a');
        //var results = false;

        // Create task folder name.
        let folderName = data.caseno + ' - ' + data.name;
        // Remove any forward slashes.
        folderName = folderName.replace("/", "");

        // Create a variable to test which borough a new referral relates to.
        let boxFolder;

        if (data.caseno.match('RUN')) {
          boxFolder = process.env.boxRunFolder;
          // Search for an existing folder.
          checkFolderExistence(data.caseno, boxFolder, function(err, checkFolderExistenceResponse) {
            if (err) {
              cb(err, null);
            } else {
              // If folder does not exist, create it
              if (checkFolderExistenceResponse === false) {
                createBoxFolder(client, boxFolder, folderName, timestamp, subFolders,
                  function(err, createBoxFolderResponse) {
                  if (err) {
                    cb(err, null);
                  } else {
                    cb(null, createBoxFolderResponse);
                  }
                });
              } else {
                // else, report back that the folder already exists.
                cb(null, 'Folder already exists.');
              }
            }
          });
        } else if (data.caseno.match('SH')) {
          boxFolder = process.env.boxShFolder;
          // Search for an existing folder.
          checkFolderExistence(data.caseno, boxFolder, function(err, checkFolderExistenceResponse) {
            if (err) {
              cb(err, null);
            } else {
              // If folder does not exist, create it
              if (checkFolderExistenceResponse === false) {
                createBoxFolder(client, boxFolder, folderName, timestamp, subFolders,
                  function(err, createBoxFolderResponse) {
                  if (err) {
                    cb(err, null);
                  } else {
                    cb(null, createBoxFolderResponse);
                  }
                });
              } else {
                // else, report back that the folder already exists.
                cb(null, 'Folder already exists.');
              }
            }
          });
        }
      };

    var checkFolderExistence = function(caseno, folderId, cb) {
      client.search.query(caseno, { type: 'folder', ancestor_folder_ids: folderId },
        function(err, checkFolderExistenceResponse) {
          if (err) {
            cb(err, null);
          } else {
            let totalCount = checkFolderExistenceResponse.total_count;
            if (totalCount === 0) {
              cb(null, false); // folder does not exist.
            } else {
              cb(null, true); // folder does exist.
            }
          }
        });
    };

    var createBoxFolder = function(client, parentId, folderName, timestamp, subFolders, cb) {
        client.folders.create(parentId, folderName, function(err, response) {
            if (err) {
              cb(err, null);
            } else {
              let createFolderName = response.name;
              let createdFolderId = response.id;

              console.log('>>> ' + timestamp + 'Task Folder created: ' + createFolderName);

              subFolders.forEach(function(subFolderName) {
                  client.folders.create(createdFolderId, subFolderName,
                    function(err, secondSubFolderCreateResponse) {
                      if (err) {
                        console.log(err);
                        //cb(err, null); // TODO error handling here.
                      } else {
                        console.log('>>> ' + timestamp + ' Sub Folder created: ' +
                          secondSubFolderCreateResponse.name);
                      }
                    });
                });
              cb(null, 'Task folders created: ' + createFolderName);
            }
          });
      };

    return {
        createReferralFolders: createReferralFolders
      };
  };
module.exports = BoxFsService;
