// components/emails/ResetPasswordEmail.tsx

import Image from "next/image";
import * as React from "react";

interface ResetPasswordEmailProps {
  resetLink: string;
}

// Gunakan URL publik untuk semua gambar
const logoImageUrl = `https://risebar.id/logo_png.png`;
// ✅ Perbaikan: Arahkan ke gambar PNG transparan yang baru
const mascotImageUrl = `https://risebar.id/mascot_menyapa_png.png`;

export const ResetPasswordEmail: React.FC<
  Readonly<ResetPasswordEmailProps>
> = ({ resetLink }) => (
  // ✅ Perbaikan: Tambahkan warna latar abu-abu muda pada email
  <div
    style={{
      fontFamily: "Arial, sans-serif",
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
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Bagian Header dengan warna tema */}
      <div
        style={{
          backgroundColor: "#f0fdfa",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Image
          src={logoImageUrl}
          alt="Rise Bar Logo"
          width="120"
          style={{ width: "120px", height: "auto" }}
        />
      </div>

      <div style={{ padding: "40px" }}>
        {/* Gambar Maskot */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <Image
            src={mascotImageUrl}
            alt="Rise Bar Mascot"
            width="100"
            height="100"
            style={{ width: "100px", height: "auto" }}
          />
        </div>

        {/* Konten Email Lainnya */}
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
        <p
          style={{
            fontSize: "16px",
            color: "#374151",
            lineHeight: "1.5",
            textAlign: "center",
          }}
        >
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
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            lineHeight: "1.5",
            textAlign: "center",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "20px",
          }}
        >
          Link ini akan kedaluwarsa dalam 1 jam. Jika Anda tidak merasa meminta
          reset password, silakan abaikan email ini.
        </p>
      </div>
    </div>
  </div>
);
