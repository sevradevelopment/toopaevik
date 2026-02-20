import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://youbwlpgijkzfniwjcbc.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdWJ3bHBnaWpremZuaXdqY2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExODQ2NzUsImV4cCI6MjA4Njc2MDY3NX0.RPPYfGlTE9SfYQ-coiRXHCCCyhwu9GMhAhxMqk9l8-8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const ROLES = { ADMIN: "Admin", VEDAJA: "Vedaja", HAKKUR: "Hakkur" };

export const DEFAULT_PLATES = [
  "133LHL", "304RVW", "102GBS", "508HVY", "251GTR", "324MTC", "836VZW",
];
export const HAKKUR_PLATE = "0371TH";

export const DEFAULT_LOCATIONS = [
  "Mäetaguse", "Puurmanni", "Avinurme", "Kuusna", "Rava", "Sinimäe",
  "Tammistu", "Peipsiääre", "Kavastu", "Loviisa", "Orimattila", "Balti elekter",
];

