// src\models\Review.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface ReviewInterface {
  review_id: number;
  user_id?: number; // Changed from string to number
  course_id?: number; // Changed from string to number
  rating?: number;
  review_text?: string;
  created_at?: Date;
  deleted_at?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ReviewCreationAttributes extends Optional<ReviewInterface, 'review_id' | 'created_at' | 'deleted_at'> {}

class Review extends Model<ReviewInterface, ReviewCreationAttributes> implements ReviewInterface {
  declare review_id: number;
  declare user_id?: number;
  declare course_id?: number;
  declare rating?: number;
  declare review_text?: string;
  declare created_at?: Date;
  declare deleted_at?: Date;

  // Relasi
  declare readonly User?: any;
  declare readonly Course?: any;
}

Review.init(
  {
    review_id: {
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
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'courses',
        key: 'course_id',
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
      comment: 'Rating from 1 to 5 stars',
    },
    review_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: false,
  }
);

export default Review;