//doing my package requires
var request = require('request');
var token = require('./secret');
var fs = require('fs');
var path = require('path');

//breif welcome so user knows things started well
console.log('Welcome to the GitHub Avatar Downloader!');

/**. checks if the dir exists and if not creates it - if it exists nothing happens
 * @param  {string} filePath
 * @return {[boolean]}
 */
function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

/**. This function will first check if the user has entered two strings repoOwner & repoName.
    then it parses the specified repository contributers and parses that into an array.
    then it takes the url of the contributers avatar and writes then to a file located in ./avatar

 * @param  {string} repoOwner - the repository owner's github user name
 * @param  {string} repoName - the name of the repository
 * @param  {callback function} cb - the callback function, defined in the getRepoContributers() call
 * @return {undefined} - returns undefined
 */
function getRepoContributors(repoOwner, repoName, cb) {
  //if statements checks for two inputs from user
  if (!process.argv[2] || !process.argv[3]){
    console.error('You did not pass me repoOwner and repoName');
    return;
  }

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token.GITHUB_TOKEN,
    }
  };

  request(options, function(err, res, body) {
    //parses the string into an array
    const bodyObj = JSON.parse(body);
    let avatarArr = [];
    //goes through the array and pushes the avatar url to avatarArr
    bodyObj.forEach(function(user) {
      avatarArr.push(user.avatar_url);
    //calls downloadImageByUrl giving it the ulr and filepath
      downloadImageByURL(user.avatar_url, './avatars/' + user.login + '.png');
    });
    //the callback - used during writing this program to see what was going on
    cb(err, avatarArr);
  });
}

/** takes in url and filepath, uses the url of the avatar and rites a .jpg file to filepath
 * @param  {string} url - url of the avatar
 * @param  {string} filePath - the file path to write the new file to
 * @return {undefined}
 */
function downloadImageByURL(url, filePath) {
  //check is the directory /avatars exists in current dir
 ensureDirectoryExistence(filePath);
  request.get(url)
        .on('error', function (err) {
         throw err;
         })
        .pipe(fs.createWriteStream(filePath));
}

//calling the getRepoContributors function
getRepoContributors(process.argv[2], process.argv[3], function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});