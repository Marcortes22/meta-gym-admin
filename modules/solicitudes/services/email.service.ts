export interface SendCredentialsEmailInput {
  toEmail: string;
  toName: string;
  gymName: string;
  email: string;
  password: string;
  tenantId: string;
}

export async function sendCredentialsEmail(input: SendCredentialsEmailInput): Promise<void> {
  try {
    console.log('📧 Iniciando envío de correo a:', input.toEmail);
    
    const response = await fetch('/api/send-credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    console.log('📬 Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error en respuesta:', errorData);
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('📨 Datos de respuesta:', data);
    
    if (!data.success) {
      throw new Error('Email sending failed');
    }

    console.log('✅ Correo enviado exitosamente a:', input.toEmail);
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
  }
}
