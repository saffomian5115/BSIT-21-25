# 📋 JobTrackr — Job Application Tracker

A full-stack job application tracking system built as a Final Year Project. Track your job applications, manage follow-ups, and stay organized throughout your job search journey.

---

## 📁 Project Structure

```
JobTrackr/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, Login, Profile
│   │   └── jobController.js   # Job CRUD operations
│   ├── middleware/
│   │   └── errorHandler.js    # Error handling middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Job.js             # Job application schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth routes
│   │   └── jobRoutes.js       # Job routes
│   ├── services/
│   │   └── reminderService.js # Cron job for reminders
│   ├── server.js              # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

---

## ⚙️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React, Vite, Tailwind CSS           |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB + Mongoose                  |
| Auth      | JWT (jsonwebtoken) + bcryptjs       |
| Cron      | node-cron (reminders)               |

---

## 🚀 Setup & Installation

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend folder:

```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

Start backend server:

```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔑 Features

- ✅ User Registration & Login (JWT Authentication)
- ✅ Job Application CRUD
- ✅ Status Tracking (Wishlist, Applied, Interviewing, Offer, Rejected, Accepted, Withdrawn)
- ✅ Follow-up Reminders with Cron Job
- ✅ Search & Filter Applications
- ✅ Statistics Dashboard
- ✅ Premium Tier Support

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |

### Job Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all jobs (protected) |
| POST | `/api/jobs` | Create job (protected) |
| GET | `/api/jobs/:id` | Get single job (protected) |
| PUT | `/api/jobs/:id` | Update job (protected) |
| DELETE | `/api/jobs/:id` | Delete job (protected) |
| GET | `/api/jobs/stats` | Get statistics (protected) |

---

*Built with ❤️ for FYP — JobTrackr 2025*
