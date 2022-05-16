exports.handler = async function (event, context) {
    var SpotifyWebApi = require('spotify-web-api-node');

    var spotifyApi = new SpotifyWebApi({
        clientId: '4c1e037adf834b09b5654e71b64dc16f',
        clientSecret: '7a459ba4cc3647a782495369ccaf027e'
      });

    spotifyApi.setAccessToken('BQD-3n5kwElgTkjgb2q7K1qC7c25Yd8-qcjH3dVDDxwmrUsRsgcsPSf2ICU11vRpLoLc9y0crBZOBqFib61yDEjbC5Ag1K4v90P5-ChMaspKs2iwnQkrZz4HpQ6qhg3anf_pss2RRVd-J6rJRdF9mWUPKg');
    spotifyApi.setRefreshToken('AQB7nOt2x5ImY4QJ8ZDG2rFb12ahKY5E0FxYtmbOjqv4ivE9SOYJ91wIz-fqkLI0AC0MBmhVAlHfpjD4KaqQUzfm75x4RkYPHhx0mPE2tHZ-PqKq0OXo5vfC5nAYB0ojeek');

    spotifyApi.getMyTopArtists()
    .then(function(data) {
        let topArtists = data.body.items;
    }, function(err) {
        console.log('Something went wrong!', err);
    });

    const data = { 
        artist: topArtists[0].name, 
        url: topArtists[0].external_urls.spotify 
    };

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  }