export interface SendCredentialsEmailInput {
  toEmail: string;
  toName: string;
  gymName: string;
  email: string;
  password: string;
  tenantId: string;
  gymCode: string;
}

export async function sendCredentialsEmail(input: SendCredentialsEmailInput): Promise<void> {
  try {
    const response = await fetch('/api/send-credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Email sending failed');
    }
  } catch (error) {
    throw error;
  }
}
