# CampusCart Production Deployment Guide

This guide details step-by-step instructions to deploy CampusCart to popular production hosts like **Vercel**, **Render**, **Railway**, and **Netlify**.

---

## Option 1: Recommended Deployment (Vercel Frontend + Render Backend)

### Step 1: Deploy Backend on Render

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Sign in to [Render](https://render.com) and click **New +** -> **Web Service**.
3. Connect your repository.
4. Set the following settings:
   - **Root Directory**: `Backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables under **Environment**:
   - `MONGO_URI`: `mongodb+srv://...`
   - `JWT_SECRET`: `your_jwt_secret`
   - `ACCESS_TOKEN_EXPIRE`: `15M`
   - `REFRESH_TOKEN_EXPIRE`: `7d`
   - `CLIENT_URL`: `https://your-app.vercel.app` (Add your frontend URL once created)
   - `CLOUDINARY_CLOUD_NAME`: your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: your Cloudinary key
   - `CLOUDINARY_API_SECRET`: your Cloudinary secret
   - `USER`: your Gmail address for SMTP
   - `PASS`: your Gmail App Password
6. Click **Create Web Service**. Render will give you a backend URL e.g., `https://campuscart-backend.onrender.com`.

---

### Step 2: Deploy Frontend on Vercel

1. Sign in to [Vercel](https://vercel.com) and click **Add New...** -> **Project**.
2. Select your repository.
3. Set the following settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://campuscart-backend.onrender.com/api` (Replace with your actual Render backend URL)
5. Click **Deploy**.
6. Once deployed, copy your Vercel URL (e.g. `https://campuscart.vercel.app`) and update the `CLIENT_URL` environment variable in your Render Backend settings so CORS allows requests.

---

## Option 2: 1-Click Render Blueprint Deployment

1. Connect your repository on Render.
2. Go to **Blueprints** -> **New Blueprint Instance**.
3. Select your repository. Render will automatically detect `render.yaml` and configure both the Backend Web Service and Frontend Static Site.
4. Fill in the requested secret environment variables (`MONGO_URI`, `CLOUDINARY_*`, `USER`, `PASS`, etc.).
5. Deploy!

---

## Option 3: Unified Single-Server Deployment (Render / Railway / VPS)

If you want to host both Backend and Frontend together on a single server:

1. Build the frontend into `Frontend/dist`:
   ```bash
   npm run build
   ```
2. Start the unified Node.js server:
   ```bash
   npm start
   ```
3. The Express backend will automatically serve static frontend files from `Frontend/dist` and handle API routes under `/api/*`.

---

## Quick Verification Check

- Test API status: `https://<your-backend-url>/api/health`
- Test Frontend routes: Navigate to `/marketplace`, `/profile`, `/login` and refresh the page to verify SPA rewrite rules are working cleanly.
