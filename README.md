<div align="center">
  
# 🚀 AssetFlow
**The Intelligent Asset Management Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

*AssetFlow is a next-generation asset lifecycle and employee request management system built to solve real-world organizational bottlenecks. Designed with a premium, consumer-grade UI and enterprise-grade architecture.*

</div>

---

## 🌟 Why AssetFlow? (The Problem We Solve)

Organizations lose countless hours tracking down equipment, managing spreadsheets, and resolving conflicts when multiple employees need the same resources. AssetFlow replaces friction with fluidity by providing a **unified source of truth** for your organization's physical assets.

Whether you're an **Admin** managing company-wide hardware, a **Department Head** overseeing your team's budget, or an **Employee** checking out a laptop, AssetFlow delivers a hyper-optimized, role-specific experience.

## ✨ Key Features

### 🏢 For Employees
- **Self-Service Dashboard**: Instantly view assigned assets, report maintenance issues, and track return dates.
- **Smart Bookings & Transfers**: Request to borrow assets from other departments or seamlessly transfer ownership when a project is completed.
- **Conflict Resolution**: If an asset is already booked, the system natively suggests and facilitates a transfer request.

### 🛡️ For Admins & Department Heads
- **Real-Time Analytics & KPIs**: Bird's-eye view of total assets, utilization rates, pending maintenance, and departmental distribution.
- **Granular Access Control**: Robust Role-Based Access Control (RBAC) separating Employees, Department Heads, and Admins.
- **Complete Audit Trail**: Every allocation, transfer, and return is immutably logged for compliance and accountability.

### ⚡ Technical Excellence
- **Secure by Default**: JWT-based stateless authentication, HTTP-only session cookies, Argon2 password hashing, and OTP email verification.
- **Dynamic & Responsive UI**: Built with Shadcn UI and Tailwind CSS, featuring subtle micro-animations, glassmorphism, and a meticulously crafted color palette.
- **Blazing Fast**: Powered by Next.js 15 Server Components, React Query for optimistic UI updates, and Prisma ORM for efficient database queries.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS, Shadcn UI, Framer Motion |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | PostgreSQL, Prisma ORM |
| **Authentication**| Custom JWT Auth, Argon2, Nodemailer (OTP Verification) |
| **State Management**| Tanstack Query (React Query), Axios |

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd AssetFlow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory with the following configuration:
```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/assetflow?schema=public"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"

# SMTP for Email Verification (Optional for local testing)
SMTP_HOST="smtp.example.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-email-password"
```

### 4. Setup Database
Run the Prisma migrations to establish the database schema and seed the initial data:
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 Roles & Testing

You can test the application using the following roles (ensure you run the database seeds if applicable):

- **Admin Access**: Can manage all assets, departments, users, and view global KPIs.
- **Department Head**: Can approve/reject transfer requests and view department-specific analytics.
- **Employee**: Can view their own assets, request bookings, and report issues.

---
<div align="center">
<i>Built with passion for seamless organizational workflows.</i>
</div>
