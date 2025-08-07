"use client";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useState } from "react";

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="flex min-h-screen items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
              Admin Panel Login
            </h2>
          </div>
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginForm setIsLoading={setIsLoading} />
          </div>
        </div>
      </div>
    </>
  );
}
