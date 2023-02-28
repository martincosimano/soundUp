const axios = require('axios');
const { getApiToken } = require('../services/spotify');

const getArtist = async (query) => {
  try {
    const token = await getApiToken();
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=artist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const artists = response.data.artists.items.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.images.length ? item.images[0].url : null,
    }));
    return artists;
  } catch (error) {
    throw new Error(`Error searching for artist: ${error.message}`);
  }
};

const getArtistData = async (artistName) => {
  const token = await getApiToken();
  const response = await axios.get(`https://api.spotify.com/v1/search?q=${artistName}&type=artist&limit=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const artist = response.data.artists.items[0];

  const artistData = {
    name: artist.name,
    image: artist.images[0].url,
    genres: artist.genres,
    spotifyLink: artist.external_urls.spotify,
    followers: artist.followers.total,
  };

  return artistData;
};

const getAlbum = async (id) => {
  try {
    const token = await getApiToken();
    const response = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const album = {
      id: response.data.id,
      name: response.data.name,
      image: response.data.images.length ? response.data.images[0].url : null,
      artist: response.data.artists.map((artist) => artist.name).join(', '),
      tracks: response.data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        duration: track.duration_ms,
      })),
    };
    return album;
  } catch (error) {
    throw new Error(`Error getting album details: ${error.message}`);
  }
};

const getSongs = async (query) => {
  try {
    const token = await getApiToken();
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const songs = response.data.tracks.items.map((item) => ({
      id: item.id,
      name: item.name,
      artist: item.artists.map((artist) => artist.name).join(', '),
    }));
    return songs;
  } catch (error) {
    throw new Error(`Error searching for songs: ${error.message}`);
  }
};



module.exports = { getArtist, getArtistData, getAlbum, getSongs };