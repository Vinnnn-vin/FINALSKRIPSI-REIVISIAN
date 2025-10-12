// src\models\Assignment.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/database";

interface AssignmentAttributes {
  assignment_id: number;
  user_id: number;
  material_detail_id: number;
  title: string;
  description?: string;
  file_url?: string;
  score?: number;
  status: "pending" | "submitted" | "graded";
  due_date?: Date;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

type AssignmentCreationAttributes = Optional<
  AssignmentAttributes,
  | "assignment_id"
  | "description"
  | "file_url"
  | "score"
  | "status"
  | "due_date"
  | "created_at"
  | "updated_at"
  | "deleted_at"
>;

export class Assignment
  extends Model<AssignmentAttributes, AssignmentCreationAttributes>
  implements AssignmentAttributes
{
  declare assignment_id: number;
  declare user_id: number;
  declare material_detail_id: number;
  declare title: string;
  declare description?: string;
  declare file_url?: string;
  declare score?: number;
  declare status: "pending" | "submitted" | "graded";
  declare due_date?: Date;
  declare created_at?: Date;
  declare updated_at?: Date;
  declare deleted_at?: Date | null;
}

Assignment.init(
  {
    assignment_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    material_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    file_url: {
      type: DataTypes.TEXT,
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
    },
    status: {
      type: DataTypes.ENUM("pending", "submitted", "graded"),
      defaultValue: "pending",
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "Assignment",
    tableName: "assignments",
    timestamps: false,
  }
);
