var request = require('request');
var token = require('./secret');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
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
    const bodyObj = JSON.parse(body);
    let avatarArr = [];
    let i = 0;
    bodyObj.forEach(function(user) {
      avatarArr.push(user.avatar_url);
      downloadImageByURL(user.avatar_url, './avatars/avatar' + i + '.jpg');
      i++;
    });
    cb(err, avatarArr);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
        .on('error', function (err) {                                   // Note 2
         throw err;
         })
        .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(process.argv[2], process.argv[3], function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});