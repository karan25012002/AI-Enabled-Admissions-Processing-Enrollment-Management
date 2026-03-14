# AI-Enabled Admissions Processing & Enrollment Management System

Welcome to the full-stack MERN application for AI-Enabled Admissions. This platform revolutionizes the college/university admissions process by integrating the **Google Gemini API** to analyze student applications, predict admission outcomes, verify documents, and assist students via a chatbot.

## 🚀 Quick Start (Development)

Your servers are already configured!
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

### Admin Login Credentials
- **Email:** `aishae33@gmail.com`
- **Password:** `@*#Aishae33`
- **Link:** `http://localhost:5173/admin/login`

---

## 🌟 Key Features

### 🎓 For Students (User Dashboard)
- **Modern Landing Page**: Stunning UI with glassmorphism, animations, and dynamic program listings.
- **AI Chatbot Assistant**: Embedded Gemini-powered chatbot for 24/7 admission queries.
- **Application Portal**: Multi-step admission form (Program Selection ➔ Academic Info ➔ Statement/Review).
- **Document Hub**: Drag-and-drop secure file uploads (10th/12th marksheets, ID proof).
- **Real-Time Tracking**: Visual timeline tracking from submission to final decision.
- **Notification Center**: Automated alerts for status updates, document verification, and admin broadcasts.

### 🛡️ For Administrators (Admin Dashboard)
- **Analytics Overview**: Recharts-powered dashboard showing total students, acceptance rates, program popularity, and more.
- **Applicant Management**: View all registered students, their details, and submitted applications with an expandable UI.
- **Program Configuration**: Add, edit, or delete academic programs (name, description, duration, seats, min GPA/Score).
- **Document Verification**: Review uploaded documents. Accept or reject with custom feedback reasons.
- **AI Screening Results**: See Gemini AI's automated evaluation of all applicants, including candidate scores and eligibility prediction.
- **Fraud Detection**: AI flags anomalies (e.g., impossible GPA/Score combinations or AI-written statements) into Low/Medium/High risk categories.
- **Admission Decisions**: Accept, Reject, or Waitlist candidates with optional admin remarks.
- **System Notifications**: Broadcast messages to all students or message individuals specifically.

### 🤖 Google Gemini AI Integrations
1. **Eligibility Prediction**: Automatically checks if a student meets a program's minimum requirements based on their inputs.
2. **Candidate Scoring**: Evaluates the entire application (GPA, Entrance Score, Statement) and provides a score out of 100.
3. **Fraud Detection**: Analyzes data consistency to assign a fraud risk level (`low`, `medium`, `high`) and a risk score out of 100.
4. **Yield Prediction**: Predicts the percentage likelihood (%) that an accepted student will actually enroll.
5. **Interactive Chatbot**: Context-aware admissions assistant on the landing page.

---

## 🛠️ Tech Stack Architecture

### Frontend (/frontend)
- **Framework**: React 18 (via Vite)
- **Styling**: Tailwind CSS + PostCSS (Glassmorphism design language)
- **Routing**: React Router v6
- **State/Auth**: React Context API (`AuthContext`)
- **API Client**: Axios (with JWT Interceptors)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **File Uploads**: React Dropzone
- **Charts**: Recharts

### Backend (/backend)
- **Framework**: Node.js + Express.js
- **Database**: MongoDB Atlas + Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs
- **File Uploads**: Multer (Local storage in `/uploads`)
- **AI Integration**: `@google/generative-ai` SDK
- **Security**: CORS, Environment Variables
- **API Structure**: Modular Routes + Controllers + Middleware

---

## 📂 Complete Project Structure

