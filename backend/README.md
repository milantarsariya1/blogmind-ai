# BlogMind AI Backend

The Node.js + Express + TypeScript backend for BlogMind AI, powered by PostgreSQL (Neon), Prisma ORM, and the Groq AI API.

## Features

- **JWT Authentication & Passwords Hashing:** Register/login validation powered by JWT and `bcryptjs`.
- **Relational PostgreSQL Database:** Managed schemas using Prisma ORM.
- **AI Integration (Groq):** SECURE AI Summary Generation and Grammar/Style correction endpoints utilizing Llama 3 models.
- **Community-driven Moderation:** Automatic deletion of articles receiving more than 7 community reports.
- **Server-side Search & Pagination:** Fast query endpoints for explored feeds.

## Installation & Setup

1. **Navigate to the Backend Directory:**
   ```bash
   cd backend
   ```

2. **Configure Environment Variables:**
   Copy the example file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill out the parameters inside `.env`:
   - `DATABASE_URL`: Connection string of your Neon or local PostgreSQL database.
   - `JWT_SECRET`: Any secure key for signing JSON Web Tokens.
   - `GROQ_API_KEY`: API token from Groq Console (gsk_...) to enable Llama 3 AI assistance.

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Synchronize & Generate Prisma Client:**
   Ensure your database is reachable, then run:
   ```bash
   # Synchronize database tables
   npm run prisma:migrate

   # Generate type-safe Prisma client
   npm run prisma:generate
   ```

## Development and Scripts

Run the following scripts from the backend folder:

- **Run Dev Server (with HMR):**
   ```bash
   npm run dev
   ```
   This spins up the development server on `http://localhost:5000`.

- **Compile to Javascript:**
   ```bash
   npm run build
   ```

- **Run Production Build:**
   ```bash
   npm start
   ```

- **Open Prisma Studio (Visual DB viewer):**
   ```bash
   npm run prisma:studio
   ```

## API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /signup` - Registers a new user. Returns user profile & JWT token.
- `POST /login` - Sign-in validation. Returns user profile & JWT token.
- `GET /me` - Fetches active session profile (Protected).
- `PUT /update` - Edit full name, email, or password settings (Protected).

### Blog Posts (`/api/posts`)
- `POST /` - Creates a new article (Protected).
- `GET /` - Fetches paginated, searched & filtered published posts. Supports queries: `?page=X&limit=Y&search=term&tag=name`.
- `GET /my-posts` - Fetches all personal articles (drafts + published) for dashboard feed (Protected).
- `GET /:id` - Fetches single article details. Atomically increments views by 1.
- `PUT /:id` - Updates article content (Protected, Owner only).
- `DELETE /:id` - Deletes article (Protected, Owner only).
- `POST /:id/report` - Submits a community moderation report. If report count exceeds 7, the article is permanently deleted.

### AI Assistants (`/api/ai`)
- `POST /summarize` - Sends article body text to Groq model to return a structured 2-3 sentence abstract (Protected).
- `POST /correct` - Submits article HTML to Groq model to return grammar and syntax fixes while preserving formatting styles (Protected).
