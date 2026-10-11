# 🎬 VidStream

A full-featured **YouTube-like web application** built from scratch — a **React** frontend paired with a **Node.js / Express** REST API backend, backed by **MongoDB**, **Cloudinary**, **Redis**, and **Elasticsearch**. Supports user authentication, video management, subscriptions, likes, comments, community tweets, search, and more — served through an **Nginx reverse-proxy** with three load-balanced backend instances.

---

## ✨ Features

- 🔐 **JWT Authentication** — Access token + Refresh token system with HTTP-only cookies
- 📹 **Video Management** — Upload, update, delete, and stream videos (stored on Cloudinary)
- 👥 **Subscriptions** — Toggle subscribe/unsubscribe, view subscribers & subscribed channels
- 👍 **Likes** — Toggle likes on videos, comments, and tweets
- 💬 **Comments** — Add, edit, delete, and fetch comments on videos
- 🐦 **Tweets / Community Posts** — Create posts with optional image attachments
- 📜 **Watch History** — Track and retrieve a user's video watch history
- 🔑 **Forgot Password** — OTP-based password reset via email (Redis TTL = 5 min)
- 📺 **Channel Profiles** — View any user's channel with live subscriber counts via MongoDB aggregation
- 🔍 **Elasticsearch Search** — Fast full-text search on video title, description, and tags (falls back to MongoDB if unavailable)
- ⚡ **Redis Caching** — API response caching for performance (gracefully degrades if unavailable)
- 🛡️ **Rate Limiting** — IP-based rate limiter on all `/api/v1` routes
- 📥 **Video Download** — Download videos directly from Cloudinary
- 🐳 **Docker + Nginx** — Production-ready setup with 3 load-balanced backend containers behind Nginx

---

## 🛠️ Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18 (ES Modules) |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose |
| Search | Elasticsearch (optional) |
| Caching | Redis (optional) |
| File Storage | Cloudinary |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcrypt |
| File Uploads | Multer |
| Email | Nodemailer (Gmail SMTP) |
| Rate Limiting | express-rate-limit |
| Dev Server | Nodemon |

### Frontend
| Layer | Technology |
|-------|-----------|
| Library | React 18 |
| Bundler | Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Styling | Tailwind CSS |
| Icons | Heroicons |
| Notifications | react-hot-toast |

### Infrastructure
| Component | Technology |
|-----------|-----------|
| Reverse Proxy | Nginx (Alpine) |
| Containerization | Docker + Docker Compose |
| Load Balancing | Nginx `least_conn` across 3 backend instances |

---

## 📁 Project Structure

