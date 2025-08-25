// "use client";
// import React, { useState } from "react";
import { getEmployeeList } from "@/lib/actions/api-employee.action";

const TestPage = () => {
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    // setLoading(true);
    // setError(null);
    try {
      const result = await getEmployeeList(); // เรียกตรงจาก server action
      if (result.success) {
        // setData(result.data);
        console.log("Fetched data:", result.data);
      } else {
        console.error
        // setError(result.error || "Failed to fetch");

      }
    } catch (err: any) {
    //   setError(err.message);
        console.error("Fetch error:", err);
    }
    // setLoading(false);


  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Page</h1>
      {/* <button
        onClick={handleFetch}
        style={{ padding: "8px 16px", marginBottom: "10px" }}
      >
        Fetch Data
      </button> */}

      <div>
        {/* {loading && <label>Loading...</label>}
        {error && <label style={{ color: "red" }}>{error}</label>}
        {data && <label>Data: {JSON.stringify(data)}</label>} */}
      </div>
    </div>
  );
};

export default TestPage;
