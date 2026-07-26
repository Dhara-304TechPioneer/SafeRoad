# SafeRoad Backend

This is the backend service for the SafeRoad project built using **Express, TypeScript, and Prisma**.

## Architecture & Features

The backend source code is located in the [src/](file:///C:/Users/DHARA/PROJECTS/SafeRoads/SafeRoad/backend/src) directory.

### Key Features
- **Express & TypeScript**: RESTful API endpoints for authentication, reports, comments, analytics, and uploads.
- **Prisma ORM**: Interfacing with PostgreSQL for data models (`User`, `Report`, `Comment`, `AIResult`, `Attachment`, `Notification`).
- **AI Integration**: Automatic dispatch of uploaded pothole report images to `ai-service` (`POST /api/detection/detect`) for computer vision inference.
- **Real-Time WebSockets**: Socket.io integration for instant status updates and administrative notifications.
- **Analytics API**: Endpoints providing report statistics, status distributions, city metrics, and officer performance.

### Quick Start
1. Ensure the PostgreSQL database is running.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure `DATABASE_URL`.
4. Push database schema using Prisma:
   ```bash
   npx prisma db push
   ```
5. Run in development mode:
   ```bash
   npm run dev
   ```
6. Build and start production server:
   ```bash
   npm run build
   npm run start
   ```

