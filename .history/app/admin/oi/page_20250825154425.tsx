"use client";
import React, { useState } from "react";
import { getSignupList } from "@/lib/actions/adduser.action";

const SignupPage = () => {
  const [data, setData] = useState<any>(null);

  const handleFetch = async () => {
    const result = await getSignupList();
    if (result.success) {
      setData(result.data);
    } else {
      alert("Error: " + result.error);
    }
  };

  c
  return (
    <div style={{ padding: 20 }}>
      <h1>Signup List</h1>
      <button onClick={handleFetch}>Fetch Signups</button>

      {data && (
        <ul>
          {data.map((item: any) => (
            <li key={item.id}>
              {item.name} - {item.email} ({item.role_permission})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SignupPage;
