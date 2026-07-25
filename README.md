# 🎓 Placement Portal

A production-grade, full-stack college placement management portal built with the MERN stack. Designed to streamline the entire placement process — from student onboarding to final selections.

Now includes an advanced **RAG Resume Matching Engine** to automatically parse student resumes and rank candidates against Job Descriptions!

🔗 **Live Demo:** [placement-portal-red.vercel.app](https://placement-portal-red.vercel.app)

---

## 🔐 Demo Credentials

### Admin Login
| Field    | Value                          |
|----------|-------------------------------|
| Email    | namansharma9625@gmail.com     |
| Password | Admin@Naman                   |

### Student Login
> Register a new account using any **@gmail.com** email address.

---

## ✨ Core Features

### 👨‍🎓 Student Side
- **Self Signup & Verification**: Register with university email + OTP verification.
- **Job Listings**: Browse active job openings with dynamic, server-side eligibility checks.
- **RAG Match Analysis**: View an automated **Resume Match Analysis** card on job postings, displaying match percentage, shared matching skills, and missing skill gaps.
- **Application Flow**: Apply to eligible companies and track status with a stepper (applied ➔ test ➔ interview ➔ selected).
- **Profile Management**: Upload photo and PDF resume. Manage manually entered skills, CGPA, backlogs, and academic history.
- **Password Settings**: Change password from profile dashboard or request resets via email OTP.
- **Placement Cell Contact**: Submit query messages directly to the placement office with status tracking.

### 👨‍💼 Admin Side
- **Statistics Dashboard**: Placement ratios, top companies, branch-wise statistics, and charts.
- **Job Manager**: Create and manage job openings with granular eligibility criteria (Min CGPA, branches, maximum active backlogs, etc.).
- **RAG Resume Matcher**: Select any active job posting to automatically parse, score, and rank all student resumes. View detailed skill overlap audits (Shared Skills vs Gaps) and load resumes in an instant PDF viewer.
- **Applicant Pipeline**: View list of applicants, export list to Excel, and bulk update selection statuses using company-provided Excel sheets.
- **Student Management**: Verify registration profiles, debar/reinstate students, edit profile details, and lock profiles to prevent changes to academic data.
- **Student Queries Dashboard**: Dedicated inbox to review, track, and mark student contact queries as "Resolved".
- **Notifications Panel**: Send targeted email announcements by branch.
- **Audit Logs**: View log files of all bulk operations.

### 🔐 Security & Operations
- **JWT Authentication**: Token rotation using Access + Refresh token flows.
- **Axios Interceptor**: Smart retry handlers that handle token rotation and prevent infinite auth loops.
- **Rate Limiting**: Integrated endpoint rate limits (dynamically scales to 10k in local dev to avoid development locks).
- **Dynamic CORS**: Accepts dynamic localhost ports in development and strict URL validation in production.

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|----------------------------------------|
| Frontend   | React.js, Vite, Tailwind CSS           |
| Backend    | Node.js, Express.js                    |
| Database   | MongoDB Atlas                          |
| Parser     | PDF-Parse (v2.x)                       |
| Auth       | JWT (Access + Refresh Tokens)          |
| Email      | Brevo SMTP                             |
| Storage    | Cloudinary                             |
| Caching    | Node-Cache                             |
| Deployment | Vercel (Frontend), Render (Backend)    |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- MongoDB Atlas account
- Cloudinary account
- Brevo account (for email)

### Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/niteshhh001/Placement_Portal.git
   cd Placement_Portal
   ```

2. **Install all dependencies (Monorepo setup)**
   We have configured a root-level package script to install both Frontend and Backend dependencies in one command:
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables**

   - **Backend Configuration (`Backend/.env`)**:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     JWT_REFRESH_SECRET=your_jwt_refresh_secret
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     BREVO_API_KEY=your_brevo_api_key
     SENDER_EMAIL=your_sender_email
     CLIENT_URL=http://localhost:3000
     UNIVERSITY_DOMAIN=gmail.com
     ```

   - **Frontend Configuration (`Frontend/.env`)**:
     ```env
     VITE_API_URL=http://localhost:5000/api
     VITE_UNIVERSITY_DOMAIN=gmail.com
     ```

4. **Seed Admin Account**
   ```bash
   npm run dev --prefix Backend  # (Run inside Backend dir if running first time)
   node Backend/utils/seedAdmin.js
   ```

5. **Start Local Development Server**
   Start both Backend and Frontend concurrently with a single command from the project root:
   ```bash
   npm run dev
   ```
   * The backend will run on port `5000`.
   * The frontend will run on port `3000`.

---

## 📁 Project Structure

```
Placement_Portal/
├── Backend/
│   ├── config/             # DB & Cloudinary configs
│   ├── controllers/        # Business logic controllers
│   ├── middleware/         # Auth, validation, error handler middlewares
│   ├── models/             # MongoDB schemas (Student, Job, Query, etc.)
│   ├── routes/             # Express API routers
│   ├── scratch/            # Development diagnostic & test scripts
│   ├── utils/              # Email helpers, matching engine, pdf parser utilities
│   └── server.js           # Server entry point
│
├── Frontend/
│   ├── public/             # Static public assets
│   └── src/
│       ├── api/            # Axios API config
│       ├── auth/           # Route guard wrappers
│       ├── components/     # Reusable layout components
│       ├── context/        # Global Auth context
│       ├── pages/          # Student & Admin dashboard pages
│       └── App.jsx         # App router registration
```

---

## 📊 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/student/register` | Register student + send verification OTP |
| POST | `/api/auth/student/verify-otp` | Verify OTP and activate account |
| POST | `/api/auth/login` | Login handler (student + admin) |
| POST | `/api/auth/refresh` | Refresh access tokens |
| POST | `/api/auth/forgot-password` | Send password reset OTP |
| POST | `/api/auth/reset-password` | Reset student password |

### Resume Matching
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/matching/evaluate/:jobId` | Ranks all student resumes against a Job ID | Admin only |
| GET | `/api/matching/job/:jobId/my-score` | Fetches match score & skill gaps for current user | Student only |

### Student Profile
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/student/profile` | Fetch own profile |
| PATCH | `/api/student/profile` | Update profile fields |
| POST | `/api/student/resume` | Upload and parse PDF resume |
| POST | `/api/student/photo` | Upload profile photo |
| POST | `/api/student/contact` | Submit placement query |

### Job Postings & Applications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | Get all jobs + eligibility status |
| GET | `/api/jobs/:id` | Get job detail |
| POST | `/api/jobs/:id/apply` | Submit application |
| GET | `/api/applications/me` | Get student applications |

### Admin Actions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/queries` | Fetch all submitted student queries |
| PATCH | `/api/admin/queries/:id/resolve` | Toggle student query resolution state |
| GET | `/api/admin/jobs/:id/applicants` | List applicants for a job |
| POST | `/api/admin/jobs/:id/bulk-update` | Bulk selection updates from Excel |
| POST | `/api/admin/students/import` | Import new students from Excel |
| PATCH | `/api/admin/students/:id/lock` | Lock/unlock academic profile data |

---

## 🌐 Deployment

For deployment guidelines, environment variables settings, and troubleshooting instructions (like Cloudinary PDF security settings), see the [Deployment & Hosting Guide](file:///C:/Users/Naman%20Sharma/.gemini/antigravity/brain/13c824d2-97fa-4c45-9f7e-c2bcb10c0cee/hosting_guide.md).

---

## 📄 License
This project is licensed under the MIT License.
