// src\models\AssignmentSubmission.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/database";

interface AssignmentSubmissionAttributes {
  submission_id: number;
  user_id: number;
  material_detail_id: number;
  course_id: number;
  enrollment_id: number;
  submission_type: "file" | "url" | "text";
  file_path?: string;
  submission_url?: string;
  submission_text?: string;
  attempt_number: number;
  status: "pending" | "submitted" | "under_review" | "approved" | "rejected";
  score?: number;
  feedback?: string;
  reviewed_by?: number;
  submitted_at?: Date;
  reviewed_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}
type AssignmentSubmissionCreationAttributes = Optional<
  AssignmentSubmissionAttributes,
  | "submission_id"
  | "file_path"
  | "submission_url"
  | "submission_text"
  | "score"
  | "feedback"
  | "reviewed_by"
  | "submitted_at"
  | "reviewed_at"
  | "created_at"
  | "updated_at"
>;
export class AssignmentSubmission
  extends Model<AssignmentSubmissionAttributes, AssignmentSubmissionCreationAttributes>
  implements AssignmentSubmissionAttributes
{
  declare submission_id: number;
  declare user_id: number;
  declare material_detail_id: number;
  declare course_id: number;
  declare enrollment_id: number;
  declare submission_type: "file" | "url" | "text";
  declare file_path?: string;
  declare submission_url?: string;
  declare submission_text?: string;
  declare attempt_number: number;
  declare status: "pending" | "submitted" | "under_review" | "approved" | "rejected";
  declare score?: number;
  declare feedback?: string;
  declare reviewed_by?: number;
  declare submitted_at?: Date;
  declare reviewed_at?: Date;
  declare created_at?: Date;
  declare updated_at?: Date;
}AssignmentSubmission.init(
  {
    submission_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // ... sisa definisi init() tetap sama
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    material_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enrollment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    submission_type: {
      type: DataTypes.ENUM("file", "url", "text"),
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    submission_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    submission_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attempt_number: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.ENUM("pending", "submitted", "under_review", "approved", "rejected"),
      defaultValue: "submitted",
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reviewed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    submitted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    reviewed_at: {
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
  },
  {
    sequelize,
    modelName: "AssignmentSubmission",
    tableName: "assignment_submissions",
    timestamps: false,
  }
);

export default AssignmentSubmission;