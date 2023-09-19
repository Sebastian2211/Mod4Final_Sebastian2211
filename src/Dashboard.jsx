import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data from the server using the JWT token
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        if (token) {
            fetch('http://localhost:3000/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        // Handle authentication error (e.g., token expired)
                        console.error('Authentication failed');
                        navigate('/login'); // Redirect to the login page
                    }
                })
                .then((data) => {
                    setUserData(data.user);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, []);

    // Render the dashboard JSX here, displaying user data
}

export default Dashboard;
