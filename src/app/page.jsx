"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import styles from "./home.module.css";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "hommikust";
  if (h < 18) return "päevast";
  return "õhtust";
}

export default function HomePage() {
  const { profile } = useAuth();
  const [locations, setLocations] = useState([]);
  const [confirmMsg, setConfirmMsg] = useState(null);

  useEffect(() => {
    supabase
      .from("locations")
      .select("id, name")
      .order("name")
      .then(({ data }) => setLocations(data || []));
  }, []);

  const name = profile?.full_name || "töötaja";
  const greeting = getGreeting();

  return (
    <div className={styles.page}>
      <h1 className={styles.greeting}>
        Tere {greeting}, {name}!
      </h1>

      <section className={styles.section}>
        <h2>Asukohad (kuhu kaupa veetakse)</h2>
        <ul className={styles.locationList}>
          {locations.length === 0 ? (
            <li>Mäetaguse, Puurmanni, Avinurme, Kuusna, Rava, Sinimäe, Tammistu, Peipsiääre, Kavastu, Loviisa, Orimattila, Balti elekter</li>
          ) : (
            locations.map((loc) => (
              <li key={loc.id}>{loc.name}</li>
            ))
          )}
        </ul>
        <p className={styles.hint}>Asukohti saab halduses muuta (Admin).</p>
      </section>

      <section className={styles.section}>
        <h2>Kiirlingid</h2>
        <div className={styles.links}>
          <a href="/tankimine" className={styles.linkCard}>
            Tankimine
          </a>
          <a href="/tunnid" className={styles.linkCard}>
            Töötunnid
          </a>
          <a href="/vedu" className={styles.linkCard}>
            Vedu (mida ja palju)
          </a>
          {(profile?.role === "Hakkur" || profile?.role === "Admin") && (
            <a href="/tootmine" className={styles.linkCard}>
              Hakkepuidu tootmine (m³)
            </a>
          )}
          <a href="/logid" className={styles.linkCard}>
            Logid
          </a>
        </div>
      </section>

      {confirmMsg && (
        <div className={styles.confirmation} role="alert">
          {confirmMsg}
        </div>
      )}
    </div>
  );
}
