const express = require('express');
const router = express.Router();
const { getArtist, getAlbum, getSongs } = require('../controllers/spotify');

router.get('/', async (req, res, next) => {
  try {
    const query = req.query.q;
    const artists = await getArtist(query);
    const albums = await getAlbum(query);
    const songs = await getSongs(query);
    res.render('spotify', { artists, albums, songs });
  } catch (error) {
    next(error);
  }
});

router.post('/song', async (req, res, next) => {
  try {
    const { title, artist } = req.body;
    // Use title and artist to search for song on Spotify API
    // Send back the result to the UI
  } catch (error) {
    next(error);
  }
});

module.exports = router;