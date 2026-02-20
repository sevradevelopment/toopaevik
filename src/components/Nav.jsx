"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import styles from "./Nav.module.css";

export default function Nav() {
  const pathname = usePathname();
  const { user, profile } = useAuth();

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (!user) return null;

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={pathname === "/" ? styles.active : ""}>
          Avaleht
        </Link>
        <Link href="/tunnid" className={pathname === "/tunnid" ? styles.active : ""}>
          Töötunnid
        </Link>
        <Link href="/vedu" className={pathname === "/vedu" ? styles.active : ""}>
          Vedu
        </Link>
        {(profile?.role === "Hakkur" || profile?.role === "Admin") && (
          <Link href="/tootmine" className={pathname === "/tootmine" ? styles.active : ""}>
            Tootmine
          </Link>
        )}
        <Link href="/tankimine" className={pathname === "/tankimine" ? styles.active : ""}>
          Tankimine
        </Link>
        <Link href="/logid" className={pathname === "/logid" ? styles.active : ""}>
          Logid
        </Link>
        {profile?.role === "Admin" && (
          <>
            <Link href="/statistika" className={pathname === "/statistika" ? styles.active : ""}>
              Statistika
            </Link>
            <Link href="/haldus" className={pathname === "/haldus" ? styles.active : ""}>
              Haldus
            </Link>
          </>
        )}
        <span className={styles.user}>
          {profile?.full_name || user.email}
          <span className={`${styles.badge} ${styles[profile?.role?.toLowerCase()] || ""}`}>
            {profile?.role}
          </span>
        </span>
        <button type="button" onClick={logout} className={styles.logout}>
          Välju
        </button>
      </div>
    </nav>
  );
}
