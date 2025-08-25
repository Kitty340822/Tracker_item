"use client";

import { getSignupListv2 } from "@/lib/actions/adduser.action";
import React, { useState } from "react";
// import { getSignupList, ISignup } from "@/lib/services/signup.service";

const SignupListPage = () => {
  const [data, setData] = useState<ISignup[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getSignupListv2();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