```
VidStream/
├── Backend/
│   ├── src/
│   │   ├── index.js                       # Entry point — loads env, connects DB & Elastic, starts server
│   │   ├── app.js                         # Express app — registers middlewares & all routes
│   │   ├── constant.js                    # App-wide constants (DB_NAME)
│   │   │
│   │   ├── db/
│   │   │   ├── index.js                   # MongoDB connection (ConnectDB)
│   │   │   ├── elasticsearch.js           # Elasticsearch index initialization
│   │   │   └── redis.js                   # Redis client with graceful degradation
│   │   │
│   │   ├── models/
│   │   │   ├── user.model.js              # User schema (JWT methods + bcrypt hook)
│   │   │   ├── video.model.js             # Video schema (Cloudinary URLs, aggregate paginate)
│   │   │   ├── subscription.model.js      # Subscription schema (subscriber ↔ channel)
│   │   │   ├── like.model.js              # Polymorphic like schema (video / comment / tweet)
│   │   │   ├── comment.model.js           # Comment schema (video + owner refs)
│   │   │   ├── tweet.model.js             # Tweet schema (content + poster image)
│   │   │   └── playlist.model.js          # Playlist schema
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js         # verifyJWT — protects private routes
│   │   │   ├── multer.middleware.js       # Handles multipart/form-data file uploads
│   │   │   └── rate-limiter.middleware.js # express-rate-limit (20k req / 0.4 min per IP)
│   │   │
│   │   ├── controllers/
│   │   │   ├── user.controller.js         # Register, login, logout, profile, watch history
│   │   │   ├── video.controller.js        # Upload, update, delete, fetch videos
│   │   │   ├── subscription.controller.js # Toggle subscribe, get subscribers/subscribed
│   │   │   ├── like.controller.js         # Toggle likes, get liked videos
│   │   │   ├── comment.controller.js      # CRUD for comments
│   │   │   ├── tweet.controller.js        # CRUD for tweets / community posts
│   │   │   ├── forgotpassword.controller.js # OTP generation, validation, password reset
│   │   │   ├── mailer.controller.js       # Nodemailer helper (sends OTP email)
│   │   │   ├── search.controller.js       # Elasticsearch / MongoDB fallback search
│   │   │   └── download.controller.js     # Video download endpoint
│   │   │
│   │   ├── routes/
│   │   │   ├── user.routes.js             # /api/v1/users
│   │   │   ├── videos.routes.js           # /api/v1/videos
│   │   │   ├── subscription.routes.js     # /api/v1/subscriptions
│   │   │   ├── like.routes.js             # /api/v1/likes
│   │   │   ├── comment.routes.js          # /api/v1/comments
│   │   │   ├── tweet.routes.js            # /api/v1/tweets
│   │   │   ├── search.routes.js           # /api/v1/search
│   │   │   └── download.routes.js         # /api/v1/download
│   │   │
│   │   └── utils/
│   │       ├── asyncHandler.js            # Wraps async controllers to forward errors
│   │       ├── apiError.js                # Custom error class with HTTP status code
│   │       ├── apiResponse.js             # Standard success response shape
│   │       ├── cloudinary.js              # Upload / delete files on Cloudinary
│   │       └── elasticsearch.js          # Elasticsearch client + isElasticEnabled helper
│   │
│   ├── public/temp/                       # Temporary upload directory (Multer → Cloudinary)
│   ├── Dockerfile                         # Docker image for the backend
│   ├── .dockerignore
│   ├── .env                               # Your secrets (DO NOT commit)
│   ├── .env.docker.example               # Docker-ready env template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                       # React entry point
│   │   ├── App.jsx                        # Route definitions (public + protected)
│   │   ├── index.css                      # Tailwind base styles
│   │   │
│   │   ├── api/
│   │   │   ├── axios.js                   # Axios instance (baseURL + withCredentials)
│   │   │   ├── usersApi.js
│   │   │   ├── videosApi.js
│   │   │   ├── commentsApi.js
│   │   │   ├── likesApi.js
│   │   │   ├── subscriptionsApi.js
│   │   │   ├── tweetsApi.js
│   │   │   └── forgotPasswordApi.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx            # Global auth state (user, loading, login, logout)
│   │   │
│   │   ├── components/                    # Shared UI components (Layout, Navbar, Spinner, etc.)
│   │   │
│   │   └── pages/
│   │       ├── LandingPage.jsx            # Public landing page
│   │       ├── LoginPage.jsx
│   │       ├── RegisterPage.jsx
│   │       ├── ForgotPasswordPage.jsx
│   │       ├── HomePage.jsx               # Video feed
│   │       ├── VideoDetailPage.jsx        # Video player + comments
│   │       ├── ChannelPage.jsx            # User channel profile
│   │       ├── DashboardPage.jsx          # Creator dashboard
│   │       ├── UploadVideoPage.jsx
│   │       ├── EditVideoPage.jsx
│   │       ├── SearchPage.jsx
│   │       ├── LikedVideosPage.jsx
│   │       ├── HistoryPage.jsx
│   │       ├── ChangePasswordPage.jsx
│   │       └── UpdateAccountPage.jsx
│   │
│   ├── index.html
│   ├── vite.config.js                     # Vite dev server (port 3000, proxy /api → localhost)
│   ├── tailwind.config.js
│   └── package.json
│
├── docker-compose.yml                     # Nginx + 3 backend replicas
├── nginx.conf                             # Nginx reverse proxy & load balancer config
├── .env.sample                            # Root-level env sample
└── Readme.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Redis instance — e.g., [Redis Cloud](https://redis.io/try-free/) *(optional — app degrades gracefully without it)*
- Elasticsearch Cloud instance *(optional — app falls back to MongoDB search)*
- Gmail App Password (for Nodemailer OTP emails)
- Docker + Docker Compose *(for the production setup)*

---

### Option 1 — Local Development (without Docker)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd VidStream

# 2. Set up Backend
cd Backend
cp ../.env.sample .env
# Edit .env with your actual credentials
npm install
npm run dev
# → Backend starts at http://localhost:8000

# 3. Set up Frontend (new terminal)
cd frontend
npm install
npm run dev
# → Frontend starts at http://localhost:3000
```

