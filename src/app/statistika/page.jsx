"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import styles from "./statistika.module.css";

export default function StatistikaPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [data, setData] = useState({ hours: [], transports: [], refuels: [], production: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.role !== "Admin") return;
    supabase.from("profiles").select("id, full_name, role").order("full_name").then(({ data: d }) => setUsers(d || []));
  }, [profile?.role]);

  useEffect(() => {
    if (!selectedUserId) {
      setData({ hours: [], transports: [], refuels: [], production: [] });
      return;
    }
    setLoading(true);
    Promise.all([
      supabase.from("work_hours").select("*").eq("user_id", selectedUserId).order("date", { ascending: false }),
      supabase.from("transport_logs").select("*, license_plates(plate), locations(name)").eq("user_id", selectedUserId).order("date", { ascending: false }),
      supabase.from("refuel_logs").select("*, license_plates(plate)").eq("user_id", selectedUserId).order("date", { ascending: false }),
      supabase.from("production_logs").select("*").eq("user_id", selectedUserId).order("date", { ascending: false }),
    ]).then(([h, t, r, p]) => {
      setData({
        hours: h.data || [],
        transports: t.data || [],
        refuels: r.data || [],
        production: p.data || [],
      });
      setLoading(false);
    });
  }, [selectedUserId]);

  function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const userName = users.find((u) => u.id === selectedUserId)?.full_name || selectedUserId || "kõik";

    if (data.hours.length) {
      const ws = XLSX.utils.json_to_sheet(
        data.hours.map((r) => ({ Kuupäev: r.date, "Algus": r.start_time, "Lõpp": r.end_time }))
      );
      XLSX.utils.book_append_sheet(wb, ws, "Töötunnid");
    }
    if (data.transports.length) {
      const ws = XLSX.utils.json_to_sheet(
        data.transports.map((r) => ({
          Kuupäev: r.date,
          Numbrimärk: r.license_plates?.plate,
          Asukoht: r.locations?.name,
          Kirjeldus: r.description,
          Kogus: r.amount,
        }))
      );
      XLSX.utils.book_append_sheet(wb, ws, "Vedu");
    }
    if (data.refuels.length) {
      const ws = XLSX.utils.json_to_sheet(
        data.refuels.map((r) => ({
          Kuupäev: r.date,
          Numbrimärk: r.license_plates?.plate,
          Liitrid: r.liters,
        }))
      );
      XLSX.utils.book_append_sheet(wb, ws, "Tankimine");
    }
    if (data.production.length) {
      const ws = XLSX.utils.json_to_sheet(
        data.production.map((r) => ({ Kuupäev: r.date, "Tootmine m³": r.volume_m3 }))
      );
      XLSX.utils.book_append_sheet(wb, ws, "Tootmine");
    }

    if (wb.SheetNames.length === 0) {
      const ws = XLSX.utils.aoa_to_sheet([["Andmeid valitud töötaja kohta ei ole"]]);
      XLSX.utils.book_append_sheet(wb, ws, "Statistika");
    }

    XLSX.writeFile(wb, `statistika_${userName.replace(/\s+/g, "_")}.xlsx`);
  }

  if (profile?.role !== "Admin") {
    return (
      <div className={styles.page}>
        <p>Juurdepääs ainult administraatoritele.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1>Statistika</h1>
      <p className={styles.hint}>Vali töötaja ja laadi alla Excel-fail.</p>
      <div className={styles.controls}>
        <label>Töötaja</label>
        <select
          className={styles.select}
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">— vali töötaja —</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.full_name || u.id} ({u.role})</option>
          ))}
        </select>
        <button type="button" className={styles.btn} onClick={downloadExcel} disabled={!selectedUserId}>
          Laadi alla Excel
        </button>
      </div>
      {loading && <p>Laadin…</p>}
      {selectedUserId && !loading && (
        <div className={styles.summary}>
          <h2>Kokkuvõte</h2>
          <p>Töötunnid: {data.hours.length} kirjet</p>
          <p>Vedu: {data.transports.length} kirjet</p>
          <p>Tankimine: {data.refuels.length} kirjet</p>
          <p>Tootmine (m³): {data.production.length} kirjet</p>
        </div>
      )}
    </div>
  );
}
