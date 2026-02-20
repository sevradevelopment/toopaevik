"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import styles from "./vedu.module.css";

export default function VeduPage() {
  const { user } = useAuth();
  const [plateId, setPlateId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [plates, setPlates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [entries, setEntries] = useState([]);
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    supabase.from("license_plates").select("id, plate").order("plate").then(({ data }) => setPlates(data || []));
    supabase.from("locations").select("id, name").order("name").then(({ data }) => setLocations(data || []));
  }, []);
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("transport_logs")
      .select("*, license_plates(plate), locations(name)")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(50)
      .then(({ data }) => setEntries(data || []));
  }, [user?.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaved(null);
    const { error } = await supabase.from("transport_logs").insert({
      user_id: user.id,
      plate_id: plateId || null,
      location_id: locationId || null,
      date,
      description,
      amount: amount ? parseFloat(amount) : null,
    });
    if (error) {
      setSaved("Viga: " + error.message);
      return;
    }
    setSaved("Vedu salvestatud.");
    setDescription("");
    setAmount("");
    if (user?.id) {
      const { data } = await supabase
        .from("transport_logs")
        .select("*, license_plates(plate), locations(name)")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(50);
      setEntries(data || []);
    }
  }

  return (
    <div className={styles.page}>
      <h1>Vedu – mida ja palju vedas</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Kuupäev</label>
        <input type="date" className={styles.input} value={date} onChange={(e) => setDate(e.target.value)} required />
        <label>Numbrimärk</label>
        <select className={styles.input} value={plateId} onChange={(e) => setPlateId(e.target.value)}>
          <option value="">— vali —</option>
          {plates.map((p) => (
            <option key={p.id} value={p.id}>{p.plate}</option>
          ))}
        </select>
        <label>Asukoht</label>
        <select className={styles.input} value={locationId} onChange={(e) => setLocationId(e.target.value)}>
          <option value="">— vali —</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        <label>Mida vedas (kirjeldus)</label>
        <input type="text" className={styles.input} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="nt. hakkepuit" />
        <label>Kogus (ühik vajadusel)</label>
        <input type="text" className={styles.input} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="nt. 15 m³" />
        <button type="submit" className={styles.btn}>Salvesta</button>
      </form>
      {saved && <p className={saved.startsWith("Viga") ? styles.err : styles.ok}>{saved}</p>}
      <h2>Viimased kirjed</h2>
      <ul className={styles.list}>
        {entries.map((e) => (
          <li key={e.id}>
            {e.date} — {e.license_plates?.plate || "—"} | {e.locations?.name || "—"} | {e.description || "—"} {e.amount ? `(${e.amount})` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
