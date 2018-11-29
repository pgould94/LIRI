// Read and set any environment variables with the dotenv package
require('dotenv').config();

// Import fs module
const fs = require('fs')
// Import inquirer module
const inquirer = require('inquirer');

// Import axios module
const axios = require('axios');

// Import spotify api
const Spotify = require('node-spotify-api');

// Import moment module
const moment = require('moment');

// Reads the spotify api keys from keys.js
const keys = require('./keys');

// Read api keys from api_keys file
const api_key = require('./api_keys')

var spotify = new Spotify(keys.spotify)


function spotifySearch(song) {
    spotify
    .search({ type: 'track', query: song })
    .then(function(response) {
        let spacer = '*------------------------------------------------------------------*'
        let base = response.tracks.items[0]
        let artist = base.album.artists[0].name
        let album = base.album.name
        let date = base.album.release_date
        let name = base.name
        let url = base.external_urls.spotify

        console.log(`\n${spacer}\n\n  Song: ${name}\n\n  Artist: ${artist}\n\n  Album: ${album}\n\n  Release Date: ${date}\n\n  Spotify URL: ${url}\n\n${spacer}`)
    
})
.catch(function(err) {
    console.log(err);
});
}

// Initialize inquirer prompt
inquirer.prompt([
    
    {
        type: 'list',
        name: 'command',
        message: 'What would you like to do?',
        choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says']
    },
    {
        type: 'input',
        name: 'search',
        message:'What would you like to search for?'
    }
    

]) 
.then(function(answers) {
    let spacer = '*------------------------------------------------------------------*'
    // Logic that handles the inquierer answers
    if (answers.command === 'spotify-this-song') {

        // Default spotify search logic
        if (answers.search === '') {
            spotifySearch('The Sign Ace of Base')
        }

        // Logic for user input spotify search
        else {
            spotifySearch(answers.search)
        }
    }
    else if (answers.command === 'movie-this') {
        let movie = answers.search;
        axios({
            method:'get',
            url:`http://www.omdbapi.com/?${api_key.omdb}&t=${movie}&type=movie&plot=short`,
        })
        .then(function (response) {
            let title = response.data.Title;
            let release_date = response.data.Released;
            let imdb_rating = response.data.imdbRating;
            let rotten_rating = response.data.Ratings[1].Value;
            let country = response.data.Country;
            let language = response.data.Language;
            let plot = response.data.Plot;
            let actors = response.data.Actors;
            console.log(response.data.Title)
            
            console.log(`\n${spacer}\n\n  Title: ${title}\n\n  Release Date: ${release_date}\n\n  Actors: ${actors}\n\n  IMDB Rating: ${imdb_rating}\n\n  Rotten Tomatoes Rating: ${rotten_rating}\n\n  Country: ${country}\n\n  Language: ${language}\n\n  Plot: ${plot}\n\n${spacer}`)
        });
    }

    else if (answers.command === 'do-what-it-says') {
        fs.readFile("random.txt", "UTF8", function(error, data){
            if(error){
                console.log(error)
            }
    
            else {
                let search = data.split('"')
                console.log(search[1])
                spotifySearch(search[1])

            }
        });
    }
});