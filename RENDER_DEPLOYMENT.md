# Render Deployment Checklist

## ✅ Current Status

| Layer     | Ready? | Notes |
|-----------|--------|-------|
| Backend   | ⚠️     | Uses `Finance.deployment_settings` with PostgreSQL (`DATABASE_URL`) but requires Render env vars. |
| Frontend  | ⚠️     | Build works locally; needs environment variables + SPA routing config. |
| Database  | ⚠️     | `dj-database-url` + `psycopg2` installed. Must supply Render PostgreSQL `DATABASE_URL`. |

## 🌐 Frontend (React + Vite)

1. **Environment Variables**
   - Create `.env.local` (copy `env.example`) for local dev.
   - On Render Static Site → *Environment*:
     ```
     VITE_API_BASE_URL = https://<your-backend-service>.onrender.com/api/
     ```

2. **Build Settings**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`

3. **Routing**
   - `static.json` already configured to route every path to `index.html`.

## 🐍 Backend (Django)

1. **Environment Variables (Render Web Service)**
   ```
   DJANGO_SETTINGS_MODULE=Finance.deployment_settings
   SECRET_KEY=<generate secure value>
   DATABASE_URL=<Render PostgreSQL connection string>
   FRONTEND_URL=https://finotreasuryx.onrender.com
   ALLOWED_HOSTS=finobackend.onrender.com,finotreasuryx.onrender.com
   ```
   Optional:
   ```
   CREATE_SUPERUSER=true
   DJANGO_SUPERUSER_USERNAME=<admin>
   DJANGO_SUPERUSER_EMAIL=<email>
   DJANGO_SUPERUSER_PASSWORD=<password>
   ```

2. **Procfile / Start Command**
   - Render → *Start Command*: `gunicorn Finance.wsgi`

3. **Build Command**
   - Render → *Build Command*: `./build.sh`

4. **Static Files**
   - `collectstatic` runs via `build.sh`
   - WhiteNoise configured in `Finance/deployment_settings.py`

5. **CORS / CSRF**
   - `FRONTEND_URL` env var populates `CORS_ALLOWED_ORIGINS` & `CSRF_TRUSTED_ORIGINS`.

## 🗄️ PostgreSQL Checklist

- Create a Render PostgreSQL instance.
- Copy the “Internal Database URL” into `DATABASE_URL`.
- Ensure `psycopg2` is available (already in `requirements.txt`).
- After deployment run `python manage.py migrate` automatically via `build.sh`.

## 🚀 Deployment Order

1. Provision Render PostgreSQL → grab `DATABASE_URL`.
2. Deploy backend web service with env vars above.
3. Deploy frontend Static Site with `VITE_API_BASE_URL` pointing to backend `/api/`.
4. Verify:
   - `https://<backend>/api/health/` (add endpoint if desired).
   - `https://finotreasuryx.onrender.com` loads and makes API calls over HTTPS.

## 🔍 Verification Steps

1. **Backend**
   - `render logs <service>` → no migration errors.
   - `python manage.py createsuperuser` via env if needed.

2. **Frontend**
   - Browser DevTools → Network tab shows requests to backend URL, not localhost.
   - Auth/login works with JWT tokens; refresh token endpoint reachable.

3. **Database**
   - `psql` into Render DB (using external URL) to inspect tables if needed.

## 📋 Next Actions

- [ ] Provision PostgreSQL and set `DATABASE_URL`.
- [ ] Configure backend env vars (see list).
- [ ] Set frontend `VITE_API_BASE_URL`.
- [ ] Trigger deployments (backend first, then frontend).
- [ ] Smoke-test login, chatbot, and reports on the live site.

