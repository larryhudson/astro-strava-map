import { useCallback } from 'react';
import { LngLat } from 'mapbox-gl';
import { decodePolyline } from '../lib/polyline';
import { Activity, NearbyActivity } from '../types/strava';

export const useFindNearbyActivities = () => {
    const findNearbyActivities = useCallback((point: LngLat, activities: Activity[]): NearbyActivity[] => {
        return activities
            .map(activity => {
                const coordinates = decodePolyline(activity.map.summary_polyline);
                const closestPoint = coordinates.reduce((closest, coord) => {
                    const distance = Math.sqrt(
                        Math.pow(coord.lng - point.lng, 2) + Math.pow(coord.lat - point.lat, 2)
                    );
                    return distance < closest.distance ? { distance, activity } : closest;
                }, { distance: Infinity, activity: null as Activity | null });
                return {
                    ...activity,
                    distanceFromClick: closestPoint.distance
                };
            })
            .sort((a, b) => a.distanceFromClick - b.distanceFromClick)
            .slice(0, 5);
    }, []);

    return { findNearbyActivities };
};
