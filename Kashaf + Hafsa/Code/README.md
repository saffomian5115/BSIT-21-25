# 🏥 AI-GastroCare Official

<div align="center">

![GastroCare Banner](https://img.shields.io/badge/GastroCare-AI%20Health%20Assistant-0a4f3c?style=for-the-badge&logo=react)
![Version](https://img.shields.io/badge/Version-1.0.0-c9a84c?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An AI-powered gastro health assistant available in English, Urdu & Turkish**

</div>

---

## 👩‍💻 Developer

| Field | Detail |
|-------|--------|
| **Developer** | Hafsa |
| **Project Type** | Full Stack Web Application |
| **Version** | 1.0.0 |
| **Year** | 2026 |
| **Email** | ai.gastrocare.official@gmail.com |
| **Instagram** | [@ai.gastrocare.official](https://www.instagram.com/ai.gastrocare.official/) |
| **X (Twitter)** | [@AiBased37955](https://x.com/AiBased37955) |

---

## 📖 Project Description

**AI-GastroCare** is a full-stack, AI-powered health assistant web application that specializes in:

- 🫁 **Gastroenterology** — stomach, digestive system, intestines, liver
- 🥗 **Nutrition & Diet** — personalized diet plans based on user health profile
- 💊 **General Health & Wellness** — general medical guidance
- 🚨 **Emergency Detection** — auto-detects critical symptoms and shows emergency numbers

The chatbot is powered by **Llama 3.3 70B** (via Groq API) and is fully personalized — it reads the user's medical history, allergies, medications, and chronic diseases to give tailored health advice.

### 🌍 Supported Languages
- 🇬🇧 English
- 🇵🇰 Urdu (اردو)
- 🇹🇷 Turkish (Türkçe)

---

## ✨ Key Features

### 👤 User Features
- ✅ Signup / Login with JWT authentication
- ✅ Forgot Password — reset link via email
- ✅ Personal Profile — name, age, height, weight, country, etc.
- ✅ Medical History — allergies, chronic diseases, medications, surgeries
- ✅ Profile Picture upload
- ✅ Health Dashboard — stats and recent chats

### 🤖 AI Chatbot
- ✅ Powered by Llama 3.3 70B (Groq API)
- ✅ Fully personalized — reads user's health profile
- ✅ 3 language support — English, Urdu, Turkish
- ✅ Chat history — save, resume, delete chats
- ✅ Emergency alert system — detects dangerous symptoms
- ✅ Hard filter — only health related questions answered
- ✅ Context memory — remembers conversation

### 🚨 Emergency Page
- ✅ Active ambulance numbers for Pakistan, USA, UK, Turkey
- ✅ Click-to-call functionality
- ✅ First aid tips

### 📞 Contact Page
- ✅ Feedback form — sends email to GastroCare Gmail
- ✅ Star rating system
- ✅ Social media links
- ✅ Availability information

---

## 🛠️ Technologies Used

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React.js | 18.2.0 | Frontend framework |
| React Router DOM | 6.14.1 | Page navigation |
| Bootstrap | 5.3.2 | UI styling & layout |
| Bootstrap Icons | 1.11.3 | Icons |
| Axios | 1.4.0 | API calls |
| Google Fonts | — | Playfair Display + DM Sans |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 16+ | Runtime environment |
| Express.js | 4.18.2 | Web framework |
| MongoDB | Local | Database |
| Mongoose | 7.3.1 | MongoDB ODM |
| JWT | 9.0.0 | Authentication |
| Bcryptjs | 2.4.3 | Password hashing |
| Nodemailer | 6.9.7 | Email sending |
| Groq SDK | 0.3.3 | AI chatbot |
| Nodemon | 3.0.1 | Development server |
| Dotenv | 16.0.3 | Environment variables |
| Crypto | built-in | Password reset tokens |

### AI & APIs
| Service | Purpose | Cost |
|---------|---------|------|
| Groq API (Llama 3.3 70B) | AI Chatbot | Free (1000 req/day) |
| Gmail SMTP | Email sending | Free |
| MongoDB Local | Database | Free |

---

## 📁 Project Structure

```
AI-GastroCare-official/
│
├── README.md                          ← You are here!
├── .gitignore                         ← Git ignore file
│
├── client/                            ← React Frontend
│   ├── package.json                   ← Frontend dependencies
│   ├── public/
│   │   └── index.html                 ← Bootstrap + Fonts loaded here
│   └── src/
│       ├── index.js                   ← React entry point
│       ├── App.js                     ← All routes defined here
│       ├── App.css                    ← All custom styles (one file)
│       │
│       ├── context/
│       │   └── AuthContext.js         ← Global login state
│       │
│       ├── components/
│       │   ├── Logo.js                ← SVG GastroCare logo
│       │   ├── Navbar.js              ← Navigation bar
│       │   └── Footer.js             ← Footer
│       │
│       └── pages/
│           ├── Home.js                ← Landing page
│           ├── About.js               ← About page
│           ├── Login.js               ← Login page
│           ├── Signup.js              ← Signup page
│           ├── ForgotPassword.js      ← Forgot password page
│           ├── ResetPassword.js       ← Reset password page
│           ├── Dashboard.js           ← User dashboard
│           ├── Profile.js             ← Profile + Medical history
│           ├── Chatbot.js             ← AI Chatbot page
│           ├── Emergency.js           ← Emergency numbers
│           └── Contact.js             ← Contact + Feedback form
│
└── server/                            ← Node.js Backend
    ├── package.json                   ← Backend dependencies
    ├── server.js                      ← Main server file
    ├── .env                           ← Environment variables (SECRET!)
    │
    ├── middleware/
    │   └── auth.js                    ← JWT authentication middleware
    │
    ├── models/
    │   ├── User.js                    ← User + Medical history schema
    │   ├── Chat.js                    ← Chat history schema
    │   └── Feedback.js                ← Feedback schema
    │
    ├── routes/
    │   ├── auth.js                    ← Login, Signup, Forgot/Reset Password
    │   ├── user.js                    ← Profile, Dashboard, Change Password
    │   ├── chat.js                    ← AI Chatbot (Groq integration)
    │   └── feedback.js                ← Contact form + Email
    │
    └── utils/
        └── mailer.js                  ← Nodemailer email utility
```

---

## ⚙️ React Concepts Used

| Concept | Where Used |
|---------|-----------|
| **Components** | Every page and UI element |
| **Props** | Logo size, TagField data |
| **useState** | Forms, loading states, errors |
| **useEffect** | Data fetching on page load |
| **useContext** | Auth state across all pages |
| **useRef** | Input focus, scroll, file upload |
| **useCallback** | TagField re-render prevention |
| **useNavigate** | Page redirects after login |
| **useParams** | Reset password token from URL |
| **Context API** | Global authentication state |
| **React Router** | All page navigation |
| **Protected Routes** | Login required pages |
| **Conditional Rendering** | Loading, error, empty states |
| **Controlled Forms** | All input fields |
| **Event Handling** | onClick, onChange, onSubmit |
| **Async/Await** | All API calls |
| **LocalStorage** | User session persistence |
| **Dynamic Classes** | Active tabs, states |

---

## 🚀 First Time Setup Guide

### Step 1 — Prerequisites Install karein

Pehle yeh sab install hona chahiye aapke computer mein:

**1. Node.js install karein:**
- Website: https://nodejs.org
- Version: 16 ya usse upar
- Check karein: `node --version`

**2. MongoDB install karein:**
- Website: https://www.mongodb.com/try/download/community
- Community Server download karein
- Check karein: `mongod --version`

**3. VS Code (recommended):**
- Website: https://code.visualstudio.com

---

### Step 2 — Project Extract karein

1. ZIP file download karein 
2. Desktop ya kisi folder mein extract karein
3. VS Code mein open karein:
   - `File` → `Open Folder` → `AI-GastroCare-official` select karein

---

### Step 3 — Environment Variables Setup

`server/.env` file open karein aur apni details daalen:

```env
MONGO_URI=mongodb://localhost:27017/gastrocare
JWT_SECRET=gastrocare_secret_key_2024
GROQ_API_KEY=your_groq_api_key_here
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_gmail_app_password
PORT=5000
```

**Groq API Key kaise len:**
1. https://console.groq.com par jayen
2. Sign up karein (free)
3. API Keys → Create new key
4. Key copy karein — `gsk_...` jaisi hogi

**Gmail App Password kaise len:**
1. Gmail → Google Account → Security
2. 2-Step Verification ON karein
3. https://myaccount.google.com/apppasswords
4. App name likhen → Generate
5. 16 digit password copy karein

---

### Step 4 — MongoDB Start karein

**Windows:**
```bash
# New terminal mein chalayein
mongod
```

**Mac:**
```bash
brew services start mongodb-community
```

Yeh dikhna chahiye:
```
waiting for connections on port 27017
```

---

### Step 5 — Backend (Server) Start karein
```bash
# Terminal 1
cd AI-GastroCare-official/server
npm install
npm run dev
```

Yeh dikhna chahiye:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected
```

---

### Step 6 — Frontend (Client) Start karein

```bash
# Terminal 2 (naya terminal)
cd AI-GastroCare-official/client
npm install
npm start
```

Browser automatically khulega:
```
http://localhost:3000
```

---

### Step 7 — Pehli baar use karein

1. `http://localhost:3000` open karein
2. **Sign Up** karein — naya account banayein
3. **Profile** fill karein — personal + medical info
4. **AI Chat** open karein — health question poochein!

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/signup` | New user register |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/forgot-password` | Password reset email |
| POST | `/api/auth/reset-password/:token` | Reset password |

### User
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/user/profile` | Get user profile |
| PUT | `/api/user/profile` | Update profile |
| PUT | `/api/user/picture` | Update profile picture |
| PUT | `/api/user/change-password` | Change password |
| GET | `/api/user/dashboard` | Dashboard stats |

### Chat
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/chat` | Get all chats |
| GET | `/api/chat/:id` | Get single chat |
| POST | `/api/chat/new` | Create new chat |
| POST | `/api/chat/:id/message` | Send message to AI |
| DELETE | `/api/chat/:id` | Delete chat |

### Feedback
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/feedback` | Submit feedback (sends email) |

---

## 🌐 Pages Overview

| Page | URL | Access |
|------|-----|--------|
| Home | `/` | Public |
| About | `/about` | Public |
| Emergency | `/emergency` | Public |
| Contact | `/contact` | Public |
| Login | `/login` | Public |
| Signup | `/signup` | Public |
| Forgot Password | `/forgot-password` | Public |
| Reset Password | `/reset-password/:token` | Public |
| Dashboard | `/dashboard` | 🔒 Login Required |
| AI Chatbot | `/chatbot` | 🔒 Login Required |
| Profile | `/profile` | 🔒 Login Required |

---

## 🚨 Emergency Numbers Covered

| Country | Numbers |
|---------|---------|
| 🇵🇰 Pakistan | 1122 (Rescue), 115, 15, 16 |
| 🇺🇸 USA | 911, 988, Poison Control |
| 🇬🇧 UK | 999, 111, Samaritans |
| 🇹🇷 Turkey | 112, 155, 110 |

---

## ❓ Troubleshooting

**Problem: MongoDB connect nahi ho raha**
```
Solution: mongod command alag terminal mein chalayein
```

**Problem: "npm install" error**
```
Solution: Node.js version check karein — node --version
Must be 16+
```

**Problem: AI respond nahi kar raha**
```
Solution: Groq API key check karein server/.env mein
Free tier: 1000 requests/day limit
```

**Problem: Email nahi aa rahi**
```
Solution: 
1. Gmail App Password check karein
2. 2-Step Verification ON hai?
3. GMAIL_USER aur GMAIL_PASS .env mein sahi hain?
```

**Problem: Port already in use**
```
Solution: 
Backend: PORT change karein .env mein
Frontend: React khud poochega — Y press karein
```

**Problem: New chat nahi banta (MongoDB index error)**
```
Solution: Terminal mein chalayein:
mongosh
use gastrocare
db.chats.dropIndex("sessionId_1")
exit
```

---

## 🔒 Security Notes

> ⚠️ **Important:** Yeh cheezein kabhi GitHub pe upload mat karein:
> - `server/.env` file
> - Groq API Key
> - Gmail App Password
> - JWT Secret

`.gitignore` file already configured hai — yeh files automatically ignore hongi.

---

## 📝 Dependencies List

### Client (Frontend)
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.14.1",
  "react-scripts": "5.0.1",
  "axios": "^1.4.0"
}
```

### Server (Backend)
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.3.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "groq-sdk": "^0.3.3",
  "nodemailer": "^6.9.7",
  "dotenv": "^16.0.3",
  "cors": "^2.8.5",
  "nodemon": "^3.0.1"
}
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

**Made with ❤️ by Hafsa**

*GastroCare AI — Your Health, Our Priority*

🏥 [ai.gastrocare.official@gmail.com](mailto:ai.gastrocare.official@gmail.com) &nbsp;|&nbsp;
📸 [Instagram](https://www.instagram.com/ai.gastrocare.official/) &nbsp;|&nbsp;
🐦 [X (Twitter)](https://x.com/AiBased37955)

</div>