> The Vite dev server proxies all `/api` requests to `http://localhost` (port 80),
> so run Nginx (or point the proxy target to `http://localhost:8000`) during local dev.

---

### Option 2 — Docker (Production-like setup)

```bash
# 1. Create your Backend .env from the Docker template
cp Backend/.env.docker.example Backend/.env
# Edit Backend/.env with your actual credentials

# 2. Build and start all services
docker compose up --build

# Services started:
#   Nginx          → http://localhost:80   (public entry point)
#   backend1,2,3   → internal network only (port 8000 each)
```

Nginx load-balances requests across the three backend containers using the `least_conn` strategy.

---

## ⚙️ Environment Variables

Copy `.env.sample` (or `Backend/.env.docker.example`) and fill in your credentials:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.example.mongodb.net/?appName=Cluster0

# Server
PORT=8000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=*

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# Redis (optional — app runs without it)
REDIS_PASSWORD=your_redis_password
REDIS_URL=redis://your_redis_host:6379

# Email (Nodemailer)
EMAIL=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465

# Elasticsearch (optional — falls back to MongoDB search)
CLOUD_ID=your_elastic_cloud_id
ELASTIC_API_KEY=your_elastic_api_key
```

> **Note:** Redis and Elasticsearch are optional. If their credentials are absent, the app
> runs without caching and uses MongoDB for search.

---

## 📡 API Reference

All routes are prefixed with `/api/v1`.
✅ = requires JWT auth cookie / `Authorization: Bearer <token>` header

---

### 🔐 User Routes — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/register` | ❌ | Register a new user (multipart: avatar, coverImage) |
| `POST` | `/login` | ❌ | Login with email/username + password |
| `POST` | `/logout` | ✅ | Logout and clear tokens |
| `POST` | `/refresh-access-token` | ❌ | Get a new access token using refresh token |
| `PATCH` | `/change-password` | ✅ | Change logged-in user's password |
| `GET` | `/current-user` | ✅ | Get currently logged-in user |
| `PATCH` | `/update-account` | ✅ | Update username and email |
| `GET` | `/c/:username` | ✅ | Get channel profile with subscriber count |
| `GET` | `/watch-history` | ✅ | Get user's watch history |
| `POST` | `/forgot-password` | ❌ | Send OTP to email for password reset |
| `POST` | `/verify-otp` | ❌ | Validate the OTP |
| `POST` | `/reset-password` | ❌ | Reset password after OTP verified |

---

### 🎥 Video Routes — `/api/v1/videos`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/upload-video` | ✅ | Upload video + thumbnail (multipart) |
| `GET` | `/all-videos` | ✅ | Fetch all published videos |
| `PATCH` | `/update-video/:videoId` | ✅ | Update title, description, or thumbnail |
| `GET` | `/your-videos` | ✅ | Get all videos uploaded by logged-in user |
| `DELETE` | `/delete-video/:videoId` | ✅ | Delete a video (owner only) |
| `POST` | `/watch-history/:videoId` | ✅ | Add video to watch history |

---

### 📫 Subscription Routes — `/api/v1/subscriptions`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/toggle/:channelId` | ✅ | Subscribe or unsubscribe from a channel |
| `GET` | `/get-subscribers/:userId` | ✅ | Get all subscribers of a channel |
| `GET` | `/get-subscribed/:userId` | ✅ | Get all channels a user has subscribed to |

---

### 👍 Like Routes — `/api/v1/likes`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/v/:videoId` | ✅ | Toggle like on a video |
| `POST` | `/c/:commentId` | ✅ | Toggle like on a comment |
| `POST` | `/t/:tweetId` | ✅ | Toggle like on a tweet |
| `GET` | `/liked-videos` | ✅ | Get all videos liked by logged-in user |

---

### 💬 Comment Routes — `/api/v1/comments`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/v/:videoId` | ✅ | Add a comment to a video |
| `GET` | `/v/:videoId` | ❌ | Get all comments for a video |
| `PATCH` | `/c/:commentId` | ✅ | Update a comment (owner only) |
| `DELETE` | `/c/:commentId` | ✅ | Delete a comment (owner only) |

---

### 🐦 Tweet Routes — `/api/v1/tweets`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/create-tweet` | ✅ | Create a community post (content + optional image) |
| `GET` | `/all` | ❌ | Get all tweets (newest first) |
| `GET` | `/u/:UserId` | ❌ | Get all tweets by a specific user |
| `PATCH` | `/t/:tweetId` | ✅ | Update tweet content (owner only) |
| `DELETE` | `/t/:tweetId` | ✅ | Delete a tweet (owner only) |

