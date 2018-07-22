require("dotenv").config();
var inquirer = require('inquirer');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
var fs = require("fs");
var keys = require("keys.js")

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var term = process.argv.slice(3).join(" ");

// console.log(spotify);
// console.log(client);

if (process.argv[2] === "my-tweets") {
    var params = {screen_name: "", count: 20};

    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if(!error) {
            console.log(tweets);
        }
    });
}

else if (process.argv[2] === "spotify-this-song") {
    if (term === "") {
        term = "I want it that way"
    };
    spotify.search({type: "track", query: term, limit: 1}, function(err, data) {
        if (err) {
            return console.log("Error: " + err)
        }
        console.log("Artist: "+data.tracks.items[0].album.artists[0].name);
        console.log("Tract: "+data.tracks.items[0].name);
        console.log("Preview Link: "+data.tracks.items[0].preview_url);
        console.log("Album: "+data.tracks.items[0].album.name);
    })
}

else if (process.argv[2] === "movie-this") {
    if (term === "") {
        term = "sharknado"
    }
    request("http://www.omdbapi.com/?t="+term+"&y=&plot=short&apikey=trilogy", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Released: " + JSON.parse(body).Year);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}

else if (process.argv[2] === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
        return console.log(error);
        }
    
        console.log(data);
    
        var dataArr = data.split(",");
    
        spotify.search({ type: 'track', query: dataArr[1], limit:1 }, function(err, data) {
            if (err) {
            return console.log('Error occurred: ' + err);
            }
        
            console.log("Artist: "+data.tracks.items[0].album.artists[0].name);
            console.log("Tract: "+data.tracks.items[0].name);
            console.log("Preview Link: "+data.tracks.items[0].preview_url);
            console.log("Album: "+data.tracks.items[0].album.name);
        });
    });
}