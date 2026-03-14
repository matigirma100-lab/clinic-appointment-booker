# 🏥 Clinic Appointment Booker

A modern, full-stack clinic management and appointment booking system built with **Next.js 15**, **Supabase**, and **Tailwind CSS v4**. Designed with a premium, minimal UI inspired by Linear and Attio.

## ✨ Features

- **Dashboard** — Live stats (today's appointments, patients, revenue), vertical timeline of upcoming appointments, and quick-action buttons
- **Appointment List** — Sortable, filterable table with TanStack Table, status chips, and row actions (edit, delete, remind)
- **New Appointment Modal** — Glassy bottom-sheet modal with full form validation (patient, service, doctor, date/time)
- **Doctor Schedule** — Weekly calendar view of doctor availability
- **Settings** — Manage doctors, services, and clinic hours
- **Reports** — Analytics and charting with Recharts

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Tables | TanStack Table v8 |
| Icons | Lucide React |
| Charts | Recharts |
| Language | TypeScript |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project

### Installation

```bash
git clone https://github.com/matigirma100-lab/clinic-appointment-booker.git
cd clinic-appointment-booker
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📦 Deployment

This project is optimized for deployment on **Vercel**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/matigirma100-lab/clinic-appointment-booker)

After deploying, add the environment variables in the Vercel dashboard under **Project Settings → Environment Variables**.

## 📁 Project Structure

```
clinic-appointment-booker/
├── app/                    # Next.js App Router pages & layouts
│   ├── (dashboard)/        # Dashboard route group
│   ├── list/               # Appointment list page
│   ├── schedule/           # Doctor schedule page
│   ├── reports/            # Reports & analytics page
│   └── settings/           # Settings management page
├── components/             # Reusable UI components
│   ├── ui/                 # Base UI components
│   └── ...
├── lib/                    # Supabase client, utilities
└── public/                 # Static assets
```

## 📄 License

MIT
