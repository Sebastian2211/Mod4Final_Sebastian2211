import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';


class User extends Model { }

User.init(
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false, // Don't add the timestamp attributes (updatedAt, createdAt)
        sequelize, // Pass the Sequelize instance
        modelName: 'User', // Set the model name
    }
);

export default User;
