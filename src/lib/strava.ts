export async function fetchStravaActivities(stravaToken: string) {
    console.log({ stravaToken })

    // get timestamp for start of 2024
    const start2024 = new Date('2024-01-01').getTime() / 1000

    const searchParamsString = new URLSearchParams({
        after: start2024.toString(),
    }).toString()

    const activitiesUrl = `https://www.strava.com/api/v3/athlete/activities?${searchParamsString}`

    console.log({ activitiesUrl })

    const response = await fetch(activitiesUrl, {
        headers: { 'Authorization': `Bearer ${stravaToken}` }
    })

    if (!response.ok) {
        const responseText = await response.text()
        throw new Error(`Strava API error: ${response.status} - ${responseText}`)
    }

    const activities = await response.json()

    return activities;
}
