export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100">
      <div className="bg-white/80 rounded-lg shadow-md p-8 flex flex-col items-center gap-4 border border-blue-200">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome</h1>
        <div className="flex gap-4">
          <a
            href="/signin"
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  );
}
