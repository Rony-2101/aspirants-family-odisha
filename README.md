# Aspirants Family Odisha — Admin Panel

This is a secure-by-design admin frontend using Supabase Auth + Postgres.

## Setup
1. Create a Supabase project.
2. Open SQL Editor and run `supabase-schema.sql`.
3. Create an admin user under Authentication -> Users.
4. In Project Settings -> API, copy the Project URL and `anon`/publishable key.
5. Put them in `admin.js` as `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
6. Upload `admin.html`, `admin.css`, and `admin.js` to the same GitHub Pages repository.
7. Open `/admin.html`.

Do NOT use or expose the Supabase `service_role` key in browser code.

This panel manages job records. For direct PDF uploads, create a private Supabase Storage bucket and add carefully scoped Storage policies; until then, paste a public PDF URL into the Notification/PDF URL field.
