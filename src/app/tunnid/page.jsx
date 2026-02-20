"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import styles from "./tunnid.module.css";

export default function TunnidPage() {
  const { user, profile } = useAuth();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [entries, setEntries] = useState([]);
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    load();
  }, [user?.id]);

  async function load() {
    if (!user?.id) return;
    const { data } = await supabase
      .from("work_hours")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(50);
    setEntries(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaved(null);
    const { error } = await supabase.from("work_hours").insert({
      user_id: user.id,
      date,
      start_time: startTime,
      end_time: endTime,
    });
    if (error) {
      setSaved("Viga: " + error.message);
      return;
    }
    setSaved("Töötunnid salvestatud.");
    setStartTime("");
    setEndTime("");
    load();
  }

  return (
    <div className={styles.page}>
      <h1>Töötunnid</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Kuupäev</label>
        <input
          type="date"
          className={styles.input}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <label>Alustamise kell</label>
        <input
          type="time"
          className={styles.input}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <label>Lõpetamise kell</label>
        <input
          type="time"
          className={styles.input}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <button type="submit" className={styles.btn}>Salvesta</button>
      </form>
      {saved && <p className={saved.startsWith("Viga") ? styles.err : styles.ok}>{saved}</p>}
      <h2>Viimased kirjed</h2>
      <ul className={styles.list}>
        {entries.map((e) => (
          <li key={e.id}>
            {e.date} — {e.start_time} – {e.end_time}
          </li>
        ))}
      </ul>
    </div>
  );
}
