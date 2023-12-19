function between(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

const handler = async (event, context) => {

  const SpotifyWebApi = require('spotify-web-api-node');


  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  spotifyApi.setRefreshToken(process.env.SPOTIFY_TOKEN);

  await spotifyApi.refreshAccessToken().then(
    function (data) {
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function (err) {
      console.log('Could not refresh access token', err);
    }
  );

  let topArtists = null;
  let randOffset = between(0, 4);
  await spotifyApi.getMyTopArtists({
    limit: '1',
    time_range: 'medium_term',
    offset: randOffset
  })
    .then(function (data) {
      topArtists = data.body.items;
    }, function (err) {
      console.log('Something went wrong!', err);
      topArtists = [{
        name: 'Radiohead',
        url: 'https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb'
      }]
    });

  const data = {
    artist: topArtists[0].name,
    url: topArtists[0].external_urls.spotify
  };

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

module.exports = { handler };