// components/emails/ResetPasswordEmail.tsx

import * as React from "react";

interface ResetPasswordEmailProps {
  resetLink: string;
}

// URL lengkap ke gambar maskot Anda
const mascotImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://risebar.id"}/mascot_menyapa.webp`;

export const ResetPasswordEmail: React.FC<
  Readonly<ResetPasswordEmailProps>
> = ({ resetLink }) => (
  <div
    style={{
      fontFamily: "sans-serif",
      padding: "20px",
      backgroundColor: "#f9fafb",
    }}
  >
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "40px",
      }}
    >
      {/* 1. Gambar Maskot Ditambahkan di Sini */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img
          src={mascotImageUrl}
          alt="Rise Bar Mascot"
          width="100"
          height="100"
          style={{ width: "100px", height: "auto" }}
        />
      </div>

      {/* 2. Konten Email Lainnya */}
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#111827",
          textAlign: "center",
        }}
      >
        Reset Password Rise Bar Anda
      </h1>
      <p style={{ fontSize: "16px", color: "#374151", lineHeight: "1.5" }}>
        Kami menerima permintaan untuk mereset password akun Anda. Klik tombol
        di bawah ini untuk melanjutkan.
      </p>
      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <a
          href={resetLink}
          target="_blank"
          style={{
            backgroundColor: "#115e59", // Warna tema Anda
            color: "white",
            padding: "14px 24px",
            textDecoration: "none",
            borderRadius: "8px",
            display: "inline-block",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          Reset Password
        </a>
      </div>
      <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
        Link ini akan kedaluwarsa dalam 1 jam. Jika Anda tidak merasa meminta
        reset password, silakan abaikan email ini.
      </p>
    </div>
  </div>
);
