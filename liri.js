// client id

// b193cc00a3654dcd9345b05507041ef1

// Client Secret 71a7d48f101e43be963cce62a6c04317

// /npm install moment --save
// //npm install --save Node-Spotify-API
// //npm install axios
// //npm install dotenv

require("dotenv").config(); // Require dotenv for Spotify ID and Secret
var fs = require("fs");
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var colors = require('colors');


// API Keys
var keys = require("./keys");
var spotify = new Spotify(keys.spotify);
// var omdb_api_key = keys.OMDB.key;
// var bit_api_key = keys.BIT.key;

// Main Variables
var beautifiedDate = "";
var consoleOutput = "";
var logOutput = "";
var timeStamp = moment().format("LT, MMM Do, YYYY")


// Present user with options and get input
function askQuestions(){
    
    // Call Liri :)
    liriIn();

    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Get Band/Artist Info", "Spotify a Song", "Get Movie Info", "Let Liri decide!"],
            name: "currentCommand"
        },
        {
            // Message if "Get Band/Artist Info" is selected
            type: "input",
            message: 'Great! For which artist or band would you like info?',
            name: "currentParameter",
            when: function (answers) {
                return answers.currentCommand==="Get Band/Artist Info";
            }
        },
        {
            // Message if "Spotify a Song" is selected
            type: "input",
            message: 'Great! For which song would you like info?',
            name: "currentParameter",
            when: function (answers) {
                return answers.currentCommand==="Spotify a Song";
            }
        },
        {
            // Message if "Get Movie Info" is selected
            type: "input",
            message: 'Great! For which movie would you like info?',
            name: "currentParameter",
            when: function (answers) {
                return answers.currentCommand==="Get Movie Info";
            }
        }
    ]).then(function(answers) {
        command = answers.currentCommand;
        parameter = answers.currentParameter;
        userCommand (command, parameter);
    });
}

// Main Function to determine the option the user selected and then call the relative Function
function userCommand (command, parameter) {

    // Switch statement based on user's selection
    switch (command) {
        case "Get Band/Artist Info":
            getConcert(parameter);
            break;
        case "Spotify a Song":
            getSpotify(parameter);
            break;
        case "Get Movie Info":
            getMovie(parameter);
            break;
        case "Let Liri decide!":
            getBot();
            break;
    }
}

// Function for "Get Band/Artist Info" selection
function getConcert(parameter) {

    if (parameter=="") {
        parameter = "Metallica";
    }
    axios
    .get("https://rest.bandsintown.com/artists/" + parameter + "/events?app_id=" + keys.BIT.key)
    .then(function(response){
        

        // Set variable JsonData for short writing later
        var JsonData = response.data;

        // Clear the output
        consoleOutput = "";
        for (var i=0; i < JsonData.length; i++){
            
            // Create the output
            consoleOutput += colors.gray("________________________________________________________________________________________________________________________\n\n");
            consoleOutput += colors.yellow("Venue") + colors.green(" : ") + colors.cyan(JsonData[i].venue.name + "\n");
            if ( JsonData[i].venue.region != "") {
                consoleOutput += colors.yellow("Location") + colors.green(" : ") + colors.white(JsonData[i].venue.city + ", " + JsonData[i].venue.region + ", " + JsonData[i].venue.country + "\n");
            } else {
                consoleOutput += colors.yellow("Location") + colors.green(" : ") + colors.white(JsonData[i].venue.city + ", " + JsonData[i].venue.country + "\n");
            }
            beautifiedDate = moment(JsonData[i].datetime).format("MMM Do, YYYY");
            consoleOutput += colors.yellow("Date") + colors.green(" : ") + colors.white(beautifiedDate + "\n");
            consoleOutput += colors.gray("________________________________________________________________________________________________________________________\n");

        }
        
        // Function to send results
        okStatus(command, parameter, consoleOutput)

    })
    .catch(function(){

        // Function in case of error
        errorStatus("venues");

    });
}

