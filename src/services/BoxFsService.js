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
          checkFolderExistence(data.caseno, boxFolder, function(err, checkFolderExistenceResult) {
            if (err) {
              cb(err, null);
            } else {
              // If folder does not exist, create it
              if (checkFolderExistenceResult = false) {
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
          checkFolderExistence(data.caseno, boxFolder, function(err, checkFolderExistenceResult) {
            if (err) {
              cb(err, null);
            } else {
              // If folder does not exist, create it
              if (checkFolderExistenceResult = false) {
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


        // // Check for an Fs Referral #.
        // if (data.caseno) {
        //   client.search.query(data.caseno, { type: 'folder', ancestor_folder_ids: boxFolder },
        //     function(err, primarySearchResults) {
        //         if (err) {
        //           cb(err, null);
        //         } else {
        //           if (primarySearchResults.total_count === 0) {
        //             // Can't find h reg # in Task data, create the task separately.
        //             // !!! TIDY UP
        //             client.folders.create(boxFolder, folderName,
        //                 function(err, createTaskFolderResponse) {
        //                   if (err) {
        //                     cb(err, null);
        //                   } else {
        //                     subFolders.forEach(function(folderItem) {
        //                         client.folders.create(createTaskFolderResponse.id, folderItem,
        //                             function(err, subfolderCreateResponse) {
        //                           if (err) {
        //                             console.log(err);
        //                           } else {
        //                             console.log('>>> ' + timestamp + ' Sub Folder created: ' +
        //                               subfolderCreateResponse.name);
        //                           }
        //                         });
        //                       });
        //                     cb(null, 'Task folders created: ' + createTaskFolderResponse.name);
        //                   }
        //                 }); // !!!
        //           } else { // Else create the task in the correct sub folder.
        //             // Identify the correct sub folder.
        //             client.folders.getItems(primarySearchResults.entries[0].id, null,
        //                 function(err, secondarySearchResults) {
        //                   if (err) {
        //                     cb(err, null);
        //                   } else { // Else iterate through the returned results and test for a match.
        //                     let typeFolders = secondarySearchResults.entries;

        //                     matchedResults(typeFolders, data.type).then(
        //                         function(matchedResultsResponse) {
        //                           // Create sub folder.
        //                           createBoxFolder(client, matchedResultsResponse, folderName,
        //                             timestamp, subFolders, function(err, createFolderResponse) {
        //                               if (err) {
        //                                 cb(err, 'Create Box Folder');
        //                               } else {
        //                                 cb(null, createFolderResponse);
        //                               }
        //                             });
        //                         }, function(error) {
        //                           cb(error);
        //                         });
        //                   }
        //                 });
        //           }
        //         }
        //       });
        // } else {
        //   // Create a separate task folder.
        //   // !!! TIDY UP
        //   client.folders.create(boxFolder, folderName,
        //     function(err, createTaskFolderResponse) {
        //       if (err) {
        //         cb(err, null);
        //       } else {
        //         subFolders.forEach(function(folderItem) {
        //               client.folders.create(createTaskFolderResponse.id, folderItem,
        //                 function(err, subfolderCreateResponse) {
        //                   if (err) {
        //                     console.log(err);
        //                   } else {
        //                     console.log('>>> ' + timestamp + ' Sub Folder created: ' +
        //                       subfolderCreateResponse.name);
        //                   }
        //                 });
        //             });
        //         cb(null, 'Task folders created: ' + createTaskFolderResponse.name);
        //       }
        //     }); // !!!
        //   //cb(null, 'no H REG case');
        // }
      };

    // var matchedResults = function(subfolderResults, taskType) {
    //     return new Promise(function(resolve, reject) {

    //         // Test each result returned in searchResults for a match with folderName.
    //         // If a match is not returned create the folder.
    //         let matched = false;
    //         let matchedId;

    //         subfolderResults.forEach(function(item) {
    //             if (item.name.match(taskType)) {
    //               matched = true;
    //               matchedId = item.id;
    //             }
    //           });
    //         if (matched === true) {
    //           resolve(matchedId); // Sub folder Id to create the task in.
    //         } else if (matched === false) {
    //           reject('nomatch'); // TODO Something is wrong: where is the correct sub folder?
    //         }
    //       });
    //   };

    var checkFolderExistence = function(caseno, boxFolder, cb) {
      client.search.query(caseno, { type: 'folder', ancestor_folder_ids: boxFolder },
        function(err, checkFolderExistenceResponse) {
          if (err) {
            cb(err, null);
          } else {
            if (checkFolderExistenceResponse.total_count === 0) {
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
