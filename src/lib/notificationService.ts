// src\lib\notificationService.ts
import { Notification, User, Course, Payment, Enrollment } from "@/models";
import EmailService from "./email";

class NotificationService {
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    this.emailService = emailService;
  }

  // Buat notifikasi database
  async createNotification(
    userId: number,
    title: string,
    message: string,
    type: "info" | "success" | "warning" | "error" | "system" = "info"
  ) {
    try {
      await Notification.create({
        user_id: userId,
        notification_title: title,
        notification_message: message,
        notification_type: type,
        is_read: false,
      });
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  }

  // Handle pembayaran berhasil
  async handlePaymentSuccess(paymentId: number) {
    try {
      // Ambil data lengkap
      const payment = await Payment.findByPk(paymentId, {
        include: [
          {
            model: User,
            attributes: ["user_id", "first_name", "last_name", "email"],
          },
          {
            model: Course,
            attributes: ["course_id", "course_title", "user_id"],
            include: [
              {
                model: User,
                as: "lecturer",
                attributes: ["first_name", "last_name"],
              },
            ],
          },
        ],
      });

      if (!payment) {
        throw new Error("Payment not found");
      }

      const user = payment.User;
      const course = payment.Course;

      if (!user || !course) {
        throw new Error("User or Course not found");
      }

      // Buat notifikasi in-app
      await this.createNotification(
        user.user_id,
        "🎉 Pembayaran Berhasil!",
        `Selamat! Pembayaran untuk kursus "${course.course_title}" telah berhasil. Anda sekarang dapat mengakses seluruh materi kursus.`,
        "success"
      );

      // Kirim email
      const emailData = {
        userName: `${user.first_name} ${user.last_name}`.trim(),
        userEmail: user.email,
        courseTitle: course.course_title,
        instructorName: course.User
          ? `${course.User.first_name} ${course.User.last_name}`.trim()
          : undefined,
        amount: payment.amount || 0,
        paymentDate: payment.paid_at || new Date(),
        enrollmentId: payment.enrollment_id || 0,
        courseId: course.course_id,
      };

      const emailSent = await this.emailService.sendPaymentSuccessEmail(
        emailData
      );

      // Update status email_sent di payment
      await payment.update({ email_sent: emailSent });

      console.log(
        `Notification sent for payment ${paymentId}, email sent: ${emailSent}`
      );
      return { success: true, emailSent };
    } catch (error) {
      console.error("Error handling payment success notification:", error);
      return { success: false, error };
    }
  }
}

export default NotificationService;
