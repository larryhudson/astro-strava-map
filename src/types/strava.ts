import { LngLat } from 'mapbox-gl';

export interface Activity {
    id: number;
    name: string;
    distance: number;
    start_date: string;
    map: {
        summary_polyline: string;
    };
    distanceFromClick?: number;
}

export interface MapWithPathsProps {
    activities: Activity[];
}

export interface NearbyActivity extends Activity {
    distanceFromClick: number;
}

export interface MapState {
    zoom: number;
    center: [number, number];
}

export interface MapContextProps {
    map: mapboxgl.Map | null;
    activities: Activity[];
    selectedActivity: number | null;
    fadeOldActivities: boolean;
    nearbyActivities: NearbyActivity[];
    mapState: MapState;
    setSelectedActivity: (id: number | null) => void;
    setFadeOldActivities: (fade: boolean) => void;
    setNearbyActivities: (activities: NearbyActivity[]) => void;
    setMapState: (state: MapState) => void;
}
