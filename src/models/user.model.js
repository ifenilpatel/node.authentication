import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}

    static async comparePassword(enteredPassword, storedPassword) {
      return await bcrypt.compare(enteredPassword, storedPassword);
    }

    funAccessToken() {
      return jwt.sign({ user_id: this.user_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    }

    funRefreshToken() {
      return jwt.sign({ user_id: this.user_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    }
  }

  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'tbl_user',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    },
  );

  return User;
};
