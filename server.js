
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import User from './models/User.js';
import sequelize from './config/database.js';
import Note from './models/Note.js';
import { log } from 'console';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const JWT_SECRET = process.env.JWT_SECRET;

sequelize.sync().then(() => {
    console.log('Database & tables created!');
});





app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({ username, password: hashedPassword });

        const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET);

        res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);

        res.json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
});



app.get('/users', async (req, res) => {
    try {

        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.use(async function verifyJwt(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Invalid authorization, no authorization headers' });
    }
    console.log('req.headers.authorization:', req.headers.authorization);
    const [scheme, token] = req.headers.authorization.split(' ');

    if (scheme !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid authorization, invalid authorization scheme' });
    }

    console.log('Received Token:', token);

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        console.log('Payload:', payload);
        req.user = payload;
        next();
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'JWT token has expired' });
        } else if (err.name === 'JsonWebTokenError') {
            res.status(401).json({ message: 'Invalid JWT token' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

// Create a new note
app.post('/notes', async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;

        const note = await Note.create({
            title,
            content,
            user_id: userId,
        });

        res.status(201).json({ note });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ message: 'Error creating note' });
    }
});

// Retrieve all notes
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.findAll();
        res.json({ data: notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Retrieve user's notes
app.get('/notes/userId', async (req, res) => {
    try {
        console.log('req.user:', req.user);
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const userId = req.user.id;

        const notes = await Note.findAll({
            where: { user_id: userId },
        });

        if (!notes || notes.length === 0) {
            return res.status(404).json({ message: 'No notes found for the user' });
        }

        res.json({ data: notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




// Update a note
app.put('/notes/:id', async (req, res) => {
    try {
        const noteId = req.params.id;

        const updatedNote = req.body;

        const note = await Note.findByPk(noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        note.title = updatedNote.title;
        note.content = updatedNote.content;

        await note.save();

        return res.status(200).json({ message: 'Note updated successfully' });
    } catch (error) {
        console.error('Error updating note:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a note
app.delete('/notes/:id', async (req, res) => {
    try {
        const noteId = req.params.id;

        const note = await Note.findByPk(noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await note.destroy();

        return res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Route to test and verify a JWT token
app.post('/test-verify-token', async (req, res) => {
    const { token } = req.body;

    console.log('Received Token:', token);

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        res.json({ message: 'Token verification successful', payload });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token verification failed' });
    }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
