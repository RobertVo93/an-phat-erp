"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { withApiBase } from "@/lib/base-path";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch(withApiBase("/api/docs"))
      .then((res) => res.json())
      .then(setSpec);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>API Documentation</h1>
      {spec ? <SwaggerUI spec={spec} /> : <p>Loading...</p>}
    </div>
  );
} 