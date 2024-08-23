# Strava Activity Visualizer

## What this project does and how it works

This project is a web application built with Astro that integrates with the Strava API to visualize your athletic activities. The main purpose of this project is to display all of a user's activities on a single map, providing a comprehensive view of their exploration. For example, if a user frequently walks around a city, they can see how much of the city they have covered over time. This visualization allows users to track their progress and discover new areas to explore.

The application allows users to authenticate with their Strava account, fetch their activity data, and display it on an interactive map using Mapbox GL. It showcases how to work with external APIs, handle authentication flows, and create dynamic visualizations using modern web technologies.

## Key Features

- Strava API integration for fetching user activities
- Interactive map visualization using Mapbox GL
- Activity polyline decoding and rendering
- Dynamic activity selection and highlighting
- Fade effect for older activities

## Code examples

Here are a few key code snippets that demonstrate the core functionality of the project:

1. Fetching Strava Activities:

```typescript
// src/lib/strava.ts
export async function fetchStravaActivities(stravaToken: string) {
    const start2024 = new Date('2024-01-01').getTime() / 1000;
    const searchParamsString = new URLSearchParams({
        after: start2024.toString(),
    }).toString();

    const activitiesUrl = `https://www.strava.com/api/v3/athlete/activities?${searchParamsString}`;

    const response = await fetch(activitiesUrl, {
        headers: { 'Authorization': `Bearer ${stravaToken}` }
    });

    if (!response.ok) {
        throw new Error(`Strava API error: ${response.status}`);
    }

    return response.json();
}
```

This function fetches the user's activities from the Strava API, using the provided access token.

2. Rendering the Strava Map:

```tsx
// src/components/StravaMap.tsx
const MapWithPaths: React.FC<MapWithPathsProps> = ({ activities }) => {
    useEffect(() => {
        if (mapContainer.current) {
            mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_ACCESS_TOKEN as string;
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [2.36, 48.86],
                zoom: 10.86
            });

            map.current.on('load', () => {
                renderActivities();
                // ... other map initialization logic
            });
        }
        // ... cleanup logic
    }, [activities]);

    // ... other component logic
}
```

This React component initializes the Mapbox GL map and renders the user's activities as paths on the map.

## Getting started

To set up and run this project locally, follow these steps:

1. Clone the repository to your local machine.
2. Install dependencies by running `npm install` in the project root.
3. Create a `.env` file in the project root and add your Strava API and Mapbox credentials:
   ```
   STRAVA_CLIENT_ID=your_strava_client_id
   STRAVA_CLIENT_SECRET=your_strava_client_secret
   PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
   ```
4. Start the development server with `npm run dev`.
5. Open your browser and navigate to `http://localhost:4321` to view the application.

## Additional resources

For more information and to dive deeper into the technologies used in this project, check out these resources:

- [Astro Documentation](https://docs.astro.build)
- [Strava API Documentation](https://developers.strava.com/)
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
