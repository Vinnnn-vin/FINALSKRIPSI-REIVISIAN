// src\models\Payment.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/database";

interface PaymentInterface {
  payment_id: number;
  user_id?: number;
  course_id?: number;
  enrollment_id?: number;
  amount?: number;
  status?: string;
  gateway_invoice_id?: string;
  gateway_external_id?: string;
  payment_method?: string;
  paid_at?: Date;
  created_at?: Date;
  deleted_at?: Date;
  updated_at?: Date;
  email_sent?: boolean;
}

interface PaymentCreationAttributes
  extends Optional<PaymentInterface, "payment_id" | "created_at" | "updated_at" | "deleted_at"> {}

class Payment
  extends Model<PaymentInterface, PaymentCreationAttributes>
  implements PaymentInterface
{
  declare payment_id: number;
  declare user_id?: number;
  declare course_id?: number;
  declare enrollment_id?: number;
  declare amount?: number;
  declare status?: string;
  declare gateway_invoice_id?: string;
  declare gateway_external_id?: string;
  declare payment_method?: string;
  declare paid_at?: Date;
  declare created_at?: Date;
  declare deleted_at?: Date;
  declare updated_at?: Date;
  declare email_sent?: boolean;

  // Relasi
  declare readonly User?: any;
  declare readonly Course?: any;
  declare readonly Enrollment?: any;
}

Payment.init(
  {
    payment_id: {
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
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        isIn: [["pending", "paid", "failed", "refunded", "cancelled", "success"]],
      },
    },
    gateway_invoice_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    gateway_external_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    payment_method: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    email_sent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "payments",
    timestamps: false,
  }
);

export default Payment;