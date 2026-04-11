# IKA Frontend

**International Knowledge Academy** — Training & Management Development Platform.

React + TypeScript frontend for the IKA public website and admin dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| Animations | Framer Motion |
| Icons | React Icons, Lucide React |
| Charts | ApexCharts |
| Tables | TanStack React Table |

---

## Project Structure

```
src/
├── api/              # Axios instance + auth interceptors
├── components/       # Reusable UI components (organized by feature)
├── context/          # React context (Auth, Toast)
├── hooks/            # API hooks (auth, users, courses, programs, locations, categories)
├── layouts/          # Layout wrappers (home, auth, admin, manager)
├── types/            # TypeScript interfaces
├── views/            # Page components
│   ├── home/         # Public pages (home, about, categories, training, programs, contact)
│   └── admin/        # Admin dashboard pages
└── App.tsx           # Route configuration
```

---

## Pages

### Public
| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About IKA |
| `/categories` | Training Categories hub |
| `/categories/training-development` | Training & Development |
| `/categories/international-youth` | International & Youth Programs |
| `/categories/research` | Research and Knowledge Services |
| `/training` | Course listings |
| `/programs` | Program listings |
| `/programs/:uid` | Program detail |
| `/contact` | Contact |

### Admin (protected — admin role)
| Route | Page |
|---|---|
| `/admin/default` | Dashboard |
| `/admin/users` | User management |
| `/admin/courses` | Course management |
| `/admin/programs` | Program management |
| `/admin/locations` | Location management |
| `/admin/categories` | Category management |

---

## Getting Started

### Prerequisites
- Node.js LTS
- Access to the IKA backend API

### Installation

```bash
git clone https://github.com/International-Knowledge-Academy/dev-frontend.git
cd dev-frontend
npm install
```

### Environment Setup

Copy the example env file and fill in your API URL:

```bash
cp .env.example .env
```

```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

### Run Locally

```bash
npm start
```

### Build for Production

```bash
npm run build
```

---

## Branching & Deployment

| Branch | Environment | Domain |
|---|---|---|
| `main` | Production | `ika-edu.com` |
| `dev` | Staging | `dev.ika-edu.com` |

**Workflow:**
```
feature/xxx  →  PR  →  dev  (auto-deploys to staging)
                             ↓  review & QA
             dev  →  PR  →  main  (auto-deploys to production)
```

Deployments are handled via **Vercel**. Environment variables (`REACT_APP_API_URL`) are configured per environment in the Vercel dashboard — never commit `.env` to git.

---

## Environment Variables

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Backend API base URL (no trailing slash) |
