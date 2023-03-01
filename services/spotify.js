//Using Spotify Api
// Returns the access token required for accessing the Spotify API
// require('dotenv').config({ path: './config/.env' });
// const axios = require('axios');
// const request = require("request");

// const client_id = process.env.CLIENT_ID;
// const client_secret = process.env.CLIENT_SECRET;

// function getApiToken() {
//   const authOptions = {
//     url: "https://accounts.spotify.com/api/token",
//     headers: {
//       Authorization:
//         "Basic " +
//         Buffer.from(client_id + ":" + client_secret).toString("base64"),
//     },
//     form: {
//       grant_type: "client_credentials",
//       scope: "user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read user-follow-read user-top-read",
//     },
//     json: true,
//   };

//   return new Promise((resolve, reject) => {
//     request.post(authOptions, function (error, response, body) {
//       if (error) {
//         console.error("Error getting token:", error);
//         reject(error);
//         return;
//       }

//       if (response.statusCode !== 200) {
//         console.error(
//           "Received status code",
//           response.statusCode,
//           "with response body",
//           body
//         );
//         reject(new Error("Received non-200 status code"));
//         return;
//       }

//       const token = body.access_token;
//       console.log("Received token:", token);
//       resolve(token);
//     });
//   });
// }

require('dotenv').config({ path: './config/.env' });
const axios = require('axios');

const getApiToken = async () => {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            'Authorization' : 'Basic ' + btoa( clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const token = await result.json();
    return token.access_token;
}

const searchTrack = async (songName, artistName, token) => {
    const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
            Authorization: 'Bearer ' + token,
        },
        params: {
            q: `track:${songName} artist:${artistName}`,
            type: 'track',
            limit: 1,
        },
    });

    return response.data;
}

module.exports = { getApiToken, searchTrack };

    // return {
    //     getToken() {
    //         return _getToken();
    //     },
    //     getTrack(token, trackEndPoint) {
    //         return _getTrack(token, trackEndPoint);
    //     }
    // }


// module.exports = { getApiToken };