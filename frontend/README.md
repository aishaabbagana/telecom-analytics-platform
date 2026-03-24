# Telecom Analytics Platform — Frontend

Aisha Abba-Gana | London Success Academy | Week 3 Assignment

## What is this?

A React dashboard that shows telecom call data with charts, tables, and filters. It connects to the backend API, requires login to access, and shows different features depending on whether you're an admin or analyst.

## What I used

- React (Vite) for the app
- Tailwind CSS for styling
- shadcn/ui for card components
- Recharts for charts
- Axios for API calls
- React Router for page navigation

## How to run it

1. Clone this repo
2. Run `npm install`
3. Make sure the backend is running on http://localhost:3000 (see backend repo)
4. Run `npm run dev`
5. Open http://localhost:5173 in your browser

## Login Details

- Admin: `admin@pinevox.com` / `admin123`
- Analyst: `analyst@pinevox.com` / `analyst123`

## What the dashboard shows

- **KPI Cards** — Total Calls, Average Duration, Total Cost, Successful Calls, Failed Calls
- **Call Duration Chart** — bar chart with longest, shortest, and average call duration
- **Call Cost Chart** — bar chart showing total cost for each city
- **Call Activity Chart** — line chart showing how many calls happened each hour
- **Calls by City Chart** — bar chart showing how many calls came from each city
- **Call Logs Table** — paginated table with search, showing 10 records per page
- **Top 10 Callers** — only visible to admin users

## How login and roles work

- You need to log in to see the dashboard. Without logging in, you get redirected to the login page.
- **Admin** can see everything, including the Top 10 Callers table
- **Analyst** can see the dashboard but the Top 10 Callers section shows "Admin Access Only"
- Login tokens expire after 1 hour. If the token expires, you'll need to log out and log back in to refresh it.

## Filtering

There's a filter bar at the top of the dashboard where you can filter by city and date range. When you click Filter, all the charts, KPI cards, and the table update to show only the filtered data.

## Backend Repo

https://github.com/aishaabbagana/telecom-backend-api