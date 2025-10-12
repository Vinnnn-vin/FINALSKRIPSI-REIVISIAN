// src\models\QuizAnswerOption.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface QuizAnswerOptionInterface {
  option_id: number;
  quiz_id?: number;
  question_id?: number; // Added question_id as it's used in associations
  option_text?: string;
  is_correct?: boolean;
}

interface QuizAnswerOptionCreationAttributes extends Optional<QuizAnswerOptionInterface, 'option_id'> {}

class QuizAnswerOption extends Model<QuizAnswerOptionInterface, QuizAnswerOptionCreationAttributes> implements QuizAnswerOptionInterface {
  declare option_id: number;
  declare quiz_id?: number;
  declare question_id?: number;
  declare option_text?: string;
  declare is_correct?: boolean;

  // Relasi
  declare readonly Quiz?: any;
  declare readonly QuizQuestion?: any;
  declare readonly StudentQuizAnswers?: any;
}

QuizAnswerOption.init(
  {
    option_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'quizzes',
        key: 'quiz_id',
      },
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Foreign key to quiz_questions table',
      references: {
        model: 'quiz_questions',
        key: 'question_id',
      },
    },
    option_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'QuizAnswerOption',
    tableName: 'quiz_answer_options',
    timestamps: false,
  }
);

export default QuizAnswerOption;