/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/database";

interface QuizAttributes {
  quiz_id: number;
  material_id: number | null;
  course_id: number | null;
  quiz_title: string;
  quiz_description?: string;
  passing_score?: number;
  time_limit?: number;
  max_attempts?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface QuizCreationAttributes extends Optional<QuizAttributes, "quiz_id"> {}

class Quiz
  extends Model<QuizAttributes, QuizCreationAttributes>
  implements QuizAttributes
{
  declare quiz_id: number;
  declare material_id: number | null;
  declare course_id: number | null;
  declare quiz_title: string;
  declare quiz_description?: string;
  declare passing_score?: number;
  declare time_limit?: number;
  declare max_attempts?: number;
  declare readonly created_at?: Date;
  declare readonly updated_at?: Date;
}

Quiz.init(
  {
    quiz_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    material_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quiz_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quiz_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    passing_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    time_limit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    max_attempts: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Quiz",
    tableName: "quizzes",
    timestamps: false, // ✅ kalau kolomnya created_at manual, set false
  }
);

export default Quiz;
