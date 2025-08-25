"use client";
import React, { useState } from "react";

const SignupListPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/signup", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: "1234567890",    // ถ้า API ต้องใช้ header ให้เปิดใช้งาน
          apisecret: "abcd",
        },
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Signup API Data</h1>
      <button onClick={fetchData} style={{ padding: "8px 16px", marginBottom: "10px" }}>
        Fetch Data
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && (
        <pre style={{ background: "#f4f4f4", padding: 10, borderRadius: 8 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default SignupListPage;
