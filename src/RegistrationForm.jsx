import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegistrationForm() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        // Update the formData state based on user input
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Save the token to local storage or state for future requests
                // Redirect to the dashboard or login page
                navigate('/dashboard');
            } else {
                // Handle registration error (e.g., username already exists)
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    // Render the registration form JSX here, and use handleInputChange to update formData
}

export default RegistrationForm;
