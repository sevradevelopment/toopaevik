# Tööpäevik – Hakkepuiduvedu

Next.js rakendus töötundide, vedude, tankimise ja tootmise logimiseks. Supabase (auth + andmebaas).

## Käivitamine

```bash
npm install
cp .env.example .env
# Täida .env oma Supabase URL ja anon key-ga
npm run dev
```

Avage [http://localhost:3000](http://localhost:3000).

## GitHub + Vercel

### 1. GitHubi repo

1. Loo GitHubis uus tühi repo: [github.com/new](https://github.com/new) (nt. `toopaevik`).
2. Ära lisa README / .gitignore – need on juba projektis.

Projekti kaustas (PowerShell):

```bash
cd C:\Users\rasmu\toopaevik
git init
git add .
git commit -m "Tööpäevik – esialgne versioon"
git branch -M main
git remote add origin https://github.com/KASUTAJA/toopaevik.git
git push -u origin main
```

Asenda `KASUTAJA` oma GitHubi kasutajanimega ja `toopaevik` repo nimega, kui see erineb.

### 2. Verceliga ühendamine

1. Mine [vercel.com](https://vercel.com) ja logi sisse (võid GitHubi kontoga).
2. **Add New** → **Project**.
3. Vali **Import Git Repository** ja oma `toopaevik` repo.
4. **Deploy** – Vercel tuvastab Next.js ise.
5. Enne või pärast esimest deploy’d: **Settings** → **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = sinu Supabase projekti URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sinu Supabase anon key

Pärast seda tehakse iga `git push` puhul uus deploy automaatselt.

## Supabase

Andmebaasi tabelid ja RLS: käivita `supabase/schema.sql` Supabase Dashboard → SQL Editor.
