// components/shared/Footer.tsx
export function Footer() {
    return (
      <footer className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} GlucoseTracker. All rights reserved.
          </p>
          {/* Anda bisa menambahkan link lain di sini */}
        </div>
      </footer>
    );
  }