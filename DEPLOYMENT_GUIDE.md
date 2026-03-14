# 🚀 Full-Stack Render Deployment Guide

This guide covers everything you need to know to safely host both your **Frontend** and **Backend** on [Render.com](https://render.com/)!

Render provides a unified Dashboard to host both static sites (your React frontend) and web services (your Node.js backend) completely for free. I have generated a `render.yaml` (Blueprint file) for you, making this incredibly fast.

---

## Step 1: Push The Setup to GitHub
Since I just generated the `render.yaml` file, we need to push it to your GitHub repository first so Render can read it. Run these carefully:
```bash
git add .
git commit -m "Added Render Deployment Setup"
git push
```

---

## Step 2: "One-Click" Deploy on Render

Now that `render.yaml` is on GitHub, Render will automatically spin up both your frontend and backend and link their environment variables together!

1. Go to [Render.com](https://render.com/) and log in using GitHub.
2. Click on the **New +** button in the dashboard, then select **Blueprint**.
3. Connect your `admissions-system` GitHub repository.
4. Render will scan your repository and find the `render.yaml` file. You will see it preparing to configure 2 services (`admissions-backend` and `admissions-frontend`).
5. Click **Apply Blueprint**.

---

## Step 3: Enter Your Secret Environment Variables
In the `render.yaml` file, I explicitly set up your most sensitive variables to `sync: false`. This means Render will immediately ask you to input them securely before building the app.

When prompted by the Render Dashboard, fill in the following exactly as they appear in your local `.env` files:
- `MONGO_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+srv://...`)
  - *(Be sure to check your MongoDB Atlas settings to allow "Network Access" from anywhere: IP `0.0.0.0/0`)*
- `JWT_SECRET`: Any random complicated string for secure passwords (e.g. `my_super_secure_key_123`)
- `ADMIN_EMAIL`: The email you will use to log into the admin dashboard (e.g. `admin@gmail.com`)
- `ADMIN_PASSWORD`: Your admin password (e.g. `"@*#Aishae33"`). *Include the double quotes if it has special `#` characters in it!*
- `GEMINI_API_KEY`: Your Google Gemini API Key.

Once you input these, the servers will begin finishing their builds in the background!

---

## Step 4: Final Environment Linking Step
The `render.yaml` attempts to dynamically link the URLs between the frontend and the backend. However, if your final backend URL generates with unexpected hashing, simply fix the frontend manually:

1. Click on the **admissions-backend** service on the Render dashboard. Copy its live URL at the top (e.g. `https://admissions-backend-ab12.onrender.com`).
2. Go back to the dashboard, click on **admissions-frontend**, go to the **Environment** tab.
3. Edit the `VITE_API_URL` variable to equal `https://admissions-backend-ab12.onrender.com/api` (making sure `/api` is at the end).
4. Save Changes, and Render will do a tiny fast re-deploy of your frontend.

### ⚠️ Note about the Free Tier and "Upload Documents":
Because you are deploying on Render's Free Tier, it uses an *ephemeral file system*. If a student uploads a Marksheet/ID Document, it will save correctly temporarily, but every time the server restarts or falls asleep (which happens on free tiers after 15 mins of inactivity), the uploaded files will be wiped from the local backend folder.
To keep student documents permanently, you would need to either attach a Render Paid Disk (costs $\sim$1/mo) or rewrite the backend to connect to AWS S3/Cloudinary. Everything else, including MongoDB data, will stay permanently!
