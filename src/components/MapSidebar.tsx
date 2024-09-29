import React, { useContext } from 'react';
import { MapContext } from './StravaMap';

const Sidebar: React.FC = () => {
    const context = useContext(MapContext);
    if (!context) throw new Error("Sidebar must be used within a MapContext Provider");
    const { nearbyActivities, setSelectedActivity, selectedActivity } = context;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatDistance = (distance: number) => {
        return (distance / 1000).toFixed(2) + ' km';
    };

    return (
        <div style={{ width: '25%', height: '100%', overflowY: 'auto', padding: '10px', backgroundColor: '#f0f0f0' }}>
            <h3>Nearby Activities</h3>
            {nearbyActivities.length === 0 ? (
                <p>Click on the map to see nearby activities</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {nearbyActivities.map((activity) => (
                        <li
                            key={activity.id}
                            onClick={() => setSelectedActivity(activity.id)}
                            style={{
                                cursor: 'pointer',
                                padding: '10px',
                                marginBottom: '5px',
                                backgroundColor: selectedActivity === activity.id ? '#ddd' : 'white',
                                borderRadius: '5px',
                            }}
                        >
                            <div style={{ fontWeight: 'bold' }}>{activity.name}</div>
                            <div>{formatDate(activity.start_date)}</div>
                            <div>{formatDistance(activity.distance)}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Sidebar;
