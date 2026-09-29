import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, interest } = body;

        // Validation
        if (!name || !email || !phone || !interest) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Configure Transporter (Securely using Env Vars)
        // Note: For production, use environment variables. 
        // We will default to a console warning if not set to prevent crashing in dev without configs.
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or use host/port
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 1. Admin Notification Email
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO || 'info@vedascholars.com',
            cc: 'admissions@vedascholars.com',
            subject: `New Lead – ${interest}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #B8860B;">New Lead: ${interest}</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Inquiry Type:</strong> ${interest}</p>
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">Submitted from Veda Scholars Website on ${new Date().toLocaleString()}</p>
                </div>
            `,
        };

        // 2. User Confirmation Email
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Thank for connecting with Veda Scholars`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #0F172A;">Thank you for contacting Veda Scholars!</h2>
                    <p>Dear ${name},</p>
                    <p>We have received your inquiry regarding <strong>${interest}</strong>.</p>
                    <p>Our team is reviewing your request and will get back to you within 24 hours.</p>
                    <br/>
                    <p>Best Regards,</p>
                    <p><strong>Veda Scholars Team</strong></p>
                    <p style="color: #B8860B;">vedascholars.com</p>
                </div>
            `,
        };

        // Send Emails (Only if env vars are present to avoid errors in dev without setup)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await Promise.all([
                transporter.sendMail(adminMailOptions),
                transporter.sendMail(userMailOptions)
            ]);
            return NextResponse.json({ success: true, message: 'Emails sent successfully' });
        } else {
            console.warn('EMAIL_USER or EMAIL_PASS not set. Emails were simulated.');
            // In dev without creds, we simulate success
            return NextResponse.json({ success: true, message: 'Simulated success (no credentials)' });
        }

    } catch (error) {
        console.error('Email Error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
