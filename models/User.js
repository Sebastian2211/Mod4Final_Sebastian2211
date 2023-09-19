import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js'; // Adjust the import path as needed


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
        sequelize, // Pass the Sequelize instance
        modelName: 'User', // Set the model name
    }
);

export default User;
