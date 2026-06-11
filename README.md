# Quick Campus — University ERP

A full-stack University ERP system built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## Project Structure

```
Quick Campus/
├── Frontend/          # React + Vite frontend (Tailwind CSS)
│   ├── public/
│   ├── src/
│   ├── index.html
│   └── package.json
├── server/            # Node.js + Express backend
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   ├── .env.example   ← copy this to .env and fill in your values
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Brevo account for email (optional)

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/quick-campus.git
cd quick-campus
```

---

### 2. Set up the Backend

```bash
cd server
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Then open `server/.env` and fill in your values:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_email@example.com
BREVO_SENDER_NAME=Quick Campus
```

Start the server:

```bash
npm run dev       # development (with auto-reload)
npm start         # production
```

---

### 3. Set up the Frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS        |
| Backend   | Node.js, Express 5                  |
| Database  | MongoDB Atlas via Mongoose          |
| Auth      | JWT + bcryptjs                      |
| Email     | Brevo (via @getbrevo/brevo)         |
| SMS       | Twilio                              |

---

## Environment Variables

All secrets are stored in `server/.env` which is **git-ignored**.  
A safe template is provided in `server/.env.example` — copy it and fill in real values locally.

> ⚠️ Never commit your `.env` file. It contains sensitive credentials.
