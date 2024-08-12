import type { APIContext } from "astro";

export async function GET({ request, url, cookies, redirect }: APIContext) {
    const code = url.searchParams.get('code');

    console.log({ code })

    // get strava token using code
    const STRAVA_CLIENT_ID = import.meta.env.STRAVA_CLIENT_ID;
    const STRAVA_CLIENT_SECRET = import.meta.env.STRAVA_CLIENT_SECRET;

    const stravaTokenResponse = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: STRAVA_CLIENT_ID,
            client_secret: STRAVA_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code'
        })
    })

    if (!stravaTokenResponse.ok) {
        const responseText = await stravaTokenResponse.text();
        throw new Error(responseText)
    }

    const stravaTokenJson = await stravaTokenResponse.json();

    const stravaToken = stravaTokenJson.access_token;

    cookies.set('strava_token', stravaToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
    })

    return new Response(null, {
        status: 302,
        headers: {
            'Location': '/'
        }
    })
}
