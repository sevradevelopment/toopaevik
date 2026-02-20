"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message || "Sisselogimine ebaõnnestus");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>Tööpäevik</h1>
        <p className={styles.subtitle}>Hakkepuiduvedu – logi sisse</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>E-post</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nimi@firma.ee"
            required
          />
          <label className={styles.label}>Parool</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Login sisse…" : "Sisselogimine"}
          </button>
        </form>
      </div>
    </div>
  );
}
