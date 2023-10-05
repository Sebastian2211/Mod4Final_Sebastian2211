import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegistrationForm() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [registrationStatus, setRegistrationStatus] = useState(null); // ['success', 'error', null]
    const navigate = useNavigate();

    const handleInputChange = (e) => {
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
                setRegistrationStatus('success');
                navigate('/dashboard');
            } else {
                setRegistrationStatus('error');
                console.error('Registration failed');
            }
        } catch (error) {
            setRegistrationStatus('error');
            console.error('Error registering user:', error);
        }
    };

    return (
        <div>
            <h2>Registration</h2>
            {registrationStatus === 'success' && (
                <p>Registration successful! You can now log in.</p>
            )}
            {registrationStatus === 'error' && (
                <p>Registration failed. Please try again.</p>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    );
}

export default RegistrationForm;
