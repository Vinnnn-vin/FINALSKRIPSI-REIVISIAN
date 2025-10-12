// src\models\StudentProgress.ts
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/database";

interface StudentProgressInterface {
  progress_id: number;
  user_id: number;
  course_id: number;
  material_detail_id: number;
  is_completed: boolean;
  completed_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface StudentProgressCreationAttributes
  extends Optional<
    StudentProgressInterface,
    | "progress_id"
    | "is_completed"
    | "completed_at"
    | "created_at"
    | "updated_at"
  > {}

class StudentProgress
  extends Model<StudentProgressInterface, StudentProgressCreationAttributes>
  implements StudentProgressInterface
{
  declare progress_id: number;
  declare user_id: number;
  declare course_id: number;
  declare material_detail_id: number;
  declare is_completed: boolean;
  declare completed_at: Date; 
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

StudentProgress.init(
  {
    progress_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "user_id" },
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "courses", key: "course_id" },
    },
    material_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "material_detail", key: "material_detail_id" },
    },
    is_completed: {
      // TAMBAHAN: Field crucial untuk tracking
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "StudentProgress",
    tableName: "student_progress",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default StudentProgress;
