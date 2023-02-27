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

module.exports = router;