var request = require('request');
var token = require('./secret');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
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
    bodyObj.forEach(function(user) {
      avatarArr.push(user.avatar_url);
    });
    cb(err, avatarArr);
  });
}

function downloadImageByURL(url, filePath) {
  // ...
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});

