function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

exports.handler = async function (event, context) {
    var SpotifyWebApi = require('spotify-web-api-node');

    var spotifyApi = new SpotifyWebApi({
        clientId: '4c1e037adf834b09b5654e71b64dc16f',
        clientSecret: '7a459ba4cc3647a782495369ccaf027e'
      });

    spotifyApi.setRefreshToken('AQAO_Zv6ltqNi7tlwJB4WL2aQQ-7GToxOWL5Gw_Hs9wcgl_Zl066c0v2h5sOTe2hKeIiVa2NtL_JuD_ANTPBKaiWz2MCdisHCpsdXrWXunEzMHfA6uDEnLW3v6Ku41zkVc4');

    await spotifyApi.refreshAccessToken().then(
      function(data) {
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
      },
      function(err) {
        console.log('Could not refresh access token', err);
      }
    );

    let topArtists = null;
    let randOffset = between(0, 4);
    await spotifyApi.getMyTopArtists({
        limit: '1',
        time_range: 'short_term',
        offset: randOffset
    })
    .then(function(data) {
        topArtists = data.body.items;
    }, function(err) {
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
  }