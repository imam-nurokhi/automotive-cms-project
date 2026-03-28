# AutoFlow – Premium Automotive Workshop Management System

## Overview

AutoFlow is a full-stack content management system (CMS) tailored for automotive workshops. It enables workshop staff to manage vehicle service records, inventory, customer bookings, and promotions — all from a single, modern web interface.

Built with **Next.js 16**, **Prisma 7**, **PostgreSQL**, and **NextAuth v5**, it provides a secure, role-based platform for customers, mechanics, and administrators.

## Features

- **Marketing site** – Public-facing landing page showcasing services and active promotions.
- **Customer dashboard** – Customers can register their vehicles, view service history, and book appointments.
- **Admin panel** – Admins can manage inventory, services, bookings, and view analytics.
- **Role-based access control** – Three roles: `CUSTOMER`, `MECHANIC`, and `ADMIN`, enforced via middleware and NextAuth sessions.
- **Authentication** – Credential-based login and registration with hashed passwords (bcryptjs).

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database ORM | Prisma 7 (PostgreSQL) |
| Authentication | NextAuth v5 (Auth.js) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Animations | Framer Motion |

## Project Structure

```
src/
├── actions/          # Server actions (bookings, vehicles, services)
├── app/
│   ├── (admin)/      # Admin route group (inventory, services, analytics)
│   ├── (dashboard)/  # Customer route group (dashboard, bookings)
│   ├── (marketing)/  # Public marketing pages
│   ├── api/          # API route handlers
│   ├── login/        # Login page
│   └── register/     # Registration page
├── components/
│   ├── admin/        # Admin-specific UI components
│   ├── dashboard/    # Customer dashboard components
│   ├── marketing/    # Marketing/landing page components
│   └── ui/           # Shared UI primitives (Button, Card, Modal, etc.)
├── lib/              # Shared utilities (auth config, Prisma client, helpers)
└── types/            # TypeScript type augmentations (e.g., NextAuth session)
prisma/
├── schema.prisma     # Database schema
└── seed.ts           # Database seed script
```

## Prerequisites

- **Node.js** v18 or later
- **PostgreSQL** database (local or hosted, e.g., Neon, Supabase, Railway)
- **npm** (or yarn / pnpm / bun)

## Local Development

### 1. Clone and install dependencies

```bash
git clone https://github.com/imam-nurokhi/automotive-cms-project.git
cd automotive-cms-project
npm install
```

### 2. Configure environment variables

Create a `.env` file at the project root:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
AUTH_SECRET="your-random-secret"        # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Set up the database

```bash
# Push the Prisma schema to your database
npx prisma db push

# (Optional) Seed the database with sample data
npx prisma db seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma db seed` | Seed the database with sample data |

## Database Schema

The data model covers the following entities:

- **User** – Workshop customers, mechanics, and admins (role-based).
- **Vehicle** – Customer-owned vehicles (linked to service records and bookings).
- **ServiceRecord** – Work orders with line items, costs, status, and assigned mechanic.
- **Inventory** – Parts and supplies with stock levels and minimum thresholds.
- **ServiceItem** – Individual parts/services consumed in a work order.
- **Booking** – Customer appointment scheduling (date, time slot, service type).
- **Promo** – Time-limited promotions displayed on the marketing site.

## Deployment

The recommended deployment platform is [Vercel](https://vercel.com/new). Set the required environment variables (`DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`) in the Vercel project settings, then connect your repository for automatic deployments on push.

For other platforms, run `npm run build` followed by `npm run start`. Ensure a PostgreSQL instance is accessible at the configured `DATABASE_URL`.

## Contributing

1. Check existing issues before opening a new one.
2. Fork the repository and create a feature branch.
3. Open a pull request that references the relevant issue, explains the motivation, and keeps this README in sync with any notable changes.

## License

This project is private. Licensing terms will be documented once the project is made public.
