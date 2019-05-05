// client id

// b

// Client Secret 7


// / console.log("loading spotify keys.js");
// // npm install dotenv
// // require("dotenv").config();

console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.OMDB = {
  key: process.env.OMDB_KEY
}

exports.BIT = {
  key: process.env.BIT_KEY
}

