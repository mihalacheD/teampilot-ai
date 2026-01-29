export default function TaskLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}
