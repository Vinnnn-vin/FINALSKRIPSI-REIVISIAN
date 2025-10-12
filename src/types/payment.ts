// src\types\payment.ts
// ================================
import { Course, Enrollment, User } from "@/types";
import { BaseEntity, PaymentStatus } from "./shared";

export interface Payment extends BaseEntity {
  payment_id: number;
  user_id: number;
  course_id: number;
  enrollment_id?: number;
  amount: number;
  status: PaymentStatus;
  gateway_invoice_id?: string;
  gateway_external_id?: string;
  payment_method: string;
  paid_at?: Date;
  email_sent?: boolean;
  
  // Relational fields
  user?: User;
  course?: Course;
  enrollment?: Enrollment;
}

export interface PaymentCreationData {
  user_id: number;
  course_id: number;
  amount: number;
  payment_method: string;
  gateway_external_id?: string;
}

// Transaction history for users
export interface TransactionHistory {
  transaction_id: number;
  payment_id: number;
  user_id: number;
  course_id: number;
  course_title: string;
  amount: number;
  status: PaymentStatus;
  payment_method: string;
  transaction_date: Date;
  invoice_url?: string;
}