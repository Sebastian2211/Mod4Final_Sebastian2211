import Sequelize from 'sequelize';
import sequelize from '../config/database.js';

const Note = sequelize.define('Note', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'notes',
    timestamps: false,
});

export default Note;
