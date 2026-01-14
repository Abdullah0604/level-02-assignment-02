# 🚗 Vehicle Rental System API

🔗 **Live API URL:** https://level-02-assignment-02-one.vercel.app
📦 **API Base URL:** `/api/v1`

---

## 🎯 Project Overview

The Vehicle Rental System API allows users to rent vehicles efficiently while enabling administrators to manage vehicles, users, and bookings.

### Core Capabilities

- Vehicle inventory management with availability tracking
- Customer account and profile management
- Vehicle booking, cancellation, and return handling
- Automatic rental cost calculation
- Secure authentication with role-based access control (Admin & Customer)

---

## ✨ Features

### 👤 Authentication & Authorization

- User registration and login using JWT
- Password hashing with bcrypt
- Role-based access control (Admin / Customer)
- Protected routes using Bearer token authentication

### 🚗 Vehicle Management (Admin)

- Add, update, view, and delete vehicles
- Track vehicle availability (`available`, `booked`)
- Prevent deletion if active bookings exist

### 📄 Booking Management

- Create vehicle bookings with date validation
- Automatic total price calculation
- Cancel bookings before rental start date
- Mark vehicles as returned and update availability
- Role-based booking access (Admin: all, Customer: own only)

### 👥 User Management

- Admin can manage all users
- Customers can update their own profile
- Prevent deletion if active bookings exist

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

## ⚙️ Setup & Usage

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/vehicle-rental-system.git
cd vehicle-rental-system
```
