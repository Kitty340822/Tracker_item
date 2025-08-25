// "use client"
// import React from "react";
// import { NextPage } from 'next';
// import  LoginForm  from '@/components/login/login_from';

// const LoginPage: NextPage = () => {
//     return (
//         <div>
//             <LoginForm />
//         </div>
//     );
// };

// export default LoginPage;

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="p-6 shadow rounded bg-white">
        <h1 className="text-xl mb-4">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Login
        </button>
      </form>
    </div>
  );
}
