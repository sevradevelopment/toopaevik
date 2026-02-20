import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./app.css";
import { AuthProvider } from "@/context/AuthContext";
import { AppShell } from "@/components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tööpäevik – Hakkepuiduvedu",
  description: "Töötundide ja vedude päevik",
};

// Vercel build vajab dünaamilist renderdit (mitte staatilist _not-found prerenderit)
export const dynamic = "force-dynamic";

export default function RootLayout({ children }) {
  return (
    <html lang="et">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
