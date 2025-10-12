// src\models\QuizQuestion.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/database";

interface QuizQuestionInterface {
  question_id: number;
  quiz_id?: number;
  question_text?: string;
  question_type?: string;
  created_at?: Date;
}

interface QuizQuestionCreationAttributes
  extends Optional<QuizQuestionInterface, "question_id" | "created_at"> {}

class QuizQuestion
  extends Model<QuizQuestionInterface, QuizQuestionCreationAttributes>
  implements QuizQuestionInterface
{
  declare question_id: number;
  declare quiz_id?: number;
  declare question_text?: string;
  declare question_type?: string;

  declare created_at?: Date;

  // Relasi
  declare readonly Quiz?: any;
  declare readonly QuizAnswerOptions?: any;
  declare readonly StudentQuizAnswers?: any;
}

QuizQuestion.init(
  {
    question_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "quizzes",
        key: "quiz_id",
      },
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    question_type: {
      type: DataTypes.STRING(15),
      allowNull: true,
      validate: {
        isIn: [
          ["multiple_choice", "checkbox", "true_false", "essay", "fill_blank"],
        ],
      },
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "QuizQuestion",
    tableName: "quiz_questions",
    timestamps: false,
  }
);

export default QuizQuestion;
