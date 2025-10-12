// src\models\Notification.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface NotificationInterface {
  notification_id: number;
  user_id?: number; // Changed from string to number
  notification_title?: string;
  notification_message?: string;
  notification_type?: string;
  is_read?: boolean;
  created_at?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface NotificationCreationAttributes extends Optional<NotificationInterface, 'notification_id' | 'created_at' | 'is_read'> {}

class Notification extends Model<NotificationInterface, NotificationCreationAttributes> implements NotificationInterface {
  declare notification_id: number;
  declare user_id?: number;
  declare notification_title?: string;
  declare notification_message?: string;
  declare notification_type?: string;
  declare is_read?: boolean;
  declare created_at?: Date;

  // Relasi
  declare readonly User?: any;

  // Method to mark notification as read
  public async markAsRead(): Promise<void> {
    this.is_read = true;
    await this.save();
  }
}

Notification.init(
  {
    notification_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER, // Changed from STRING to INTEGER
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    notification_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    notification_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notification_type: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        isIn: [['info', 'success', 'warning', 'error', 'system']],
      },
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: false,
  }
);

export default Notification;