```
c:\Users\... \Admissions Processing and Enrollment Management\
├── backend/
│   ├── config/ 
│   │   └── db.js                # MongoDB connection setup
│   ├── controllers/
│   │   ├── aiController.js      # Gemini API wrappers
│   │   ├── analyticsController.js # Admin dashboard stats
│   │   ├── applicationController.js # Application logic
│   │   ├── authController.js    # Login/Signup logic
│   │   ├── documentController.js# File verification logic
│   │   ├── notificationController.js # Alerts logic
│   │   └── programController.js # Academic programs CRUD
│   ├── middleware/
│   │   ├── auth.js              # Token and Admin verification
│   │   └── upload.js            # Multer config (5MB, PDF/JPG/PNG)
│   ├── models/                  # Mongoose Schemas
│   │   ├── Application.js
│   │   ├── Document.js
│   │   ├── Notification.js
│   │   ├── Program.js
│   │   └── User.js
│   ├── routes/                  # Express REST Routes
│   │   ├── aiRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── programRoutes.js
│   ├── uploads/                 # Storage for user documents
│   ├── utils/
│   │   └── gemini.js            # Core AI Prompts & Parsing Logic
│   ├── .env                     # Backend Secrets
│   ├── package.json
│   └── server.js                # Express Server Entry Point
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js         # Axios config + Interceptors
    │   ├── components/
    │   │   └── Chatbot.jsx      # Reusable Gemini Bot Interface
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global User + Token State
    │   ├── pages/
    │   │   ├── admin/           # All 9 Admin Dashboard Views
    │   │   ├── auth/            # Login, Signup, AdminLogin
    │   │   ├── landing/         # Homepage Hero/Programs/Process
    │   │   └── user/            # All 7 Student Dashboard Views
    │   ├── App.jsx              # Routing & Protected Routes
    │   ├── index.css            # Global CSS + Custom scrollbars
    │   └── main.jsx             # React DOM Root
    ├── index.html
    ├── package.json
    ├── tailwind.config.js       # Custom colors (primary/accent)
    └── vite.config.js           # Vite config with backend API proxy
```

---

## 🔒 Environment Setup & Installation

### Prerequisites
1. **Node.js** (v18+)
2. **MongoDB Atlas URI**
3. **Google Gemini API Key**

### 1. Backend Setup (`/backend`)
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
ADMIN_EMAIL=aishae33@gmail.com
ADMIN_PASSWORD=@*#Aishae33
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```
Start the server:
```bash
npm run dev
```

### 2. Frontend Setup (`/frontend`)
```bash
cd frontend
npm install
```
*Note: Vite uses proxying. Ensure `server.proxy` in `vite.config.js` points to your backend URL (`http://localhost:5000`).*
Start the frontend:
```bash
npm run dev
```

---

## 🌐 API Overview

The backend provides a RESTful API structure:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register a new student | No |
| POST | `/api/auth/login` | Student login | No |
| POST | `/api/auth/admin-login` | Admin login | No |
| GET | `/api/programs` | Get all active programs | No |
| POST | `/api/programs` | Create new program | Admin |
| POST | `/api/applications` | Submit application | User |
| GET | `/api/applications/my` | Get user's applications | User |
| POST | `/api/documents/upload` | Upload file (Multer) | User |
| PUT | `/api/documents/:id/verify`| Approve/reject doc | Admin |
| GET | `/api/ai/fraud-report` | Top flagged applications | Admin |
| POST | `/api/ai/chat` | Send message to Gemini bot | No |
| GET | `/api/analytics/dashboard`| Admin statistics | Admin |

*(This is a partial list. See `backend/routes/` for all endpoints.)*

---

## 🚀 Deployment Guide

### Database (MongoDB Atlas)
Ensure `0.0.0.0/0` is whitelisted in your MongoDB Atlas Network Access pane for production.

### Backend Deployment (Render / Heroku)
1. Set the Node.js build command to `npm install`.
2. Set the start command to `node server.js`.
3. Add all `.env` variables to the host platform's environment settings.
4. **Important**: Since Multer uses a local `/uploads` folder, you may lose files on ephemeral filesystems (like Heroku). For production scale, modify `middleware/upload.js` to use AWS S3, Cloudinary, or Firebase Storage.

### Frontend Deployment (Vercel / Netlify)
1. Point Vercel to the `frontend/` directory.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Update frontend `axios.js` base URL:
   Replace `http://localhost:5000/api` with your live backend absolute URL (e.g., `https://my-admissions-backend.onrender.com/api`).
5. (Optional) Set up a `_redirects` file or Vercel rewrite to handle React Router push-states if reloading breaks.

---

## 🧪 Common Testing Scenarios

1. **Test AI Fraud Detection**: As a student, create an application with `GPA: 10`, `Entrance Score: 100`, and `Percentage: 100`. The Gemini AI in the backend will likely flag this as `Medium` or `High` risk.
2. **Test Document Workflow**: 
   - Student Side: Upload a `.jpg` or `.pdf` file.
   - Admin Side: Go to Document Verification, open the file, click "Reject", and provide a reason.
   - Student Side: Check "Notifications" to see the rejection reason.
3. **Test Enrollment Yield**: Once an admin clicks "Accept" on an application, check the AI Screening tab to see the % yield prediction.
