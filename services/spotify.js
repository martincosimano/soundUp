//Using Spotify Api
require('dotenv').config({ path: './config/.env' });
const axios = require('axios');

const getApiToken = async () => {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            'Authorization' : 'Basic ' + btoa( clientId + ':' + clientSecret)
        },
    });

    const token = response.data.access_token;
    return token;
}

const searchTrack = async (songName, artistName, token) => {
    const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
            Authorization: 'Bearer ' + token,
        },
        params: {
            q: `${songName} ${artistName}`,
            type: 'track',
            limit: 1,
        },
    });
    return response.data;
}

module.exports = { getApiToken, searchTrack };