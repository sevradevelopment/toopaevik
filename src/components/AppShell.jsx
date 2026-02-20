"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Nav from "./Nav";

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Laadin…
      </div>
    );
  }

  if (!user && pathname !== "/login") {
    router.replace("/login");
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Suunan sisselogimisele…
      </div>
    );
  }

  if (pathname === "/login") {
    return children;
  }

  return (
    <>
      <Nav />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem" }}>
        {children}
      </main>
    </>
  );
}
