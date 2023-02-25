//Using Spotify Api
// Returns the access token required for accessing the Spotify API
const request = require("request");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

function getApiToken() {
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "client_credentials",
    },
    json: true,
  };

  return new Promise((resolve, reject) => {
    request.post(authOptions, function (error, response, body) {
      if (error) {
        console.error("Error getting token:", error);
        reject(error);
        return;
      }

      if (response.statusCode !== 200) {
        console.error(
          "Received status code",
          response.statusCode,
          "with response body",
          body
        );
        reject(new Error("Received non-200 status code"));
        return;
      }

      const token = body.access_token;
      console.log("Received token:", token);
      resolve(token);
    });
  });
}

module.exports = { getApiToken };