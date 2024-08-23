import React from 'react';

interface Activity {
    id: number;
    name: string;
    distance: number;
    start_date: string;
}

interface SidebarProps {
    activities: Activity[];
    onActivityClick: (activityId: number) => void;
    selectedActivity: number | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activities, onActivityClick, selectedActivity }) => {
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
            {activities.length === 0 ? (
                <p>Click on the map to see nearby activities</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {activities.map((activity) => (
                        <li
                            key={activity.id}
                            onClick={() => onActivityClick(activity.id)}
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
