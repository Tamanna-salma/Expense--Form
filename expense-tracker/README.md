# 💰 Expense Tracker

A full-stack expense management application built with **Next.js 15**, **Express.js**, **MongoDB**, and **TypeScript** — featuring real-time CRUD, analytics, and category/date filters.

---

## ✨ Features

- ➕ **Create** expenses with title, amount, category, and date
- 📋 **Read** all expenses in a responsive table (desktop) / cards (mobile)
- ✏️ **Edit** expenses via a pre-filled form
- 🗑️ **Delete** expenses with a confirmation dialog
- 🔍 **Filter** by category (Food, Transport, Shopping, Others)
- 📅 **Date range filter** (start date → end date)
- 📊 **Pie Chart** analytics (spending by category, powered by Recharts)
- 💬 **Toast notifications** for all CRUD operations
- ⏳ **Loading skeletons** and **empty state** messages
- 📱 **Fully responsive** — mobile, tablet, and desktop

---

## 🛠 Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| Next.js 15 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React Hook Form + Zod | Form handling & validation |
| Axios | HTTP client |
| Recharts | Data visualization |
| Lucide React | Icons |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database & ODM |
| dotenv | Environment config |
| CORS | Cross-origin requests |

---

## 📁 Folder Structure

```
expense-tracker/
├── client/                         # Next.js 15 frontend
│   ├── app/
│   │   ├── globals.css             # Global styles & animations
│   │   ├── layout.tsx              # Root HTML layout
│   │   └── page.tsx                # Main application page
│   ├── components/
│   │   └── custom/
│   │       ├── ConfirmDialog.tsx   # Delete confirmation modal
│   │       ├── ExpenseChart.tsx    # Recharts Pie Chart
│   │       ├── ExpenseForm.tsx     # Create / Edit form
│   │       ├── ExpenseList.tsx     # Table + mobile card list
│   │       ├── FilterBar.tsx       # Category & date filters
│   │       ├── Navbar.tsx          # Top navigation bar
│   │       ├── Summary.tsx         # Total expense summary card
│   │       └── Toast.tsx           # Notification toast
│   ├── lib/
│   │   └── utils.ts                # Tailwind cn() merge utility
│   ├── services/
│   │   └── expenseService.ts       # All Axios API functions
│   ├── .env.example                # Frontend env template
│   └── package.json
│
└── server/                         # Express.js backend
    ├── src/
    │   ├── config/
    │   │   └── db.ts               # MongoDB connection
    │   ├── controllers/
    │   │   └── expense.controller.ts  # CRUD handlers
    │   ├── middlewares/
    │   │   └── error.middleware.ts    # Global error handler
    │   ├── models/
    │   │   └── Expense.ts          # Mongoose schema & model
    │   ├── routes/
    │   │   └── expense.routes.ts   # API route definitions
    │   └── index.ts                # Server entry point
    ├── .env.example                # Backend env template
    └── package.json
```

---

## ⚙️ Installation

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local instance or [MongoDB Atlas](https://cloud.mongodb.com) free tier)
- **npm** v9+

### 1 — Clone the repository

```bash
git clone https://github.com/Tamanna-salma/Expense--Form.git
cd Expense--Form/expense-tracker
```

### 2 — Install backend dependencies

```bash
cd server
npm install
```

### 3 — Install frontend dependencies

```bash
cd ../client
npm install
```

---

## 🔐 Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/expense-tracker?retryWrites=true&w=majority
```

Copy the template:
```bash
cp server/.env.example server/.env
```

### Frontend (`client/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Copy the template:
```bash
cp client/.env.example client/.env.local
```

---

## 🚀 Running the Application

### Start the backend server

```bash
cd server
npm run dev
```
> Server starts on **http://localhost:5000**

### Start the frontend (in a new terminal)

```bash
cd client
npm run dev
```
> App opens at **http://localhost:3000**

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/expenses` | Create a new expense |
| `GET` | `/expenses` | Get all expenses |
| `GET` | `/expenses/:id` | Get a single expense |
| `PATCH` | `/expenses/:id` | Update an expense |
| `DELETE` | `/expenses/:id` | Delete an expense |

### Expense Schema

```json
{
  "title": "Groceries",
  "amount": 45.50,
  "category": "Food",
  "date": "2026-06-30"
}
```

**Valid categories:** `Food` | `Transport` | `Shopping` | `Others`

### Example Response

```json
{
  "success": true,
  "data": {
    "_id": "64abc...",
    "title": "Groceries",
    "amount": 45.50,
    "category": "Food",
    "date": "2026-06-30T00:00:00.000Z",
    "createdAt": "2026-06-30T...",
    "updatedAt": "2026-06-30T..."
  }
}
```

---

## ☁️ Deployment

### Frontend → Vercel

1. Push the repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo.
3. Set **Root Directory** to `expense-tracker/client`.
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
   ```
5. Click **Deploy**.

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service** → Connect repo.
2. Set **Root Directory** to `expense-tracker/server`.
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `npm start`
5. Add environment variables:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://...
   ```
6. Click **Create Web Service**.

> After deploying the backend, update `NEXT_PUBLIC_API_URL` in the Vercel project settings to the Render service URL.

---

## 🧑‍💻 Development Scripts

| Command | Location | Purpose |
|---|---|---|
| `npm run dev` | `server/` | Start backend in watch mode |
| `npm run build` | `server/` | Compile TypeScript to `dist/` |
| `npm start` | `server/` | Run compiled backend |
| `npm run dev` | `client/` | Start Next.js dev server |
| `npm run build` | `client/` | Build production bundle |
| `npm start` | `client/` | Serve production build |

---

## 📝 License

MIT — feel free to fork and use for your own projects.
