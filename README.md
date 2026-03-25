# Telecom Analytics Platform

A full-stack application for visualizing telecom Call Data Records (CDR). Built with React, Express, and MongoDB.

## Live Demo

- **Frontend:** [telecom-analytics-platform.vercel.app](https://telecom-analytics-platform.vercel.app)
- **Backend API:** [telecom-analytics-platform.onrender.com](https://telecom-analytics-platform.onrender.com)

> The backend may take ~50 seconds to wake up on first request (Render free tier).

## Test Accounts

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Admin   | admin@pinevox.com      | admin123   |
| Analyst | analyst@pinevox.com    | analyst123 |

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Recharts, shadcn/ui
- **Backend:** Node.js, Express, MongoDB Atlas, JWT Auth

## Features

- JWT authentication with admin/analyst roles
- KPI cards, interactive charts, and activity timeline
- Paginated and searchable call logs table
- Top callers view (admin only)
- Dynamic filters by city and date range

## Local Development

```bash
# Backend
cd backend-api
npm install
# Add .env with MONGODB_URI and JWT_SECRET
node seedDatabase.js
node index.js

# Frontend
cd frontend
npm install
# Add .env with VITE_API_URL=http://localhost:3000/api
npm run dev
```