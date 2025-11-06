import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toEmail, toName, gymName, email, password, tenantId } = body;

    if (!toEmail || !toName || !gymName || !email || !password || !tenantId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Meta Gym <onboarding@brandondev.me>',
      to: [toEmail],
      subject: 'Request Approved - Access Credentials',
      html: `
        <div style="background-color: #0e0e10; color: #fefefe; padding: 40px; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #fe6b24; margin: 0 0 10px 0; font-size: 28px;">Request Approved!</h1>
              <p style="color: #a3a3a3; margin: 0; font-size: 16px;">${gymName}</p>
            </div>
            
            <div style="background: #1a1a1d; border: 1px solid #262626; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <p style="color: #d4d4d4; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                Hello <strong style="color: #fe6b24;">${toName}</strong>,
              </p>
              <p style="color: #a3a3a3; font-size: 14px; margin: 0; line-height: 1.6;">
                We are pleased to inform you that your request to register the gym <strong style="color: #d4d4d4;">${gymName}</strong> has been <strong style="color: #fe6b24;">successfully approved</strong>.
              </p>
            </div>

            <div style="background: rgba(254, 107, 36, 0.1); border: 1px solid rgba(254, 107, 36, 0.3); border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #fe6b24; margin: 0 0 15px 0; font-size: 18px; text-align: center;">
                Your access credentials
              </h3>
              <div style="background: #1a1a1d; border: 1px solid #262626; border-radius: 8px; padding: 15px; margin-bottom: 12px;">
                <div style="color: #a3a3a3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Email</div>
                <div style="color: #fe6b24; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold;">${email}</div>
              </div>
              <div style="background: #1a1a1d; border: 1px solid #262626; border-radius: 8px; padding: 15px; margin-bottom: 12px;">
                <div style="color: #a3a3a3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Password</div>
                <div style="color: #fe6b24; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold;">${password}</div>
              </div>
            </div>

            <div style="background: linear-gradient(135deg, #1a1a1d 0%, #141414 100%); border: 2px solid #fe6b24; border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 25px;">
              <h4 style="color: #fefefe; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
                Access the administration panel
              </h4>
              <a href="https://admin.metagym.com" style="display: inline-block; background: linear-gradient(135deg, #e04a36, #fe6b24); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Sign In
              </a>
            </div>

            <div style="background: #141414; border: 1px solid rgba(254, 107, 36, 0.3); border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <p style="color: #fe6b24; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">
                Important - Security
              </p>
              <p style="color: #a3a3a3; margin: 0; font-size: 13px; line-height: 1.6;">
                For your security, we recommend changing your password on your first login. Keep these credentials in a safe place and do not share them with anyone.
              </p>
            </div>

            <div style="background: #141414; border: 1px solid #262626; border-radius: 8px; padding: 20px; text-align: center;">
              <p style="color: #d4d4d4; margin: 0 0 10px 0; font-size: 14px;">
                Have questions?
              </p>
              <p style="color: #a3a3a3; margin: 0; font-size: 13px; line-height: 1.6;">
                You can reply directly to this email or contact us.<br/>
                <strong style="color: #fe6b24;">We're here to help</strong>
              </p>
            </div>

            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #262626; text-align: center;">
              <p style="color: #6c757d; font-size: 12px; margin: 0 0 5px 0;">
                This is an automated email, please do not reply to this message.
              </p>
              <p style="color: #6c757d; font-size: 12px; margin: 0;">
                Meta Gym - Gym Management System
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    console.log('✅ Email sent successfully to:', toEmail, 'ID:', data?.id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
