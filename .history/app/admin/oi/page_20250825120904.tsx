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
      const res = await fetch("/api/employees");
      if (!res.ok) throw new Error("Failed to fetch employees");

      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        
        setError(result.error || "No data found");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Page</h1>
      <button onClick={handleFetch} style={{ padding: "8px 16px", marginBottom: "10px" }}>
        Fetch Data
      </button>

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
  );
};

export default TestPage;
