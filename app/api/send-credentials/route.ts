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
      subject: 'Solicitud Aprobada - Credenciales de Acceso',
      html: `
        <div style="background-color: #0e0e10; color: #fefefe; padding: 40px; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #fe6b24; margin: 0 0 10px 0; font-size: 28px;">¡Solicitud Aprobada!</h1>
              <p style="color: #a3a3a3; margin: 0; font-size: 16px;">${gymName}</p>
            </div>
            
            <div style="background: #1a1a1d; border: 1px solid #262626; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <p style="color: #d4d4d4; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                Hola <strong style="color: #fe6b24;">${toName}</strong>,
              </p>
              <p style="color: #a3a3a3; font-size: 14px; margin: 0; line-height: 1.6;">
                Nos complace informarte que tu solicitud para registrar el gimnasio <strong style="color: #d4d4d4;">${gymName}</strong> ha sido <strong style="color: #fe6b24;">aprobada exitosamente</strong>.
              </p>
            </div>

            <div style="background: rgba(254, 107, 36, 0.1); border: 1px solid rgba(254, 107, 36, 0.3); border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #fe6b24; margin: 0 0 15px 0; font-size: 18px; text-align: center;">
                Tus credenciales de acceso
              </h3>
              <div style="background: #1a1a1d; border: 1px solid #262626; border-radius: 8px; padding: 15px; margin-bottom: 12px;">
                <div style="color: #a3a3a3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Correo Electrónico</div>
                <div style="color: #fe6b24; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold;">${email}</div>
              </div>
              <div style="background: #1a1a1d; border: 1px solid #262626; border-radius: 8px; padding: 15px; margin-bottom: 12px;">
                <div style="color: #a3a3a3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Contraseña</div>
                <div style="color: #fe6b24; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold;">${password}</div>
              </div>
            </div>

            <div style="background: linear-gradient(135deg, #1a1a1d 0%, #141414 100%); border: 2px solid #fe6b24; border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 25px;">
              <h4 style="color: #fefefe; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
                Accede al panel de administración
              </h4>
              <a href="https://admin.metagym.com" style="display: inline-block; background: linear-gradient(135deg, #e04a36, #fe6b24); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Iniciar Sesión
              </a>
            </div>

            <div style="background: #141414; border: 1px solid rgba(254, 107, 36, 0.3); border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <p style="color: #fe6b24; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">
                Importante - Seguridad
              </p>
              <p style="color: #a3a3a3; margin: 0; font-size: 13px; line-height: 1.6;">
                Por tu seguridad, te recomendamos cambiar tu contraseña en tu primer inicio de sesión. Guarda estas credenciales en un lugar seguro y no las compartas con nadie.
              </p>
            </div>

            <div style="background: #141414; border: 1px solid #262626; border-radius: 8px; padding: 20px; text-align: center;">
              <p style="color: #d4d4d4; margin: 0 0 10px 0; font-size: 14px;">
                ¿Tienes preguntas?
              </p>
              <p style="color: #a3a3a3; margin: 0; font-size: 13px; line-height: 1.6;">
                Puedes responder directamente a este email o contactarnos.<br/>
                <strong style="color: #fe6b24;">Estamos aquí para ayudarte</strong>
              </p>
            </div>

            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #262626; text-align: center;">
              <p style="color: #6c757d; font-size: 12px; margin: 0 0 5px 0;">
                Este es un correo automático, por favor no respondas a este mensaje.
              </p>
              <p style="color: #6c757d; font-size: 12px; margin: 0;">
                Meta Gym - Sistema de Gestión de Gimnasios
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
