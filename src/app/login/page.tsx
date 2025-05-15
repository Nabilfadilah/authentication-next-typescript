"use client";

import Link from "next/link";
import {useAuth} from "../context/AuthContext";
import {useRouter} from "next/navigation";
import {useState, FormEvent} from "react";
import {LoginData} from "../types/Auth";

export default function LoginPage() {
  const {login} = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<LoginData>({email: "", password: ""}); // state form input
  const [error, setError] = useState<string>(""); // state menampikan error

  // fungsi ketika form login disubmit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // mencegah reload halaman

    try {
      await login(form); // jalankan login dari context
      router.push("/dashboard");
    } catch (err: any) {
      // tampilkan pesan error dari response, jika ada
      setError(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>

        {/* tampil pesan error */}
        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* email */}
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            required
          />

          {/* password */}
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            required
          />

          {/* tautan ke halaman register */}
          <div className="text-sm text-gray-500">
            Kamu belum memiliki akun?,{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              <b>Register</b>
            </Link>
          </div>

          {/* button login */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
