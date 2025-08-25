"use client";
import React, { useState } from "react";

const TestPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/employees", { cache: "no-store" }); // ❗ no-store เพื่อบังคับ refetch ทุกครั้ง
      if (!res.ok) throw new Error("Failed to fetch employees");

      const result = await res.json();
      if (result.success) {
        setData(result.data);
        console.log("Fetched data:", result.data);
      } else {
        setError(result.error || "Failed to fetch");
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Page</h1>
      <button
        onClick={handleFetch}
        style={{ padding: "8px 16px", marginBottom: "10px" }}
      >
        Refetch Employees
      </button>

      <div>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {data && (
          <ul>
            {data.map((emp: any) => (
              <li key={emp.id}>
                {emp.displayName} ({emp.username})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TestPage;
