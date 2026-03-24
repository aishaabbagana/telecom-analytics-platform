# Telecom Analytics Platform — Backend

Aisha Abba-Gana | London Success Academy | Week 3 Assignment

## What is this?

This is the backend server for the Telecom Analytics Dashboard. It stores call data in a database, handles user login/signup, and sends data to the frontend through API endpoints.

## What I used

- Node.js and Express for the server
- MongoDB Atlas for the database
- JWT for login tokens
- bcrypt for password security

## How to run it

1. Clone this repo
2. Run `npm install`
3. Create a `.env` file with your MongoDB connection string and a JWT secret:
   ```
   MONGODB_URI=your_connection_string
   JWT_SECRET=your_secret
   ```
4. Seed the database: `node seedDatabase.js`
5. Start the server: `node index.js`
6. Server runs on http://localhost:3000

## API Endpoints

**Login/Signup:**
- POST `/api/auth/register` — create a new account
- POST `/api/auth/login` — log in and get a token

**Call Data (need to be logged in):**
- GET `/api/cdrs` — get call records (paginated)
- GET `/api/cdrs/filter` — filter by city, number, or date
- GET `/api/cdrs/analytics/total-calls` — total number of calls
- GET `/api/cdrs/analytics/total-duration` — total call duration
- GET `/api/cdrs/analytics/call-distribution` — incoming vs outgoing
- GET `/api/cdrs/analytics/top-callers` — top 10 callers (admin only)

## Login Details

- Admin: `admin@pinevox.com` / `admin123`
- Analyst: `analyst@pinevox.com` / `analyst123`

## How authentication works

1. User signs up with an email, password, and role (admin or analyst)
2. Password gets hashed before saving to the database
3. When logging in, the server checks the password and sends back a JWT token
4. The token is sent with every request so the server knows who you are
5. Some endpoints (like top callers) are only available to admins