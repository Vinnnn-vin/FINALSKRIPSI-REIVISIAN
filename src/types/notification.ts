// src\types\notification.ts
import { User } from "@/types";
import { BaseEntity, NotificationType } from "./shared";

export interface Notification extends BaseEntity {
  notification_id: number;
  user_id?: number;
  notification_title?: string;
  notification_message?: string;
  notification_type?: NotificationType;
  is_read?: boolean;
  
  recipient?: User;
}