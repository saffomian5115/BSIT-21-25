# 🚗 FourWheels — Pakistan's Vehicle Marketplace

A full-stack vehicle marketplace web application built as a Final Year Project (FYP). Buyers can browse and inquire about vehicles, sellers can list and manage their vehicles, and admins can approve/reject listings and manage users.

---

## 📁 Project Structure

```
FourWheels/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── multer.js          # File upload config
│   ├── controllers/
│   │   ├── authController.js  # Register, Login, GetMe
│   │   ├── vehicleController.js
│   │   ├── adminController.js
│   │   └── messageController.js (coming soon)
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect, adminOnly, sellerOnly
│   │   └── validate.js        # Input validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   ├── Message.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── vehicleRoutes.js
│   ├── scripts/
│   │   └── seedData.js        # Sample data inserter
│   ├── uploads/               # Uploaded images & models (gitignored)
│   ├── index.js               # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── index.html             # Home page
│   ├── login.html             # Login page
│   ├── register.html          # Registration page
│   ├── vehicles.html          # Browse all vehicles
│   ├── vehicle-detail.html    # Single vehicle with 3D viewer
│   ├── seller-dashboard.html  # Seller portal
│   ├── admin-dashboard.html   # Admin panel
│   ├── admin-login.html       # Admin login
│   └── 404.html               # Not found page
│
├── .env                       # Environment variables (gitignored)
├── .gitignore
└── README.md
```

---

## ⚙️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | HTML5, CSS3, Vanilla JavaScript     |
| Backend   | Node.js, Express.js v5              |
| Database  | MongoDB + Mongoose                  |
| Auth      | JWT (jsonwebtoken) + bcryptjs       |
| Upload    | Multer (images + 3D .glb/.gltf)     |
| 3D Viewer | Three.js (r128)                     |
| Charts    | Chart.js                            |

---

## 🚀 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/saffomian5115/FourWheals.git
cd FourWheals
```

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Create `.env` file in the root directory
```env
MONGO_URI=mongodb://localhost:27017/fourwheels
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
```

> **Note:** For MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

### 4. Seed sample data (optional but recommended)
```bash
node backend/scripts/seedData.js
```

This inserts:
- 4 test users (admin, 2 sellers, 1 buyer)
- 10 sample vehicles (cars, bikes, trucks)

### 5. Start the backend server
```bash
cd backend
npm run dev        # Development (nodemon)
npm start          # Production
```

Server runs on: `http://localhost:5000`

### 6. Open frontend
Open `frontend/index.html` in your browser, or use Live Server in VS Code.

---

## 🔑 Test Accounts (after seeding)

| Role   | Email                    | Password     |
|--------|--------------------------|--------------|
| Admin  | admin@fourwheels.pk      | password123  |
| Seller | ahmed@fourwheels.pk      | password123  |
| Seller | sara@fourwheels.pk       | password123  |
| Buyer  | ali@fourwheels.pk        | password123  |

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`
| Method | Endpoint                          | Access       | Description           |
|--------|-----------------------------------|--------------|-----------------------|
| POST   | `/register`                       | Public       | Create new account    |
| POST   | `/login`                          | Public       | Login & get JWT token |
| GET    | `/me`                             | Protected    | Get logged-in user    |
| GET    | `/admin/users`                    | Admin only   | Get all users         |
| PUT    | `/admin/users/:id/block`          | Admin only   | Block/unblock user    |
| DELETE | `/admin/users/:id`                | Admin only   | Delete user           |

### Vehicle Routes — `/api/vehicles`
| Method | Endpoint           | Access            | Description                     |
|--------|--------------------|-------------------|---------------------------------|
| GET    | `/`                | Public            | Get all approved vehicles       |
| GET    | `/:id`             | Public            | Get single vehicle (+ view++)   |
| GET    | `/my/listings`     | Seller/Admin      | Get seller's own vehicles       |
| POST   | `/`                | Seller/Admin      | Add new vehicle (with images)   |
| PUT    | `/:id`             | Seller(own)/Admin | Update vehicle                  |
| DELETE | `/:id`             | Seller(own)/Admin | Delete vehicle                  |

### Query Parameters (GET `/api/vehicles`)
```
?status=approved         Filter by status (approved/pending/rejected)
?category=car            Filter by category (car/bike/truck)
?city=Lahore             Filter by city
?minPrice=100000         Minimum price
?maxPrice=5000000        Maximum price
?search=corolla          Search in title/description/city
?page=1&limit=12         Pagination
```

---

## 🖼️ File Upload

- **Images:** JPEG, JPG, PNG, WEBP — max 10 per vehicle — stored in `backend/uploads/images/`
- **3D Models:** .glb or .gltf — max 1 per vehicle — stored in `backend/uploads/models/`
- **Max file size:** 50MB

---

## 👤 User Roles

| Role   | Capabilities                                                                 |
|--------|------------------------------------------------------------------------------|
| Buyer  | Browse listings, view vehicle details, send inquiries                        |
| Seller | All buyer capabilities + list vehicles, manage own listings, view messages   |
| Admin  | All seller capabilities + approve/reject vehicles, manage all users/listings |

---

## 📦 Modules Completed

- [x] Module 1 — Project Setup
- [x] Module 2 — Database Design
- [x] Module 3 — Auth System (Backend)
- [x] Module 4 — Auth Pages (Frontend)
- [x] Module 5 — Vehicle Listing (Backend)
- [x] Module 6 — Vehicle Pages (Frontend)
- [x] Module 7 — Vehicle Detail + 3D Viewer
- [x] Module 8 — Seller Dashboard
- [x] Module 9 — Admin Panel
- [ ] Module 10 — Messaging System (in progress)
- [ ] Module 11 — Search & Filter (partial)
- [ ] Module 12 — Reviews & Ratings
- [x] Module 13 — Testing & Finishing

---

## 🧪 Module 13 — Testing Checklist

- [ ] Test all APIs in Postman
- [x] Frontend error handling (loading states, error messages)
- [x] Form validations (frontend + backend)
- [x] 404 page
- [ ] Responsive design final check
- [x] Code cleanup
- [x] README.md
- [x] Sample data (10 vehicles, 4 users)

---

## 📝 Environment Variables

| Variable    | Description                         | Example                                   |
|-------------|-------------------------------------|-------------------------------------------|
| `MONGO_URI` | MongoDB connection string           | `mongodb://localhost:27017/fourwheels`    |
| `JWT_SECRET`| Secret key for JWT token signing    | `my_super_secret_key_change_in_prod`      |
| `PORT`      | Express server port (default: 5000) | `5000`                                    |

---

## 🤝 Contributing

This is an FYP project. For any issues or suggestions, open an issue on GitHub.

---

## 📄 License

ISC License — see `package.json`

---

*Built with ❤️ for FYP — FourWheels Team 2025*
