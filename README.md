# IKA Frontend

**International Knowledge Academy** — Training & Management Development Platform.

React + TypeScript frontend for the IKA public website, admin dashboard, and account manager panel.

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
| PDF Generation | @react-pdf/renderer |

---

## Project Structure

```
src/
├── api/              # Axios instance + auth interceptors
├── assets/           # Static assets and content copy
├── components/       # Reusable UI components (organized by feature)
│   ├── home/         # Public-facing components (Navbar, Footer, sections)
│   ├── pdf/          # PDF document templates
│   └── ui/           # Shared UI primitives (PageHeader, MediaUploadField, etc.)
├── context/          # React context (Auth, AppData, Toast)
├── hooks/            # API hooks organized by resource
├── layouts/          # Layout wrappers (home, auth, admin, manager)
├── types/            # TypeScript interfaces
└── views/            # Page components
    ├── home/         # Public pages
    ├── admin/        # Admin dashboard pages
    └── account-manager/ # Account manager panel pages
```

---

## Pages

### Public
| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About IKA |
| `/programs` | Program listings |
| `/programs/:uid` | Program detail + quotation download |
| `/contact` | Contact |
| `/register/club` | Club (camp) registration form |

### Admin (protected — admin role)
| Route | Page |
|---|---|
| `/admin/default` | Dashboard |
| `/admin/users` | User management |
| `/admin/trainers` | Trainer management |
| `/admin/programs` | Program management |
| `/admin/registrations` | Registration management |
| `/admin/payments` | Payment management |
| `/admin/locations` | Location management |
| `/admin/categories` | Category management |
| `/admin/fields` | Field management |
| `/admin/services` | Services management |
| `/admin/partnerships` | Partnership management |
| `/admin/certificates` | Certificate management |
| `/admin/feedbacks` | Feedback management |
| `/admin/contact` | Contact submissions |
| `/admin/emails` | Mailing list (subscribers) |
| `/admin/clubs` | Club (camp) management |
| `/admin/club-registrations` | Club registration submissions |
| `/admin/club-registrations/:uid` | Registration detail |
| `/admin/club-registrations/:uid/edit` | Edit registration |
| `/admin/referral-codes` | Referral code management |

### Account Manager (protected — manager role)
| Route | Page |
|---|---|
| `/account-manager/dashboard` | Dashboard |
| `/account-manager/programs` | Program management |
| `/account-manager/registrations` | Registration management |
| `/account-manager/payments` | Payment management |
| `/account-manager/trainers` | Trainer management |
| `/account-manager/locations` | Location management |
| `/account-manager/categories` | Category management |
| `/account-manager/fields` | Field management |
| `/account-manager/services` | Services management |
| `/account-manager/partnerships` | Partnership management |
| `/account-manager/certificates` | Certificate management |
| `/account-manager/feedbacks` | Feedback management |
| `/account-manager/contact` | Contact submissions |
| `/account-manager/emails` | Mailing list (subscribers) |
| `/account-manager/clubs` | Club (camp) management |
| `/account-manager/club-registrations` | Club registration submissions |
| `/account-manager/club-registrations/:uid` | Registration detail |
| `/account-manager/club-registrations/:uid/edit` | Edit registration |
| `/account-manager/referral-codes` | Referral code management |

---

## Key Features

- **Quotation PDF** — Program detail page generates a branded PDF quotation via `@react-pdf/renderer`. Download is gated behind a soft lead-capture modal (email + phone) that subscribes the user to the mailing list before triggering the download.
- **Mailing List** — Subscribers collected via the quotation flow are visible in both admin and manager panels at `/emails`.
- **Location Thumbnails** — Locations support an image thumbnail (uploaded via presigned S3 URL) displayed on the public home page location cards.
- **Media Uploads** — All image fields use `MediaUploadField` + `usePresignedUpload` for direct S3 upload; the API receives only the file key.
- **Presigned Downloads** — Files (brochures, CVs, etc.) are fetched on-demand via `usePresignedDownload`, which POSTs to `/storage/presigned-download-url` and opens the returned URL.
- **Clubs (Camps)** — Full management flow: list, detail, create/edit in both panels. Public registration form at `/register/club` with club selector and referral source field.
- **Club Registrations** — Submissions tracked with status workflow (pending → interview scheduled → accepted/rejected). Detail pages show full club info alongside participant and guardian details.
- **Referral Codes** — Influencer referral codes managed in both panels; linked to club registrations.
- **Dynamic CarouselHero** — Home page hero carousel shows one static corporate slide followed by open then upcoming camp slides pulled from the API. Camp slides include a brochure download button when a brochure file is available.
- **Role-based panels** — Admin and Account Manager views are always separate files; never shared.

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
| `staging` | Staging | `staging.ika-edu.com` |

**Workflow:**
```
feature/xxx  →  PR  →  staging  (auto-deploys to staging)
                                ↓  review & QA
             staging  →  PR  →  main  (auto-deploys to production)
```

Deployments are handled via **Vercel**. Environment variables are configured per environment in the Vercel dashboard — never commit `.env` to git.

---

## Environment Variables

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Backend API base URL (no trailing slash) |
