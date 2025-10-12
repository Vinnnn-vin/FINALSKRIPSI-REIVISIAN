// src\models\Enrollment.ts
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/database";
import Course from "./Course";
import User from "./User";

interface EnrollmentInterface {
  enrollment_id: number;
  user_id?: number;
  course_id?: number;
  status?: "active" | "completed" | "dropped";
  enrolled_at?: Date;
  completed_at?: Date | null;

  learning_started_at?: Date | null;
  access_expires_at?: Date | null;

  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

interface EnrollmentCreationAttributes
  extends Optional<
    EnrollmentInterface,
    | "enrollment_id"
    | "created_at"
    | "updated_at"
    | "deleted_at"
    | "completed_at"
    | "enrolled_at"
  > {}

class Enrollment
  extends Model<EnrollmentInterface, EnrollmentCreationAttributes>
  implements EnrollmentInterface
{
  declare enrollment_id: number;
  declare user_id?: number;
  declare course_id?: number;
  declare status?: "active" | "completed" | "dropped";
  declare enrolled_at?: Date;
  declare completed_at?: Date | null;

  declare learning_started_at?: Date | null;
  declare access_expires_at?: Date | null;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;

  declare readonly course?: Course;
  declare readonly student?: User;
}

Enrollment.init(
  {
    enrollment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "courses",
        key: "course_id",
      },
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        isIn: [["active", "completed", "dropped", "inactive"]],
      },
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
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    enrolled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    learning_started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    access_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Enrollment",
    tableName: "enrollments",
    // timestamps: false,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

export default Enrollment;
