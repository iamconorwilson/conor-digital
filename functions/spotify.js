
// Spotify API constants
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const TOP_ARTISTS_ENDPOINT = 'https://api.spotify.com/v1/me/top/artists';

// Environment variables
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_TOKEN } = process.env;

/**
 * Retrieves a new Spotify access token using the refresh token.
**/
async function getAccessToken() {
  const basicAuth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_TOKEN,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Failed to refresh access token:', errorBody);
    throw new Error('Could not refresh Spotify access token.');
  }

  const { access_token } = await response.json();
  return access_token;
}


export const handler = async (event, context) => {
  const fallbackData = {
    artist: 'Radiohead',
    url: 'https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb',
  };

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_TOKEN) {
    console.error('Missing required Spotify environment variables.');
    return {
      statusCode: 200, // Returning 200 as requested
      body: JSON.stringify(fallbackData),
    };
  }

  try {
    const accessToken = await getAccessToken();

    // Your logic: use a random offset to select a single artist via the API.
    // This assumes the user has at least 12 top artists.
    const randomOffset = Math.floor(Math.random() * 12);
    const apiQuery = new URLSearchParams({
      time_range: 'medium_term',
      limit: '1',
      offset: randomOffset,
    });

    const artistsResponse = await fetch(`${TOP_ARTISTS_ENDPOINT}?${apiQuery}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!artistsResponse.ok) {
      throw new Error('Spotify API returned a non-200 status code.');
    }

    const topArtistsData = await artistsResponse.json();
    const artist = topArtistsData.items[0];

    if (!artist) {
      console.log('No artist found at the random offset. Using fallback.');
      return {
        statusCode: 200,
        body: JSON.stringify(fallbackData),
      };
    }

    const responseData = {
      artist: artist.name,
      url: artist.external_urls.spotify,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(responseData),
    };

  } catch (error) {
    console.error('An error occurred:', error.message);
    return {
      statusCode: 200,
      body: JSON.stringify(fallbackData),
    };
  }
};