---

### 🔍 Search Routes — `/api/v1/search`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/?query=...` | ❌ | Search videos by title, description, or tags |

---

### 📥 Download Routes — `/api/v1/download`

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/:videoId` | ✅ | Download a video file |

---

## 🔄 Authentication Flow

```
1. Register  →  POST /api/v1/users/register
2. Login     →  POST /api/v1/users/login
               ↳ Returns accessToken + refreshToken (also set as httpOnly cookies)
3. Access protected routes with:
               ↳ Cookie:  accessToken=<token>          OR
               ↳ Header:  Authorization: Bearer <token>
4. Token expired?  →  POST /api/v1/users/refresh-access-token
5. Logout    →  POST /api/v1/users/logout  (clears cookies + DB refresh token)
```

---

## 🔑 Forgot Password Flow

```
1. POST /api/v1/users/forgot-password   { emailId }
   → Generates a 6-digit OTP
   → Stores in Redis with 5-minute TTL
   → Sends OTP to the user's email via Nodemailer

2. POST /api/v1/users/verify-otp   { emailId, OTP }
   → Checks Redis for the stored OTP
   → Validates match

3. POST /api/v1/users/reset-password   { emailId, newpassword }
   → Updates password in MongoDB
   → bcrypt hashes it automatically via the pre-save hook
```

---

## 🏗️ Infrastructure — Docker + Nginx

```
                ┌─────────────────────────────────┐
  Browser  ───► │  Nginx  (port 80, least_conn LB) │
                └───────┬──────────┬───────────────┘
                        │          │          │
              backend1  │  backend2│  backend3│  (each on port 8000)
              container │  container│ container│
                        └──────────┴──────────┘
                              │
                    MongoDB Atlas / Redis / Cloudinary / Elasticsearch
```

- **3 backend replicas** — each runs the same Express app on port 8000 inside its container
- **Nginx** — proxies all traffic on port 80 to the upstream pool, handles large uploads (`client_max_body_size 100M`), and sets proper proxy headers
- **Shared temp volume** — `Backend/public/temp` is mounted into all three containers so uploaded files are accessible before Cloudinary upload

---

## 📦 Response Format

All API responses follow a consistent shape:

**Success:**
```json
{
  "statusCode": 200,
  "data": { "..." },
  "message": "Operation successful",
  "success": true
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

---

## 🗄️ Data Models

```
User          → username, email, fullName, avatar, coverImage, watchHistory[], password, refreshToken
Video         → title, description, videoFile, thumbnail, duration, views, isPublished, public_id, owner → User
Subscription  → subscriber → User, channel → User
Like          → likedBy → User, video? → Video, comment? → Comment, tweet? → Tweet
Comment       → content, video → Video, owner → User
Tweet         → content, poster (image URL), owner → User
Playlist      → (schema defined, endpoints coming soon)
```

---

## 🧰 Key Design Decisions

| Pattern | Description |
|---------|-------------|
| **asyncHandler** | Wraps every async controller — errors auto-forward to Express global error handler |
| **httpOnly cookies** | Access & refresh tokens stored in cookies to prevent XSS theft |
| **Token rotation** | Refresh token stored in DB and cleared on logout |
| **Cloudinary temp flow** | Files saved locally by Multer → uploaded to Cloudinary → local file deleted |
| **MongoDB Aggregation** | Used for complex joins (e.g., `getChannelProfile`, `getWatchHistory`) |
| **Toggle pattern** | Like and Subscribe use findOne → delete if exists, create if not |
| **`$addToSet`** | Watch history uses `$addToSet` to prevent duplicate video entries |
| **Redis TTL** | OTPs auto-expire after 300 seconds — no manual cleanup needed |
| **Graceful degradation** | Redis and Elasticsearch are optional; app works fully without them |
| **Nginx least_conn** | Distributes requests to the backend with the fewest active connections |
| **ES Module** | Both backend and frontend use ES Modules (`"type": "module"`) |
| **Vite proxy** | Frontend dev server proxies `/api` to the backend — no CORS issues in dev |

---

## 👨‍💻 Author

**Deepak Yadav**  
Building full-stack web apps with Node.js, Express, MongoDB, and React.
