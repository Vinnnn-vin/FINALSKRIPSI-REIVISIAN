// src\models\Course.ts
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/database";
import { Course as CourseInterface, CourseLevel } from "../types";
import Category from "./Category";
import User from "./User";
import Material from "./Material";

interface CourseCreationAttributes
  extends Optional<
    CourseInterface,
    "course_id" | "created_at" | "updated_at" | "deleted_at"
  > {}

class Course
  extends Model<CourseInterface, CourseCreationAttributes>
  implements CourseInterface
{
  declare course_id: number;
  declare course_title: string;
  declare course_description: string;
  declare course_level: CourseLevel;
  declare course_price: number;
  declare course_duration?: number;
  declare publish_status?: number;
  declare user_id?: number;
  declare category_id?: number;
  declare thumbnail_url?: string;
  declare created_at?: Date;
  declare deleted_at?: Date;
  declare updated_at?: Date;

  declare readonly Materials?: Material[];
  declare readonly Category?: Category;
  declare readonly User?: User;
  declare readonly Enrollments?: any[];
  declare readonly Payments?: any[];
  declare readonly Quizzes?: any[];
  declare readonly Reviews?: any[];
  declare readonly Certificates?: any[];
  declare readonly StudentProgresses?: any[];

  declare instructor_name?: string;
  declare category_name?: string;
  declare total_materials?: number;
  declare total_students?: number;
  declare review_count?: number;
  declare student_count?: number;
  declare average_rating?: number;

  declare instructor: User;
}

Course.init(
  {
    course_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    course_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    course_level: {
      type: DataTypes.STRING(12),
      allowNull: true,
      validate: {
        isIn: [["Beginner", "Intermediate", "Advanced"]],
      },
    },
    course_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    course_duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    publish_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        isIn: [[0, 1]], // 0 = draft, 1 = published
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "category_id",
      },
    },
    thumbnail_url: {
      type: DataTypes.STRING(255),
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
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Course",
    tableName: "courses",
    timestamps: false,
  }
);

export default Course;
