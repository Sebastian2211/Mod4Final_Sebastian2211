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
            const response = await axios.post('http://localhost:3000/notes', formData);
            console.log('Note created:', response.data);

            setFormData({
                title: '',
                content: '',
            });
            onNoteAdded();
        } catch (error) {
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
