# AgriPulse Backend

Production-ready Node.js backend for the AgriPulse agricultural marketplace platform.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Firebase Phone OTP + JWT |
| File Upload | Multer + Cloudinary |
| Real-time | Socket.IO |
| Scheduling | Node-Cron |
| Validation | Express-Validator |
| Security | Helmet, CORS, Rate Limiter |
| Docs | Swagger / OpenAPI |
| Logging | Winston + Morgan |
| Testing | Jest + Supertest |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL running locally or remotely
- Firebase project with Phone Authentication enabled
- Cloudinary account
- data.gov.in API key (for mandi prices)

### Installation

```bash
cd backend
cp .env.example .env       # then edit .env with your real values
npm install
npx prisma generate        # after database schema is added
npx prisma migrate dev     # run migrations
npm run dev                # start development server
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with nodemon |
| `npm start` | Start production server |
| `npm test` | Run tests with Jest |
| `npm run lint` | Lint source code |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio GUI |

## Architecture

```
src/
├── config/          # Configuration loaders
├── constants/       # Enums, roles, messages
├── controllers/     # Request handlers (MVC)
├── cron/            # Scheduled jobs
├── docs/            # Swagger specs
├── helpers/         # Reusable helper functions
├── middlewares/     # Express middleware
├── routes/          # Route definitions
├── services/        # Business logic
├── sockets/         # Socket.IO handlers
├── tests/           # Test suites
├── uploads/         # Temp file storage
├── utils/           # Utility functions
├── validations/     # Express-validator schemas
├── app.js           # Express app setup
└── server.js        # Entry point
```

## API Documentation

Once the server is running, visit:

```
http://localhost:5000/api-docs
```

## API Modules

- **Auth** – Register, Login (OTP), Logout, Refresh, Profile
- **Farmer** – Crop listing CRUD with image upload
- **Buyer** – Browse, search, filter, bookmark, enquire, purchase
- **Mandi** – Live prices, search, compare, trends, profit estimation
- **Marketplace** – Listings, ratings, reviews, transactions
- **Chat** – Real-time buyer-farmer messaging via Socket.IO
- **Notifications** – Price alerts with placeholder SMS/Push
- **Weather** – Placeholder weather service
- **Schemes** – Government scheme information
- **AI** – Placeholder endpoints for future ML integration

## Environment Variables

See `.env.example` for the full list of required environment variables.

## License

ISC
