// src\models\Certificate.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/database';

interface CertificateInterface {
  certificate_id: number;
  user_id?: number; 
  course_id?: number; 
  enrollment_id?: number; 
  certificate_url?: string;
  certificate_number?: string;
  issued_at?: Date;
  created_at?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CertificateCreationAttributes extends Optional<CertificateInterface, 'certificate_id' | 'created_at' | 'issued_at'> {}

class Certificate extends Model<CertificateInterface, CertificateCreationAttributes> implements CertificateInterface {
  certificate_id!: number;
  user_id?: number;
  course_id?: number;
  enrollment_id?: number;
  certificate_url?: string;
  certificate_number?: string;
  issued_at?: Date;
  created_at?: Date;

  // Relasi
  declare readonly User?: any;
  declare readonly Course?: any;
  declare readonly Enrollment?: any;
}

Certificate.init(
  {
    certificate_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'courses',
        key: 'course_id',
      },
    },
    enrollment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'enrollments',
        key: 'enrollment_id',
      },
    },
    certificate_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'URL to the certificate file/image',
    },
    certificate_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      comment: 'Unique certificate identifier',
    },
    issued_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date when certificate was issued',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Certificate',
    tableName: 'certificates',
    timestamps: false,
  }
);

export default Certificate;