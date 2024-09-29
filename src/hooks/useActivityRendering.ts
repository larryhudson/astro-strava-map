import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { decodePolyline } from '../lib/polyline';
import { Activity } from '../types/strava';

export const useActivityRendering = (
    map: mapboxgl.Map | null,
    activities: Activity[],
    fadeOldActivities: boolean,
    selectedActivity: number | null
) => {
    const calculateOpacity = useCallback((startDate: string) => {
        const activityDate = new Date(startDate);
        const now = new Date();
        const ageInDays = (now.getTime() - activityDate.getTime()) / (1000 * 3600 * 24);
        const maxAge = 14; // Activities older than this will have minimum opacity
        const minOpacity = 0.1;
        const maxOpacity = 0.25;

        return Math.max(minOpacity, maxOpacity - (ageInDays / maxAge) * (maxOpacity - minOpacity));
    }, []);

    const renderActivities = useCallback(() => {
        if (!map) return;

        activities.forEach((activity) => {
            const sourceId = `route-${activity.id}`;
            const layerId = `route-${activity.id}`;

            // Remove existing layer and source if they exist
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
            if (map.getSource(sourceId)) {
                map.removeSource(sourceId);
            }

            const coordinates = decodePolyline(activity.map.summary_polyline);

            map.addSource(sourceId, {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {
                        id: activity.id
                    },
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates.map(coord => [coord.lng, coord.lat])
                    }
                }
            });

            const opacity = fadeOldActivities ? calculateOpacity(activity.start_date) : 0.25;

            map.addLayer({
                id: layerId,
                type: 'line',
                source: sourceId,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': ['case',
                        ['==', ['get', 'id'], selectedActivity],
                        '#0000FF',
                        `rgba(255, 0, 0, ${opacity})`
                    ],
                    'line-width': 4
                }
            });
        });
    }, [map, activities, fadeOldActivities, selectedActivity, calculateOpacity]);

    return { renderActivities };
};
