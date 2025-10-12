// src\models\StudentQuizAnswer.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/database";

interface StudentQuizAnswerInterface {
  answer_id: number;
  user_id: number;
  quiz_id: number;
  course_id: number;
  question_id?: number;
  selected_option_id?: number;
  answer_text?: string;
  is_correct?: boolean;
  attempt_session?: number;
  score?: number;
  status?: string;
  answered_at?: Date;
  completed_at?: Date;
}

export interface StudentQuizAnswerCreationAttributes
  extends Optional<StudentQuizAnswerInterface, "answer_id" | "answered_at"> {}

class StudentQuizAnswer
  extends Model<StudentQuizAnswerInterface, StudentQuizAnswerCreationAttributes>
  implements StudentQuizAnswerInterface
{
  declare answer_id: number;
  declare user_id: number;
  declare quiz_id: number;
  declare course_id: number;
  declare question_id?: number;
  declare selected_option_id?: number;
  declare answer_text?: string;
  declare is_correct?: boolean;
  declare attempt_session?: number;
  declare score?: number;
  declare status?: string;
  declare answered_at?: Date;
  declare completed_at?: Date;

  // Relasi
  declare readonly QuizQuestion?: any;
  declare readonly QuizAnswerOption?: any;
}

StudentQuizAnswer.init(
  {
    answer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "user_id" },
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "quizzes", key: "quiz_id" },
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "courses", key: "course_id" },
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "quiz_questions",
        key: "question_id",
      },
    },
    selected_option_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "For multiple choice questions",
      references: {
        model: "quiz_answer_options",
        key: "option_id",
      },
    },
    answer_text: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "For essay or fill-in-blank questions",
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    attempt_session: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Session number for multiple attempts",
    },
    score: {
      // type: DataTypes.INTEGER,
      type: DataTypes.DECIMAL(5, 2), // Menggunakan DECIMAL agar lebih presisi
      allowNull: true,
      comment: "Points earned for this answer",
    },
    status: {
      type: DataTypes.STRING(12),
      allowNull: true,
      validate: {
        isIn: [["answered", "submitted", "graded", "pending"]],
      },
    },
    answered_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "StudentQuizAnswer",
    tableName: "student_quiz_answers",
    timestamps: false,
  }
);

export default StudentQuizAnswer;
