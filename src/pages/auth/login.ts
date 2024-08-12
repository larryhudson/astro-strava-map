import type { APIContext } from "astro";

export function GET({ redirect }: APIContext) {
    const STRAVA_CLIENT_ID = import.meta.env.STRAVA_CLIENT_ID;
    const STRAVA_REDIRECT_URI = import.meta.env.STRAVA_REDIRECT_URI;

    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${STRAVA_REDIRECT_URI}&scope=activity:read_all`;

    return redirect(authUrl);
}
