"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import styles from "./tootmine.module.css";

export default function TootminePage() {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [volume, setVolume] = useState("");
  const [entries, setEntries] = useState([]);
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("production_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(50)
      .then(({ data }) => setEntries(data || []));
  }, [user?.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaved(null);
    const v = parseFloat(volume);
    if (isNaN(v) || v <= 0) {
      setSaved("Viga: sisesta kehtiv m³.");
      return;
    }
    const { error } = await supabase.from("production_logs").insert({
      user_id: user.id,
      date,
      volume_m3: v,
    });
    if (error) {
      setSaved("Viga: " + error.message);
      return;
    }
    setSaved("Tootmine salvestatud.");
    setVolume("");
    const { data } = await supabase
      .from("production_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(50);
    setEntries(data || []);
  }

  return (
    <div className={styles.page}>
      <h1>Hakkepuidu tootmine (m³)</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Kuupäev</label>
        <input type="date" className={styles.input} value={date} onChange={(e) => setDate(e.target.value)} required />
        <label>Tootmine (m³)</label>
        <input type="number" step="0.1" min="0" className={styles.input} value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="nt. 12.5" required />
        <button type="submit" className={styles.btn}>Salvesta</button>
      </form>
      {saved && <p className={saved.startsWith("Viga") ? styles.err : styles.ok}>{saved}</p>}
      <h2>Viimased kirjed</h2>
      <ul className={styles.list}>
        {entries.map((e) => (
          <li key={e.id}>{e.date} — {e.volume_m3} m³</li>
        ))}
      </ul>
    </div>
  );
}
