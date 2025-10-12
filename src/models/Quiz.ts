// src\models\Quiz.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface QuizInterface {
  [x: string]: any;
  quiz_id: number;
  material_id?: number;
  course_id?: number;
  quiz_title?: string;
  quiz_description?: string;
  passing_score?: number;
  time_limit?: number;
  max_attempts?: number;
  created_at?: Date;
  deleted_at?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface QuizCreationAttributes extends Optional<QuizInterface, 'quiz_id' | 'created_at' | 'deleted_at'> {}

class Quiz extends Model<QuizInterface, QuizCreationAttributes> implements QuizInterface {
  declare quiz_id: number;
  declare material_id?: number;
  declare course_id?: number;
  declare quiz_title?: string;
  declare quiz_description?: string;
  declare passing_score?: number;
  declare time_limit?: number;
  declare max_attempts?: number;
  declare created_at?: Date;
  declare deleted_at?: Date;
}

Quiz.init(
  {
    quiz_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    material_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'material', key: 'material_id' }
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'courses', key: 'course_id' }
    },
    quiz_title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    quiz_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    passing_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Minimum score to pass the quiz',
    },
    time_limit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Time limit in minutes',
    },
    max_attempts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Maximum number of attempts allowed',
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
    modelName: 'Quiz',
    tableName: 'quizzes',
    timestamps: false,
  }
);

// // Relasi
// Quiz.belongsTo(Material, {
//   foreignKey: 'material_id',
//   as: 'material'
// });

// Quiz.belongsTo(Course, {
//   foreignKey: 'course_id',
//   as: 'course'
// });

// Quiz.hasMany(QuizQuestion, {
//   foreignKey: 'quiz_id',
//   as: 'questions'
// });

// Quiz.hasMany(QuizAnswerOption, {
//   foreignKey: 'quiz_id',
//   as: 'answerOptions'
// });

export default Quiz;