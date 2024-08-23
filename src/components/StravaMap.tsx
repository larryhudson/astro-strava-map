import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { decodePolyline } from '../lib/polyline';
import Sidebar from './MapSidebar';

interface Activity {
    id: number;
    name: string;
    distance: number;
    start_date: string;
    map: {
        summary_polyline: string;
    };
}

interface MapWithPathsProps {
    activities: Activity[];
}

const MapWithPaths: React.FC<MapWithPathsProps> = ({ activities }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [zoom, setZoom] = useState<number>(10.86);
    const [center, setCenter] = useState<[number, number]>([2.36, 48.86]);
    const [nearbyActivities, setNearbyActivities] = useState<Activity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
    const [fadeOldActivities, setFadeOldActivities] = useState<boolean>(false);

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

                // Fit the map to show all routes
                const bounds = new mapboxgl.LngLatBounds();
                activities.forEach(activity => {
                    const coordinates = decodePolyline(activity.map.summary_polyline);
                    coordinates.forEach(coord => bounds.extend([coord.lng, coord.lat]));
                });
                // map.current?.fitBounds(bounds, { padding: 50 });

                // Update zoom and center state when the map moves
                map.current.on('move', () => {
                    if (map.current) {
                        setZoom(map.current.getZoom());
                        setCenter(map.current.getCenter().toArray() as [number, number]);
                    }
                });

                // Handle click events on the map
                map.current.on('click', (e) => {
                    const point = e.lngLat;
                    const nearbyActivities = findNearbyActivities(point, activities);
                    setNearbyActivities(nearbyActivities);
                });
            });
        }

        return () => {
            map.current?.remove();
        };
    }, [activities]);

    useEffect(() => {
        if (map.current?.loaded()) {
            renderActivities();
        }
    }, [fadeOldActivities, selectedActivity]);

    const renderActivities = () => {
        if (!map.current) return;

        activities.forEach((activity) => {
            const sourceId = `route-${activity.id}`;
            const layerId = `route-${activity.id}`;

            // Remove existing layer and source if they exist
            if (map.current.getLayer(layerId)) {
                map.current.removeLayer(layerId);
            }
            if (map.current.getSource(sourceId)) {
                map.current.removeSource(sourceId);
            }

            const coordinates = decodePolyline(activity.map.summary_polyline);

            map.current.addSource(sourceId, {
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

            map.current.addLayer({
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
    };

    const calculateOpacity = (startDate: string) => {
        const activityDate = new Date(startDate);
        const now = new Date();
        const ageInDays = (now.getTime() - activityDate.getTime()) / (1000 * 3600 * 24);
        const maxAge = 14; // Activities older than this will have minimum opacity
        const minOpacity = 0.1;
        const maxOpacity = 0.25;

        return Math.max(minOpacity, maxOpacity - (ageInDays / maxAge) * (maxOpacity - minOpacity));
    };

    useEffect(() => {
        if (map.current && selectedActivity !== null) {
            activities.forEach((activity) => {
                if (map.current) {
                    map.current.setPaintProperty(`route-${activity.id}`, 'line-color',
                        activity.id === selectedActivity ? '#0000FF' : 'rgba(255, 0, 0, 0.25)');
                }
            });
        }
    }, [selectedActivity, activities]);

    const findNearbyActivities = (point: mapboxgl.LngLat, activities: Activity[]): Activity[] => {
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
            .sort((a, b) => (a.distanceFromClick ?? Infinity) - (b.distanceFromClick ?? Infinity))
            .slice(0, 5);
    };

    const handleActivityClick = (activityId: number) => {
        setSelectedActivity(activityId);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '600px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <input
                    type="checkbox"
                    id="fadeOldActivities"
                    checked={fadeOldActivities}
                    onChange={(e) => setFadeOldActivities(e.target.checked)}
                />
                <label htmlFor="fadeOldActivities" style={{ marginLeft: '5px' }}>Fade old activities</label>
            </div>
            <div style={{ display: 'flex', flex: 1 }}>
                <div ref={mapContainer} style={{ width: '75%', height: '100%' }} />
                <Sidebar
                    activities={nearbyActivities}
                    onActivityClick={handleActivityClick}
                    selectedActivity={selectedActivity}
                />
            </div>
            <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(255, 255, 255, 0.7)',
                padding: '5px',
                borderRadius: '3px',
                fontSize: '12px'
            }}>
                Zoom: {zoom.toFixed(2)} | Center: [{center[0].toFixed(2)}, {center[1].toFixed(2)}]
            </div>
        </div>
    );
};

export default MapWithPaths;