// Function for "Spotify a Song" selection
function getSpotify(parameter) {

    if (parameter=="") {
        parameter = "The Sign";
    }
    spotify
    .search({ type: "track", query: parameter })
    .then(function(response) {

        // Set variable JsonData for short writing later
        var JsonData = response.tracks.items;
        
        // Clear the output
        consoleOutput = "";
        for (var i=0; i < JsonData.length; i++){

            // Create the output
            consoleOutput += colors.gray("________________________________________________________________________________________________________________________\n\n");
            consoleOutput += colors.yellow("Artist") + colors.green(" : ") + colors.white(JsonData[i].artists[0].name + "\n\n");
            consoleOutput += colors.yellow("Song") + colors.green(" : ") + colors.white(JsonData[i].name + "\n\n");
            if (JsonData[i].preview_url == null){
                consoleOutput += colors.yellow("Preview") + colors.green(" : ") + colors.red("No Preview \n\n");
            } else {
                consoleOutput += colors.yellow("Preview") + colors.green(" : ") + colors.cyan(JsonData[i].preview_url + "\n\n");
            }
            consoleOutput += colors.yellow("Album") + colors.green(" : ") + colors.white(JsonData[i].album.name + "\n\n");
            consoleOutput += colors.gray("________________________________________________________________________________________________________________________\n\n");
        }

        // Function to send results
        okStatus(command, parameter, consoleOutput)
        
    })
    .catch(function() {
        
        // Function in case of error
        errorStatus("songs");

    });

}

// Function for "Get Movie Info" selection
function getMovie(parameter) {

    if (parameter=="") {
        parameter = "Mr. Nobody";
    }
    axios
    .get("https://www.omdbapi.com/?t=" + parameter + "&y=&plot=short&apikey=" + keys.OMDB.key)
    .then(function(response){

        // Set variable JsonData for short writing later
        var JsonData = response.data;

        // Clear the output
        consoleOutput = "";

        // Create the output
        consoleOutput += colors.gray("________________________________________________________________________________________________________________________\n\n");
        consoleOutput += colors.yellow("Title") + colors.green(" : ") + colors.cyan(JsonData.Title + "\n\n");
        consoleOutput += colors.yellow("Year") + colors.green(" : ") + colors.white(JsonData.Year + "\n\n");
        consoleOutput += colors.yellow("IMDB Rating") + colors.green(" : ") + colors.white(JsonData.Ratings[0].Value + "\n\n");
        for (i=0; i<JsonData.Ratings.length; i++) {
            consoleOutput +=  colors.yellow(JsonData.Ratings[i].Source) + colors.green(" : ") + colors.white(JsonData.Ratings[i].Value + "\n\n");
        }
        consoleOutput += colors.yellow("Country") + colors.green(" : ") + colors.white(JsonData.Country + "\n\n");
        consoleOutput += colors.yellow("Language") + colors.green(" : ") + colors.white(JsonData.Language + "\n\n");
        consoleOutput += colors.yellow("Plot") + colors.green(" : ") + colors.white(JsonData.Plot + "\n\n");
        consoleOutput += colors.yellow("Actors") + colors.green(" : ") + colors.white(JsonData.Actors + "\n\n");
        consoleOutput += colors.gray("________________________________________________________________________________________________________________________\n\n");
        
        // Function to send results
        okStatus(command, parameter, consoleOutput)

    })
    .catch(function() {
        
        // Function in case of error
        errorStatus("movies");

    });
}

// Function for "Let Liri decide!" selection
function getBot() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log(error);
        }
        // Split the String from "random.txt" into an Array
        var dataArr = data.split(",");
        // Call the Main Function with pre-defined parameters
        userCommand(dataArr[0], dataArr[1]);

    });
};

