# TaskPilot Server
TaskPilot Server is a robust backend for a task and project management platform, built with Node.js, Express, Prisma, and MongoDB. It supports user authentication, team and project management, real-time chat, and payment processing.
### Live link:  [Click Here](https://task-management-production-7b6f.up.railway.app)
### Postman Documentation:  [Click Here](https://documenter.getpostman.com/view/38506814/2sB2x8DqxC)
## Features
- **User Management**: Registration, authentication, roles, and profile management
- **Team Management**: Create and manage teams, assign users
- **Project Management**: Create projects, assign users/teams, manage project status
- **Real-time Chat**: Project and team chat rooms with Socket.IO
- **Payment Integration**: Stripe payments for project-related transactions
- **Role-based Access Control**
- **Soft Deletion**: Deactivate users and clean up assignments

## Tech Stack
- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM** (MongoDB)
- **Socket.IO** (real-time chat)
- **Stripe** (payments)
- **Zod** (validation)

## Relational Diagram

![ER Diagram](https://i.ibb.co/1tKBNc4r/task-Pilot-er-diagram.webp)

## Project Structure
```
taskPilot-server/
├── src/
│   ├── app/
│   │   ├── modules/         # Feature modules (user, team, project, chat, payment, auth)
│   │   ├── middlewares/     # Express middlewares
│   │   ├── errors/          # Error handling
│   │   ├── routes/          # API route definitions
│   │   └── ...
│   ├── config/              # App configuration
│   ├── lib/                 # Prisma client
│   ├── shared/              # Shared utilities
│   ├── types/               # TypeScript types
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry (with Socket.IO)
├── prisma/
│   └── schema.prisma        # Prisma schema (MongoDB)
├── package.json
├── tsconfig.json
└── ...
```

## Setup & Installation
1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd taskPilot-server
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Create a .env file in your root directory and add this property with your own value.
```
DATABASE_URL="Give your mongodb uri"
PORT=5000
NODE_ENV=production
JWT_ACCESS_SECRET= Give a jwt secret key
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_SECRET= Give a jwt secret key
JWT_REFRESH_EXPIRES_IN=1y
STRIPE_SECRET_KEY= Give your stripe secret key
FRONTEND_BASE_URL=http://localhost:3000
```
4. **Generate Prisma client & push schema**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. **Start the development server**
   ```bash
   npm run dev
   ```

## Scripts
- `npm run dev` — Start in development mode (with hot reload)
- `npm run build` — Build for production (generates Prisma client, pushes schema, compiles TypeScript)
- `npm start` — Start the production server

## API Usage
- All routes are prefixed with `/api/v1`
- Main modules:
  - `POST /api/v1/auth` — Authentication (login, register, etc.)
  - `GET/POST /api/v1/user` — User management
  - `GET/POST /api/v1/team` — Team management
  - `GET/POST /api/v1/project` — Project management
  - `GET/POST /api/v1/chat` — Chat features
  - `POST /api/v1/payment` — Payment processing

## Database
- Uses **MongoDB** via **Prisma ORM**
- See `prisma/schema.prisma` for the full data model

## Real-time Features
- Socket.IO is used for chat and real-time updates
- The server is configured to accept connections from the frontend (see CORS settings in `src/app.ts`)
