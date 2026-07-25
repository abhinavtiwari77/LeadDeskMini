# LeadDesk Mini

LeadDesk Mini is a modern, high-performance SaaS lead capture and management system built with the MERN stack (MongoDB, Express, React, Node.js). It features a sleek Linear/Vercel-inspired public landing page with real-time validated lead capture and a Clerk/Notion-inspired Admin Dashboard protected by HttpOnly JWT cookies.

---

## Features

- **Public Landing Page:** Minimalist modern SaaS aesthetic with Hero section, feature breakdown, trust indicators, and lead capture form.
- **Strict Multi-Layer Validation:** Full validation on both client (React Hook Form + Zod) and server (Express + Zod), returning HTTP `420/422` or `400` on payload violations.
- **Secure Admin Authentication:** JWT authentication delivered via `HttpOnly`, `SameSite=Lax/None` cookies to mitigate XSS risks.
- **Real-Time Admin Lead Desk:** Interactive dashboard at `/admin` featuring debounced search (by name or email), status filtering, real-time MongoDB status updates, and interactive status change confirmation modals.
- **Polished UI/UX & Micro-Interactions:** Smooth Framer Motion animations, skeleton loaders instead of basic spinners, custom toast notification system, and zero placeholders.
- **Mandatory Footer:** Displayed across all pages: `"Built for Digital Heroes Training Task"` linked to `https://digitalheroesco.com`.

---

## Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** TailwindCSS with custom glassmorphism utilities & Outfit/Inter font stack
- **Routing:** React Router DOM v6
- **Form & Validation:** React Hook Form, Zod, `@hookform/resolvers`
- **Animations & Icons:** Framer Motion, Lucide React
- **HTTP Client:** Axios with `withCredentials: true`

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB Atlas with Mongoose ODM
- **Security:** JWT (jsonwebtoken), bcryptjs, Helmet, CORS, Cookie-Parser
- **Validation:** Zod schema validation middleware

---

## Architecture & Design Decisions

LeadDesk Mini strictly follows standard MVC (Model-View-Controller) clean architecture to separate routing, request validation, business logic, and error handling.

```
LeadDeskMini/
├── client/                 # React (Vite) Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, Footer, StatusBadge, ConfirmModal, Toast, Skeletons)
│   │   ├── context/        # AuthContext & ToastContext
│   │   ├── pages/          # LandingPage, LoginPage, DashboardPage
│   │   ├── services/       # Axios client with interceptors
│   │   ├── index.css       # Design tokens & glassmorphism utilities
│   │   ├── App.jsx         # App router & layout container
│   │   └── main.jsx        # Client entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node.js Express Backend (MVC)
│   ├── src/
│   │   ├── config/         # MongoDB Mongoose connection
│   │   ├── controllers/    # authController, leadController
│   │   ├── middleware/     # authMiddleware, validateMiddleware, errorHandler
│   │   ├── models/         # Lead.js, Admin.js
│   │   ├── routes/         # authRoutes, leadRoutes
│   │   ├── scripts/        # seedAdmin.js script
│   │   ├── utils/          # ApiError, asyncWrapper, jwt helpers, Zod validationSchemas
│   │   └── index.js        # Express server entry point
│   ├── .env.example
│   └── package.json
│
├── README.md               # Main Documentation
└── LOOM_SCRIPT.md          # 2-3 Minute Walkthrough Script
```

---

## Data Models & JWT Cookie Security

### Lead Model
```json
{
  "name": "String (required, 2-100 chars)",
  "email": "String (required, valid email)",
  "budget": "Enum: ['< $500', '$500-$1000', '$1000-$5000', '> $5000']",
  "message": "String (required, 10-2000 chars)",
  "status": "Enum: ['New', 'Contacted', 'Closed'] (default: 'New')",
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

### Admin Model
```json
{
  "email": "String (required, unique)",
  "password": "String (bcrypt hashed, min 6 chars)"
}
```

### Why JWT + HttpOnly Cookies Were Chosen
1. **XSS Protection:** Storing JWT tokens in `localStorage` or `sessionStorage` leaves applications vulnerable to cross-site scripting (XSS) attacks where malicious scripts can read tokens. HttpOnly cookies cannot be accessed via JavaScript.
2. **CSRF Mitigation:** Configured with `SameSite=Lax` (or `None` with `Secure` in HTTPS environments) and CORS credential checks to prevent cross-site forgery.
3. **Seamless State Sync:** Web browsers automatically attach `HttpOnly` cookies to API requests, eliminating complex manual token-header injection logic in frontend code.

---

## Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/leaddesk_mini?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_leaddesk_mini_2026_prod
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@leaddesk.com
ADMIN_PASSWORD=Admin@123456
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Demo Admin Credentials

For testing and reviewing the protected Admin Dashboard (`/admin`):

- **Email:** `admin@leaddesk.com`
- **Password:** `Admin@123456`

*(The login screen also provides a 1-click **Auto-fill** button for instant demo access)*

---

## Installation & Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI or local MongoDB instance

### 1. Backend Setup
```bash
cd server
npm install
# Seed the default admin user into MongoDB
npm run seed
# Start backend server
npm run dev
```
The server will run on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

---

## API Endpoints Spec

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/leads` | Public | Submit new lead (creates record with status `New`) |
| **GET** | `/api/leads` | Private (Admin) | Retrieve all leads (supports `?search=` and `?status=`) |
| **PATCH** | `/api/leads/:id/status` | Private (Admin) | Update lead status (`New`, `Contacted`, `Closed`) |
| **POST** | `/api/auth/login` | Public | Authenticate admin & set `HttpOnly` cookie |
| **POST** | `/api/auth/logout` | Private (Admin) | Clear authentication cookie |
| **GET** | `/api/auth/me` | Private (Admin) | Check current authenticated admin profile |

---

## Deployment Guide

### Frontend Deployment (Vercel)
1. Import `client/` folder or repository root into Vercel.
2. Set Build Command: `npm run build` and Output Directory: `dist`.
3. Set Environment Variable: `VITE_API_URL=https://<your-render-backend-url>/api`.

### Backend Deployment (Render)
1. Deploy `server/` as a Render Web Service.
2. Set Build Command: `npm install` and Start Command: `npm start`.
3. Set Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=https://<your-vercel-app>.vercel.app`.

---

## AI Usage Statement

"I used AI tools to accelerate implementation, verify edge cases, refine documentation, and review the code. The overall architecture, UI decisions, validation flow, authentication approach, and final implementation were manually reviewed and refined."

---

## Future Improvements

1. **Email Notifications:** Trigger automated webhook or SendGrid/Resend emails when new leads arrive.
2. **Export to CSV:** Provide a 1-click export button inside the Admin Dashboard for reporting.
3. **Activity Audit Logs:** Track timestamped history of status updates per lead.
