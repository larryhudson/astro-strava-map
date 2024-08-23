import polyline from '@mapbox/polyline';

export const decodePolyline = (encoded: string): Array<{ lat: number; lng: number }> => {
    const coordinates = polyline.decode(encoded);
    return coordinates.map(coord => ({ lat: coord[0], lng: coord[1] }));
};
