"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import styles from "./logid.module.css";

export default function LogidPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tunnid");
  const [hours, setHours] = useState([]);
  const [transports, setTransports] = useState([]);
  const [refuels, setRefuels] = useState([]);
  const [production, setProduction] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("work_hours").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(100).then(({ data }) => setHours(data || []));
    supabase.from("transport_logs").select("*, license_plates(plate), locations(name)").eq("user_id", user.id).order("date", { ascending: false }).limit(100).then(({ data }) => setTransports(data || []));
    supabase.from("refuel_logs").select("*, license_plates(plate)").eq("user_id", user.id).order("date", { ascending: false }).limit(100).then(({ data }) => setRefuels(data || []));
    supabase.from("production_logs").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(100).then(({ data }) => setProduction(data || []));
  }, [user?.id]);

  return (
    <div className={styles.page}>
      <h1>Logid</h1>
      <div className={styles.tabs}>
        {["tunnid", "vedu", "tankimine", "tootmine"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? styles.active : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "tunnid" && "Töötunnid"}
            {tab === "vedu" && "Vedu"}
            {tab === "tankimine" && "Tankimine"}
            {tab === "tootmine" && "Tootmine"}
          </button>
        ))}
      </div>
      {activeTab === "tunnid" && (
        <ul className={styles.list}>
          {hours.map((e) => (
            <li key={e.id}>{e.date} — {e.start_time} – {e.end_time}</li>
          ))}
        </ul>
      )}
      {activeTab === "vedu" && (
        <ul className={styles.list}>
          {transports.map((e) => (
            <li key={e.id}>{e.date} — {e.license_plates?.plate} | {e.locations?.name} | {e.description} {e.amount ? `(${e.amount})` : ""}</li>
          ))}
        </ul>
      )}
      {activeTab === "tankimine" && (
        <ul className={styles.list}>
          {refuels.map((e) => (
            <li key={e.id}>{e.date} — {e.license_plates?.plate} — {e.liters} L</li>
          ))}
        </ul>
      )}
      {activeTab === "tootmine" && (
        <ul className={styles.list}>
          {production.map((e) => (
            <li key={e.id}>{e.date} — {e.volume_m3} m³</li>
          ))}
        </ul>
      )}
    </div>
  );
}
