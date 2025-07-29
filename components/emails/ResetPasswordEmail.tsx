// components/emails/ResetPasswordEmail.tsx

import * as React from 'react';

interface ResetPasswordEmailProps {
  resetLink: string;
}

export const ResetPasswordEmail: React.FC<Readonly<ResetPasswordEmailProps>> = ({ resetLink }) => (
  <div>
    <h1>Reset Password Rise Bar Anda</h1>
    <p>
      Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah ini untuk melanjutkan.
    </p>
    <a href={resetLink} target="_blank" style={{
        backgroundColor: '#115e59', // Warna tema Anda
        color: 'white',
        padding: '12px 20px',
        textDecoration: 'none',
        borderRadius: '5px',
        display: 'inline-block',
        marginTop: '10px'
    }}>
      Reset Password
    </a>
    <p>
      Link ini akan kedaluwarsa dalam 1 jam. Jika Anda tidak merasa meminta reset password, silakan abaikan email ini.
    </p>
  </div>
);