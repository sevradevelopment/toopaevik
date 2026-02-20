"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import styles from "./tankimine.module.css";

export default function TankiminePage() {
  const { user } = useAuth();
  const [plateId, setPlateId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [liters, setLiters] = useState("");
  const [plates, setPlates] = useState([]);
  const [entries, setEntries] = useState([]);
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    supabase.from("license_plates").select("id, plate").order("plate").then(({ data }) => setPlates(data || []));
  }, []);
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("refuel_logs")
      .select("*, license_plates(plate)")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(50)
      .then(({ data }) => setEntries(data || []));
  }, [user?.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaved(null);
    const l = parseFloat(liters);
    if (!plateId || isNaN(l) || l <= 0) {
      setSaved("Viga: vali numbrimärk ja sisesta liitrid.");
      return;
    }
    const { error } = await supabase.from("refuel_logs").insert({
      user_id: user.id,
      plate_id: plateId,
      date,
      liters: l,
    });
    if (error) {
      setSaved("Viga: " + error.message);
      return;
    }
    setSaved("Tankimine salvestatud.");
    setLiters("");
    const { data } = await supabase
      .from("refuel_logs")
      .select("*, license_plates(plate)")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(50);
    setEntries(data || []);
  }

  return (
    <div className={styles.page}>
      <h1>Tankimine</h1>
      <p className={styles.hint}>Numbrimärgid (sh vedukid ja hakkuri 0371TH) – vali auto.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Kuupäev</label>
        <input type="date" className={styles.input} value={date} onChange={(e) => setDate(e.target.value)} required />
        <label>Numbrimärk</label>
        <select className={styles.input} value={plateId} onChange={(e) => setPlateId(e.target.value)} required>
          <option value="">— vali —</option>
          {plates.map((p) => (
            <option key={p.id} value={p.id}>{p.plate}</option>
          ))}
        </select>
        <label>Liitrid</label>
        <input type="number" step="0.1" min="0" className={styles.input} value={liters} onChange={(e) => setLiters(e.target.value)} placeholder="nt. 45" required />
        <button type="submit" className={styles.btn}>Salvesta</button>
      </form>
      {saved && <p className={saved.startsWith("Viga") ? styles.err : styles.ok}>{saved}</p>}
      <h2>Viimased tankimised</h2>
      <ul className={styles.list}>
        {entries.map((e) => (
          <li key={e.id}>{e.date} — {e.license_plates?.plate || "—"} — {e.liters} L</li>
        ))}
      </ul>
    </div>
  );
}
