import React, { useState } from 'react';
import axios from 'axios';

function NoteForm({ onNoteAdded }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send a POST request to create a new note
            const response = await axios.post('/api/notes', formData);
            // Handle successful note creation here
            console.log('Note created:', response.data);

            // Clear the form fields
            setFormData({
                title: '',
                content: '',
            });

            // Notify the parent component that a note has been added
            onNoteAdded();
        } catch (error) {
            // Handle note creation error, e.g., display error message to user
            console.error('Note creation error:', error);
        }
    };

    return (
        <div>
            <h3>Create a New Note</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div>
                    <button type="submit">Create Note</button>
                </div>
            </form>
        </div>
    );
}

export default NoteForm;
