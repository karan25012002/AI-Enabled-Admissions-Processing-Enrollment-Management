# 🚀 GitHub & Vercel Deployment Guide

This guide covers everything you need to do to upload your Admissions System to **GitHub** and safely deploy it live on the internet! 

---

## Step 1: Push Project to GitHub
I have already generated all the necessary `.gitignore` files for you so that sensitive files (like `.env`, `node_modules`, and local file `uploads`) are NOT pushed to public servers.

1. Open your terminal in the Root folder (`c:\Users\HARENDRA KUMAR\Desktop\Admissions Processing and Enrollment Management`).
2. Run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Admissions Platform"
   ```
3. Go to [GitHub](https://github.com/), log in, and click **New Repository**. Give it a name (e.g., `admissions-system`).
4. Copy the second set of commands GitHub gives you (Under "...or push an existing repository from the command line") and paste them into your terminal:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/admissions-system.git
   git push -u origin main
   ```

---

## Step 2: Deploy Frontend on Vercel
Vercel is perfect for the React Frontend. I have already created a `vercel.json` file inside `frontend/` to fix "Blank Page" routing issues!

1. Go to [Vercel](https://vercel.com/) and log in with GitHub.
2. Click **Add New -> Project**.
3. Import your `admissions-system` GitHub repository.
4. **Important Settings before clicking deploy**:
   - Framework Preset: **Vite**
   - Root Directory: Click the Edit button and select **`frontend`** (This ensures Vercel only deploys the React frontend, not the backend).
5. Open the **Environment Variables** section and add:
   - Name: `VITE_API_URL`
   - Value: `https://YOUR_BACKEND_LIVE_URL/api` (You will replace this after you deploy the backend in Step 3!)
6. Click **Deploy**!

---

## Step 3: Deploy Backend on Render (Highly Recommended over Vercel)
⚠️ **CRITICAL WARNING:** You *should not* deploy your Node.js/Express Backend to Vercel. Vercel uses "Serverless Functions," which deletes all files saved to the local disk every few minutes. Your **Document Uploads** (Marksheets, ID proofs) save to the local disk, so compiling the backend to Vercel will cause all uploaded documents to disappear instantly!

Instead, deploy the backend to **Render.com** (it's also free and supports file storage!):

1. Go to [Render](https://render.com/) and log in with GitHub.
2. Click **New -> Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - Root Directory: **`backend`**
   - Environment: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start` (or `node server.js`)
5. **Environment Variables**. Add all your `.env` variables exactly as they are on your computer:
   - `PORT`: `5000`
   - `MONGO_URI`: `your_mongoDB_atlas_connection_string` (Make sure your MongoDB Atlas network access is set to `0.0.0.0/0`)
   - `JWT_SECRET`: `your_secret`
   - `JWT_EXPIRE`: `30d`
   - `ADMIN_EMAIL`: `admin@gmail.com`
   - `ADMIN_PASSWORD`: `"@*#Aishae33"` (Make sure to include quotes)
   - `GEMINI_API_KEY`: `your_gemini_key`
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://YOUR_VERCEL_FRONTEND_LINK.vercel.app`
6. Click **Create Web Service**.

### Connecting Them Together:
After Render finishes deploying your Backend, copy its live URL (e.g., `https://admissions-backend-xyz.onrender.com`).
Go BACK to your Frontend on Vercel -> Settings -> Environment Variables, and edit the `VITE_API_URL` to point to `https://admissions-backend-xyz.onrender.com/api`. Redeploy your Vercel frontend!

Your fully AI-powered Admissions Flow will now be live on the internet! Let me know if you run into any Vercel configuration errors.
