# GigFlow – Smart Leads Dashboard

This is the technical assignment submission for the "Smart Leads Dashboard" project. It is a full-stack MERN application designed with clean architecture, scalable code practices, and a modern, premium user experience.

## Features

- **Authentication System**: JWT-based login/register with `bcryptjs` password hashing and Role-Based Access Control (Admin/Sales).
- **Leads Management**: Full CRUD operations for Leads.
- **Advanced Filtering & Search**: Debounced search by Name/Email, filtering by Status & Source, and Sorting by date. Combinable filters.
- **Backend Pagination**: Uses `skip` and `limit` on the MongoDB query returning pagination metadata. Limit: 10 per page.
- **CSV Export**: Backend-generated CSV export based on current filters.
- **Premium UI**: Built with React, TailwindCSS, and Lucide icons. Includes loading states, empty states, form validation (React Hook Form + Zod), and a responsive layout.
- **Dark Mode Support**: Built-in dark mode toggle using Tailwind's `dark:` classes.

## Tech Stack

- **Frontend**: React (Vite), TypeScript, TailwindCSS, Zustand (Auth state), React Query (Server state caching).
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT.
- **Infrastructure**: Docker & Docker Compose.

## Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Docker & Docker Compose (Optional for containerized run)

## Setup Instructions (Local without Docker)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in the missing details:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

## Docker Setup

To run the entire application stack using Docker Compose:

1. Ensure Docker Desktop is running.
2. In the root directory of the project, run:
   ```bash
   docker-compose up --build
   ```
3. The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## API Documentation

### Auth Routes
- `POST /api/auth/register` - Register a new user (Body: `name`, `email`, `password`, `role`).
- `POST /api/auth/login` - Login and get JWT token (Body: `email`, `password`).
- `GET /api/auth/me` - Get current user profile (Requires Auth Header).

### Lead Routes
- `GET /api/leads` - Get paginated leads. (Query Params: `page`, `limit`, `search`, `status`, `source`, `sort`).
- `POST /api/leads` - Create a lead.
- `GET /api/leads/:id` - Get a single lead.
- `PUT /api/leads/:id` - Update a lead.
- `DELETE /api/leads/:id` - Delete a lead (Admin only).
- `GET /api/leads/export` - Export leads to CSV file (supports the same query params as GET leads).

## Author

Nayan
