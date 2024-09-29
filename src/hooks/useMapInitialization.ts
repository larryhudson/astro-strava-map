import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapState } from '../types/strava';

export const useMapInitialization = (
    mapContainer: React.RefObject<HTMLDivElement>,
    setMap: (map: mapboxgl.Map) => void,
    setMapState: (state: MapState) => void
) => {
    const initializeMap = useCallback(() => {
        if (mapContainer.current) {
            mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_ACCESS_TOKEN as string;
            const newMap = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [2.36, 48.86],
                zoom: 10.86
            });

            newMap.on('load', () => {
                setMap(newMap);
            });

            newMap.on('move', () => {
                setMapState({
                    zoom: newMap.getZoom(),
                    center: newMap.getCenter().toArray() as [number, number]
                });
            });
        }
    }, [mapContainer, setMap, setMapState]);

    return { initializeMap };
};
