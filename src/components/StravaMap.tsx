import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { decodePolyline } from '../lib/polyline';
import Sidebar from './MapSidebar';
import { MapWithPathsProps, MapContextProps, Activity, NearbyActivity, MapState } from '../types/strava';
import { useMapInitialization } from '../hooks/useMapInitialization';
import { useActivityRendering } from '../hooks/useActivityRendering';
import { useFindNearbyActivities } from '../hooks/useFindNearbyActivities';

const MapContext = createContext<MapContextProps | undefined>(undefined);

const MapWithPaths: React.FC<MapWithPathsProps> = ({ activities }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [mapState, setMapState] = useState<MapState>({ zoom: 10.86, center: [2.36, 48.86] });
    const [nearbyActivities, setNearbyActivities] = useState<NearbyActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
    const [fadeOldActivities, setFadeOldActivities] = useState<boolean>(false);

    const { initializeMap } = useMapInitialization(mapContainer, setMap, setMapState);
    const { renderActivities } = useActivityRendering(map, activities, fadeOldActivities, selectedActivity);
    const { findNearbyActivities } = useFindNearbyActivities();

    useEffect(() => {
        initializeMap();
        return () => {
            map?.remove();
        };
    }, []);

    useEffect(() => {
        if (map?.loaded()) {
            renderActivities();
        }
    }, [map, fadeOldActivities, selectedActivity, activities]);

    useEffect(() => {
        if (map) {
            map.on('click', (e) => {
                const nearby = findNearbyActivities(e.lngLat, activities);
                setNearbyActivities(nearby);
            });
        }
    }, [map, activities]);

    const contextValue: MapContextProps = {
        map,
        activities,
        selectedActivity,
        fadeOldActivities,
        nearbyActivities,
        mapState,
        setSelectedActivity,
        setFadeOldActivities,
        setNearbyActivities,
        setMapState,
    };

    return (
        <MapContext.Provider value={contextValue}>
            <div style={{ position: 'relative', width: '100%', height: '600px', display: 'flex', flexDirection: 'column' }}>
                <FadeActivitiesCheckbox />
                <div style={{ display: 'flex', flex: 1 }}>
                    <div ref={mapContainer} style={{ width: '75%', height: '100%' }} />
                    <Sidebar />
                </div>
                <MapInfo />
            </div>
        </MapContext.Provider>
    );
};

const FadeActivitiesCheckbox: React.FC = () => {
    const context = useContext(MapContext);
    if (!context) throw new Error("FadeActivitiesCheckbox must be used within a MapContext Provider");
    const { fadeOldActivities, setFadeOldActivities } = context;

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <input
                type="checkbox"
                id="fadeOldActivities"
                checked={fadeOldActivities}
                onChange={(e) => setFadeOldActivities(e.target.checked)}
            />
            <label htmlFor="fadeOldActivities" style={{ marginLeft: '5px' }}>Fade old activities</label>
        </div>
    );
};

const MapInfo: React.FC = () => {
    const context = useContext(MapContext);
    if (!context) throw new Error("MapInfo must be used within a MapContext Provider");
    const { mapState } = context;

    return (
        <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '5px',
            borderRadius: '3px',
            fontSize: '12px'
        }}>
            Zoom: {mapState.zoom.toFixed(2)} | Center: [{mapState.center[0].toFixed(2)}, {mapState.center[1].toFixed(2)}]
        </div>
    );
};

export default MapWithPaths;
