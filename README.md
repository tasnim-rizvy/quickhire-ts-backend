# QuickHire Backend — Node.js + Express + TypeScript

A fully-typed REST API built with **TypeScript**, **Express**, and **MongoDB (Mongoose)**.

## Project Structure

```
src/
├── config/
│   ├── db.ts              # MongoDB connection (singleton, serverless-safe)
│   └── env.ts             # Typed environment config with validation
├── controllers/
│   ├── jobController.ts         # GET/POST/PUT/DELETE /api/jobs
│   └── applicationController.ts # POST/GET/PATCH /api/applications
├── middleware/
│   ├── adminAuth.ts       # X-Admin-Key header guard
│   ├── validate.ts        # express-validator chains (typed)
│   └── errorHandler.ts    # Centralised error handling + AppError class
├── models/
│   ├── Job.ts             # Mongoose model + JobDocument interface
│   └── Application.ts     # Mongoose model + ApplicationDocument interface
├── routes/
│   ├── jobs.ts            # Job route definitions
│   └── applications.ts    # Application route definitions
├── types/
│   └── index.ts           # Enums, DTOs, response types
├── app.ts                 # Express app factory (testable, serverless-friendly)
├── server.ts              # HTTP server entry point
└── seed.ts                # Sample data seeder
api/
└── index.ts               # Vercel serverless adapter
```

## Quick Start

```bash
npm install
cp .env.example .env        # Fill in your values
npm run dev                  # Dev server on :5000 with hot reload
```

### Seed sample data
```bash
npm run seed
```

### Build for production
```bash
npm run build               # Compiles to /dist
npm start                   # Runs compiled JS
```

### Type check only
```bash
npm run type-check
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Port to listen on (default: 5000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `ADMIN_SECRET_KEY` | Yes | Secret key for admin endpoints |
| `FRONTEND_URL` | No | CORS origin (default: `*`) |
| `NODE_ENV` | No | `development` or `production` |

## API Reference

### Base URL
```
http://localhost:5000/api
```

### Jobs (Public)

| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| GET | `/jobs` | `search`, `category`, `type`, `location`, `page`, `limit` | List active jobs |
| GET | `/jobs/:id` | — | Get a single job |

### Jobs (Admin — requires `X-Admin-Key` header)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/jobs` | `CreateJobDTO` | Create a job |
| PUT | `/jobs/:id` | `UpdateJobDTO` | Update a job |
| DELETE | `/jobs/:id` | — | Delete a job + cascade applications |
| GET | `/jobs/:id/applications` | — | Get all applications for a job |

### Applications

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/applications` | Public | `CreateApplicationDTO` | Submit an application |
| GET | `/applications` | Admin | — | List all applications |
| GET | `/applications/:id` | Admin | — | Get a single application |
| PATCH | `/applications/:id/status` | Admin | `{ status }` | Update status |

### Admin Authentication

Add to all admin requests:
```
X-Admin-Key: your-secret-key
```

### Enums

**JobCategory:** `Engineering` | `Design` | `Marketing` | `Sales` | `Finance` | `HR` | `Product` | `Operations` | `Data` | `Other`

**JobType:** `Full-time` | `Part-time` | `Contract` | `Remote` | `Internship`

**ApplicationStatus:** `pending` | `reviewed` | `accepted` | `rejected`

## Deployment

### Railway (Recommended for persistent server)
1. Push to GitHub
2. New Railway project → connect repo
3. Set env vars in Railway dashboard
4. Railway uses `railway.toml` automatically — builds TS and starts

### Vercel (Serverless)
1. Push to GitHub
2. Import on vercel.com
3. Add environment variables in Vercel dashboard (use secrets for sensitive ones)
4. Vercel uses `vercel.json` — compiles `api/index.ts` as a serverless function

### Render
1. New Web Service → connect repo
2. Set env vars in Render dashboard
3. Uses `render.yaml` config automatically

## Example Requests

### Create a Job
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: quickhire-admin-2024" \
  -d '{
    "title": "Senior TypeScript Engineer",
    "company": "Acme Corp",
    "location": "Remote",
    "category": "Engineering",
    "type": "Full-time",
    "description": "We are looking for a skilled TypeScript engineer to join our growing platform team and help us scale our infrastructure...",
    "salary": "$130k – $170k"
  }'
```

### Submit an Application
```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "64abc123def456...",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "resume_link": "https://drive.google.com/file/...",
    "cover_note": "I have been working with TypeScript for 5 years and would love to contribute to your platform."
  }'
```
