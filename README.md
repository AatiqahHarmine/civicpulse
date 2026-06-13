# CivicPulse – AI-Powered Public Issue Reporting System

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📁 Project Structure
```
civicpulse/
├── backend/
│   ├── config/db.js
│   ├── controllers/    (auth, issue, comment, analytics, notification, profile)
│   ├── middlewares/authMiddleware.js
│   ├── models/         (User, Issue, Comment, Notification, Petition)
│   ├── routes/         (auth, issue, comment, analytics, notification, profile, report)
│   ├── services/       (aiService, duplicateService, petitionEngine, cronService)
│   ├── .env
│   └── server.js
└── frontend/
    └── src/
        ├── components/ (Navbar, ProtectedRoute)
        ├── context/    (AuthContext)
        └── pages/      (Login, Register, HomeFeed, ReportIssue, IssueDetails, MapExplorer, AdminDashboard, Profile)
```

## 🔑 Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/civicpulse
JWT_SECRET=your_super_secret_key
```

## 📡 API Endpoints
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET/POST /api/issues` — Get all / Create issue
- `GET/PUT/DELETE /api/issues/:id` — Issue CRUD
- `POST /api/issues/:id/react` — React to issue
- `PUT /api/issues/bulk` — Bulk update (Admin)
- `GET /api/comments/issue/:id` — Get comments
- `POST /api/comments` — Add comment
- `GET /api/analytics/kpis` — Dashboard KPIs (Admin)
- `GET /api/analytics/heatmap` — Map coordinates
- `GET /api/notifications` — User notifications
- `GET /api/profile` — User profile & badges
- `GET /api/reports/weekly` — Weekly report (Admin)
