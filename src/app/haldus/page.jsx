"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import styles from "./haldus.module.css";

export default function HaldusPage() {
  const { profile } = useAuth();
  const [tab, setTab] = useState("plates");
  const [plates, setPlates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);
  const [newPlate, setNewPlate] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (profile?.role !== "Admin") return;
    load();
  }, [profile?.role]);

  function load() {
    supabase.from("license_plates").select("*").order("plate").then(({ data }) => setPlates(data || []));
    supabase.from("locations").select("*").order("name").then(({ data }) => setLocations(data || []));
    supabase.from("profiles").select("id, full_name, role").order("full_name").then(({ data }) => setUsers(data || []));
  }

  async function addPlate(e) {
    e.preventDefault();
    setMessage(null);
    if (!newPlate.trim()) return;
    const { error } = await supabase.from("license_plates").insert({ plate: newPlate.trim().toUpperCase() });
    if (error) setMessage("Viga: " + error.message);
    else { setMessage("Numbrimärk lisatud."); setNewPlate(""); load(); }
  }

  async function removePlate(id) {
    if (!confirm("Eemaldada see numbrimärk?")) return;
    await supabase.from("license_plates").delete().eq("id", id);
    setMessage("Numbrimärk eemaldatud."); load();
  }

  async function addLocation(e) {
    e.preventDefault();
    setMessage(null);
    if (!newLocation.trim()) return;
    const { error } = await supabase.from("locations").insert({ name: newLocation.trim() });
    if (error) setMessage("Viga: " + error.message);
    else { setMessage("Asukoht lisatud."); setNewLocation(""); load(); }
  }

  async function removeLocation(id) {
    if (!confirm("Eemaldada see asukoht?")) return;
    await supabase.from("locations").delete().eq("id", id);
    setMessage("Asukoht eemaldatud."); load();
  }

  async function setUserRole(userId, role) {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
    if (error) setMessage("Viga: " + error.message);
    else { setMessage("Roll uuendatud."); load(); }
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
      <h1>Haldus</h1>
      <div className={styles.tabs}>
        <button type="button" className={tab === "plates" ? styles.active : ""} onClick={() => setTab("plates")}>Numbrimärgid</button>
        <button type="button" className={tab === "locations" ? styles.active : ""} onClick={() => setTab("locations")}>Asukohad</button>
        <button type="button" className={tab === "users" ? styles.active : ""} onClick={() => setTab("users")}>Kasutajad</button>
      </div>
      {message && <p className={styles.msg}>{message}</p>}

      {tab === "plates" && (
        <>
          <h2>Numbrimärgid (vedukid, hakkur 0371TH jne)</h2>
          <form onSubmit={addPlate} className={styles.form}>
            <input className={styles.input} value={newPlate} onChange={(e) => setNewPlate(e.target.value)} placeholder="nt. 133LHL" />
            <button type="submit" className={styles.btn}>Lisa</button>
          </form>
          <ul className={styles.list}>
            {plates.map((p) => (
              <li key={p.id}>
                {p.plate}
                <button type="button" className={styles.del} onClick={() => removePlate(p.id)}>Eemalda</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "locations" && (
        <>
          <h2>Asukohad (kuhu kaupa veetakse)</h2>
          <form onSubmit={addLocation} className={styles.form}>
            <input className={styles.input} value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="nt. Mäetaguse" />
            <button type="submit" className={styles.btn}>Lisa</button>
          </form>
          <ul className={styles.list}>
            {locations.map((l) => (
              <li key={l.id}>
                {l.name}
                <button type="button" className={styles.del} onClick={() => removeLocation(l.id)}>Eemalda</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "users" && (
        <>
          <h2>Kasutajad ja rollid</h2>
          <ul className={styles.userList}>
            {users.map((u) => (
              <li key={u.id}>
                <span>{u.full_name || u.id}</span>
                <select
                  value={u.role || ""}
                  onChange={(e) => setUserRole(u.id, e.target.value)}
                  className={styles.select}
                >
                  <option value="Admin">Admin</option>
                  <option value="Vedaja">Vedaja</option>
                  <option value="Hakkur">Hakkur</option>
                </select>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