// Log data to log.txt
function logData(command, parameter, result) {

    // Clear the output
    logOutput = "";

    // Create data for log.txt
    logOutput += "\n";
    logOutput += "***********************************************************************************************************************************************************\n\n";
    logOutput += "Logged: " + timeStamp + "\n\n";
    logOutput += "****************************************\n";
    logOutput += "Command: " + command + "\n";
    logOutput += "Search: " + parameter + "\n";
    logOutput += "****************************************\n\n";
    logOutput += "Result:\n";
    logOutput += "=======================================================================================================================================\n";
    logOutput += result + "\n";
    logOutput += "=======================================================================================================================================\n";
    logOutput += "***********************************************************************************************************************************************************\n\n";
    
    // Append the data to log.txt
    fs.appendFile("log.txt", logOutput, function(err) {
        if (err) {
          console.log(err);
        }
    });
}

// Function in case there is an error or no Results
function errorStatus(type) {

    // Clear the output
    consoleOutput = "";

    // Create the output
    consoleOutput += colors.gray("________________________________________\n\n");
    consoleOutput += colors.red("No " + type + " found.\n");
    consoleOutput += colors.gray("________________________________________\n\n");

    // Log the error
    logData(command, parameter, consoleOutput);

    // Display it in the terminal
    console.log(consoleOutput);

    // Function to prompt user if they would like to search again
    repeatQuestions();

}

// Function to handle data once received
function okStatus(command, parameter, consoleOutput) {

    // Log the data
    logData(command, parameter, consoleOutput);

    // Display it in the terminal
    console.log(consoleOutput);

    // Function to prompt user if they would like to search again
    repeatQuestions();
}

// Function to prompt user if they would like to search again
function repeatQuestions(){

    // Call Liri :)
    liriIn();

    inquirer.prompt([
        {
            type: "list",
            message: "Would you like to search something else?",
            choices: ["Yes", "No"],
            name: "play"
        }
    ]).then(function(answers) {

        // If "Yes", repeat the APP
        if (answers.play === "Yes") {

            //Clear console
            console.log('\033c');

            // Start the App
            askQuestions();

        } else {

            // Clear the output
            consoleOutput = "";

            // Create the output
            consoleOutput = "";
            consoleOutput += "\n\n";
            consoleOutput += colors.red("******************************************\n");
            consoleOutput += colors.red("*                                        *\n");
            consoleOutput += colors.red("*") + colors.magenta("           Liri") + colors.white(" out. Goodbye!           ") + colors.red("*\n");
            consoleOutput += colors.red("*                                        *\n");
            consoleOutput += colors.red("******************************************\n");
           
            // Display it in the terminal
            console.log(consoleOutput);

        }
    });
}

function initialize() {

    //Clear console
    console.log('\033c');
    
    // Clear the output
    consoleOutput = "";
    
    // Create the output
    consoleOutput += colors.red("******************************************\n");
    consoleOutput += colors.red("*                                        *\n");
    consoleOutput += colors.red("*") + colors.white("          Welcome to ") + colors.magenta("Liri") + colors.grey(" Bot") + colors.white("!          ") + colors.red("*\n");
    consoleOutput += colors.red("*                                        *\n");
    consoleOutput += colors.red("*") + colors.yellow("      Author") + colors.green("  :  ") + colors.white("Argiris Balomenos      ") + colors.red("*\n");
    consoleOutput += colors.red("*") + colors.yellow("      Date") + colors.green("    :  ") + colors.white("February 25, 2019      ") + colors.red("*\n");
    consoleOutput += colors.red("*                                        *\n");
    consoleOutput += colors.red("******************************************\n\n");
    console.log(consoleOutput);

    // Start the App
    askQuestions();

}

function liriIn(){

    // Clear the output
    consoleOutput = "";

    // Create the output
    consoleOutput += "\n\n";      
    consoleOutput += colors.gray("___________________________________________________________\n\n");
    consoleOutput += colors.magenta("Liri ") + colors.grey("Bot") + colors.white("...\n");

    // Display it in the terminal
    console.log(consoleOutput);

}


// Everything starts here
initialize();