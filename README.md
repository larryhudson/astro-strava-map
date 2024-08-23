# Strava Activity Visualizer

## What this project does and how it works

This project is a web application built with Astro that integrates with the Strava API to visualize your athletic activities. It allows users to authenticate with their Strava account, fetch their activity data, and display it on an interactive map. The application showcases how to work with external APIs, handle authentication flows, and create dynamic visualizations using modern web technologies.

## Code examples

Here are a few key code snippets that demonstrate the core functionality of the project:

1. Strava API Authentication:

```typescript
// src/lib/strava.ts
export async function exchangeToken(code: string): Promise<StravaTokenResponse> {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: import.meta.env.STRAVA_CLIENT_ID,
      client_secret: import.meta.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });

  return response.json();
}
```

This function handles the token exchange process with the Strava API, which is crucial for authenticating users and accessing their activity data.

2. Rendering the Strava Map:

```astro
---
// src/components/StravaMap.astro
import { getActivities } from '../lib/strava';

const activities = await getActivities();
---

<div id="map"></div>

<script define:vars={{ activities }}>
  // Map initialization and activity rendering logic
  // ...
</script>
```

This Astro component fetches the user's activities and renders them on an interactive map using client-side JavaScript.

## Getting started

To set up and run this project locally, follow these steps:

1. Clone the repository to your local machine.
2. Install dependencies by running `npm install` in the project root.
3. Create a `.env` file in the project root and add your Strava API credentials:
   ```
   STRAVA_CLIENT_ID=your_client_id
   STRAVA_CLIENT_SECRET=your_client_secret
   ```
4. Start the development server with `npm run dev`.
5. Open your browser and navigate to `http://localhost:4321` to view the application.

## Additional resources

For more information and to dive deeper into the technologies used in this project, check out these resources:

- [Astro Documentation](https://docs.astro.build)
- [Strava API Documentation](https://developers.strava.com/)
- [Leaflet.js for interactive maps](https://leafletjs.com/)
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
