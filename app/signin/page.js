"use client";
import { supabase } from "../../supabaseClient";

export default function SignIn() {
  async function handleSignIn(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Signed in!");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100">
      <form
        onSubmit={handleSignIn}
        className="bg-white/80 rounded-lg shadow-md p-8 flex flex-col gap-4 w-full max-w-xs border border-blue-200"
      >
        <h2 className="text-2xl font-semibold text-blue-700 mb-2 text-center">
          Sign In
        </h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
