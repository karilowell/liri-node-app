// client id

// b193cc00a3654dcd9345b05507041ef1

// Client Secret 71a7d48f101e43be963cce62a6c04317


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

