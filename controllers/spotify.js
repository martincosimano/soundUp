const axios = require('axios');
const { getApiToken } = require('../services/spotify');


module.exports = {
  // getArtist: async (req, res) => {
  //   try {
  //     const token = await getApiToken();
  //     const artistParameters = {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer ' + token
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  // artistID: await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', artistParameters)
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  // search: async (req, res) => {
  //   try {
  //     const post = await Post.findById(req.params.id);
  //     res.console.log('Search for ' + req.body.songName);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
}



// const getArtistx = async (query) => {
//   try {
//     const token = await getApiToken();
//     const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=artist`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const artists = response.data.artists.items.map((item) => ({
//       id: item.id,
//       name: item.name,
//       image: item.images.length ? item.images[0].url : null,
//     }));
//     return artists;
//   } catch (error) {
//     throw new Error(`Error searching for artist: ${error.message}`);
//   }
// };
// module.exports = {
//   getArtist: async (req, res) => {
//     try {
//       const token = await getApiToken();
      

//     }
//   }
 
// }

// CreatePost: async (req, res) => {
//   try {
//     // Upload image to cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path);

//     //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
//     await Post.create({
//       title: req.body.title,
//       image: result.secure_url,
//       cloudinaryId: result.public_id,
//       caption: req.body.caption,
//       likes: 0,
//       user: req.user.id,
//     });
//     console.log("Post has been added!");
//     res.redirect("/profile");
//   } catch (err) {
//     console.log(err);
//   }
// }





// const searchSpotify = async (query, type) => {
//   // Get access token from Spotify API
//   const token = await getApiToken();
//   const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=1`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   });
//   const data = await response.json();
//   return data;
// };