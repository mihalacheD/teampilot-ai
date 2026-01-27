export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}