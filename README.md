## MissionTrack Backend

Smart digital system for streamlining employee business mission requests and approvals.

### Stack

- Node.js + TypeScript
- Express.js
- Sequelize (PostgreSQL)
- JWT auth with refresh tokens
- Role-based access control
- Nodemailer email jobs
- Multer file uploads

### Getting Started

```bash
npm install
cp env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

### Scripts

- `npm run dev` – start development server with hot reload
- `npm run build` – compile TypeScript to `dist`
- `npm start` – run compiled server
- `npm run db:migrate` / `npm run db:seed` – database operations via Sequelize CLI

### API

All routes are prefixed with `/api/v1`.

- `POST /auth/register-organization` – onboarding flow (with proof document upload)
- `POST /auth/login` + `POST /auth/refresh`
- Organization approvals, user management, missions, expenses, finance, notifications, audit logs (see `src/routes`)

### Tests & Quality

- `npm run lint` – TypeScript type-checking
- Logging via Winston, request logging via Morgan
- Error handling and validation middleware (Zod)



