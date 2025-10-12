// src\lib\email.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';

interface EmailConfig {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}

interface CourseEmailData {
  userName: string;
  userEmail: string;
  courseTitle: string;
  courseDuration?: string;
  instructorName?: string;
  amount: number;
  paymentDate: Date;
  enrollmentId: number;
  courseId: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Konfigurasi email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true untuk port 465, false untuk port lain
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Template email untuk pembayaran berhasil
  private generatePaymentSuccessTemplate(data: CourseEmailData): string {
    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pembayaran Berhasil</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .content {
                padding: 30px;
            }
            .success-badge {
                background-color: #10b981;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                display: inline-block;
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .course-info {
                background-color: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #667eea;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #e2e8f0;
            }
            .info-row:last-child {
                border-bottom: none;
            }
            .label {
                font-weight: bold;
                color: #374151;
            }
            .value {
                color: #6b7280;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                margin-top: 20px;
            }
            .footer {
                background-color: #f8fafc;
                padding: 20px;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
            }
            .amount {
                font-size: 24px;
                font-weight: bold;
                color: #10b981;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Pembayaran Berhasil!</h1>
                <p>Selamat! Anda telah berhasil mendaftar di kursus baru.</p>
            </div>
            
            <div class="content">
                <div class="success-badge">✅ PEMBAYARAN BERHASIL</div>
                
                <p>Hai <strong>${data.userName}</strong>,</p>
                
                <p>Terima kasih telah melakukan pembayaran. Pembayaran Anda telah dikonfirmasi dan Anda sekarang telah terdaftar di kursus:</p>
                
                <div class="course-info">
                    <h3 style="margin-top: 0; color: #1f2937;">${data.courseTitle}</h3>
                    
                    <div class="info-row">
                        <span class="label">Instruktur:</span>
                        <span class="value">${data.instructorName || 'Tidak tersedia'}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="label">Jumlah Pembayaran:</span>
                        <span class="value amount">Rp ${data.amount.toLocaleString('id-ID')}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="label">Tanggal Pembayaran:</span>
                        <span class="value">${data.paymentDate.toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="label">ID Enrollment:</span>
                        <span class="value">#${data.enrollmentId}</span>
                    </div>
                </div>
                
                <p><strong>Langkah Selanjutnya:</strong></p>
                <ul>
                    <li>Akses kursus Anda melalui dashboard</li>
                    <li>Mulai belajar dengan materi yang tersedia</li>
                    <li>Ikuti quiz dan tugas yang ada</li>
                    <li>Dapatkan sertifikat setelah menyelesaikan kursus</li>
                </ul>
                
                <div style="text-align: center;">
                    <a href="${process.env.NEXTAUTH_URL}/frontend/dashboard/student/course/${data.courseId}" class="button">
                        🚀 Mulai Belajar Sekarang
                    </a>
                </div>
                
                <p style="margin-top: 30px;">Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi tim support kami.</p>
            </div>
            
            <div class="footer">
                <p>© 2024 Platform Learning. Semua hak dilindungi.</p>
                <p>Email ini dikirim otomatis, mohon jangan membalas email ini.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Mengirim email pembayaran berhasil
  async sendPaymentSuccessEmail(data: CourseEmailData): Promise<boolean> {
    try {
      const emailConfig: EmailConfig = {
        to: data.userEmail,
        subject: `🎉 Pembayaran Berhasil - ${data.courseTitle}`,
        html: this.generatePaymentSuccessTemplate(data),
      };

      const info = await this.transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'Platform Learning'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        to: emailConfig.to,
        subject: emailConfig.subject,
        html: emailConfig.html,
      });

      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Test koneksi email
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export default EmailService;