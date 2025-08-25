"use client";
import React, { useEffect, useState } from "react";

const TestPage = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  return (
    <div>
      <h1>Test Page</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TestPage;
