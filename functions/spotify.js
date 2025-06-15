import { SpotifyApi } from "@spotify/web-api-ts-sdk";

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export const handler = async (event, context) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error("Missing required Spotify environment variables.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server configuration error." }),
    };
  }

try {
    const authResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!authResponse.ok) {
        const errorBody = await authResponse.text();
        console.error("Failed to refresh access token:", errorBody);
        throw new Error("Could not refresh Spotify access token.");
    }
    
    const { access_token } = await authResponse.json();

    const sdk = SpotifyApi.withAccessToken(clientId, {
        access_token: access_token
    });

    const randOffset = between(0, 8);
    const topArtistsPage = await sdk.currentUser.topItems('artists', 'long_term', 1, randOffset);
    const topArtists = topArtistsPage.items;

    if (!topArtists || topArtists.length === 0) {
      console.log('No top artists found.');
      return {
        statusCode: 200,
        body: JSON.stringify({
          artist: 'Radiohead', // Fallback artist
          url: 'https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb'
        }),
      };
    }

    const artist = topArtists[0];
    const responseData = {
      artist: artist.name,
      url: artist.external_urls.spotify,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(responseData),
    };

  } catch (err) {
    console.error('Something went wrong with the Spotify API call!', err);
    const fallbackData = {
      artist: 'Radiohead',
      url: 'https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb'
    };
    return {
      statusCode: 200,
      body: JSON.stringify(fallbackData),
    };
  }
};