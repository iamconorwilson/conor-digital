export const handler = async(event, context, callback) => {

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const code = event.queryStringParameters.code; // The authorization code from Spotify

    if (!clientId || !clientSecret || !code) {
        console.error("Missing required Spotify environment variables or authorization code.");
        return callback(null, {
            statusCode: 500,
            body: JSON.stringify({ error: "Server configuration error." }),
        });
    }


   const authResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:8888/.netlify/functions/callback", // Replace with your actual redirect URI
        code: code,
      }),
    });

    if (!authResponse.ok) {
        const errorBody = await authResponse.text();
        console.error("Failed to refresh access token:", errorBody);
        return callback(null, {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to authenticate with Spotify." }),
        });
    }
    
    const response = await authResponse.json();


    callback(null, {
      statusCode: 200,
      body: JSON.stringify(response),
    });
  };