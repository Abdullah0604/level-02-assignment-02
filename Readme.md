# 🚗 Vehicle Rental System API

🔗 **Live API URL:** https://level-02-assignment-02-one.vercel.app <br>
📦 **API Base URL:** `https://level-02-assignment-02-one.vercel.app/api/v1`

---

## 🎯 Project Overview

The Vehicle Rental System API allows users to rent vehicles efficiently while enabling administrators to manage vehicles, users, and bookings.

## ✨ Features

### 1. Authentication & Authorization

- Secure user registration and login with JWT-based authentication
- Passwords are hashed using bcrypt before database storage
- Role-based access control (RBAC) implemented for Admin and Customer users

### 2. Vehicle Management (Admin)

- Admin can create, update, view, and delete vehicles
- Real-time vehicle availability tracking (`available`, `booked`)
- Vehicle deletion is restricted if active bookings exist

### 3. Booking Management

- Customers can book available vehicles with start and end date validation
- Automatic rental cost calculation based on daily rate and rental duration
- Customers can cancel bookings before the rental start date
- Admin can mark bookings as returned, automatically updating vehicle availability
- Role-based booking visibility:
  - Admin can view all bookings
  - Customer can view own bookings only

### 4. User Management

- Admin can view and manage all user accounts
- Customers can update only their own profile information
- User deletion is restricted if active bookings exist

---

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt
- **Architecture:** Modular, feature-based structure

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/Abdullah0604/level-02-assignment-02.git
cd level-02-assignment-02
```

## 2. Install dependencies

```bash
    npm install
```

## 3. Environment Variables

Create a .env file in the root directory and add the following:

```bash
    PORT=5000
    CONNECTION_STR=your_postgresql_database_connection_string
    JWT_SECRET=your_jwt_secret
```

## 4. Run The Application

```bash
    npm run dev
```

---

## 📌 API Usage (Feature-wise Endpoints)

### 1. Authentication

- POST `/api/v1/auth/signup` — Register a new user
- POST `/api/v1/auth/signin` — Login and receive JWT token

---

### 2. Vehicle Management

- POST `/api/v1/vehicles` — Add a new vehicle (Admin only)
- GET `/api/v1/vehicles` — Get all vehicles (Public)
- GET `/api/v1/vehicles/:vehicleId` — Get vehicle details (Public)
- PUT `/api/v1/vehicles/:vehicleId` — Update vehicle details (Admin only)
- DELETE `/api/v1/vehicles/:vehicleId` — Delete vehicle (Admin only)

---

### 3. Booking Management

- POST `/api/v1/bookings` — Create a booking (Customer / Admin)
- GET `/api/v1/bookings` — Get bookings
  - Admin: all bookings
  - Customer: own bookings only
- PUT `/api/v1/bookings/:bookingId` — Update booking status
  - Customer: cancel booking
  - Admin: mark as returned

---

### 4. User Management

- GET `/api/v1/users` — Get all users (Admin only)
- PUT `/api/v1/users/:userId` — Update user profile (Admin / Own)
- DELETE `/api/v1/users/:userId` — Delete user (Admin only)
