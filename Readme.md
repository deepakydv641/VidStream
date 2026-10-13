# VidStream

VidStream is a full-stack video streaming platform inspired by YouTube. It allows users to sign up, log in, upload and manage videos, subscribe to creators, interact with content through likes and comments, search for videos, and keep track of watch history.

The project combines a Node.js/Express backend with a React + Vite frontend, MongoDB for persistence, Cloudinary for media storage, and Redis for rate limiting and caching support.

## Features

- User authentication with JWT access/refresh tokens
- Registration, login, logout, and profile management
- Video upload, update, delete, and playback
- Channel/profile pages and subscription system
- Likes and comments on videos
- Search and watch history tracking
- Forgot password flow with OTP verification
- Download support for video assets
- Dockerized deployment with Nginx
- Responsive frontend built with React + Tailwind CSS

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Cloudinary
- Redis
- JWT
- Nodemailer
- Multer
- CORS and rate limiting

### Deployment
- Docker
- Docker Compose
- Nginx

## Project Structure

```text
VidStream/
├── Backend/                 # Express API and server-side logic
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── .env.docker.example
├── frontend/                # React frontend
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── postman/                 # API testing collection
├── docker-compose.yml
├── nginx.conf
├── .env.sample
├── Readme.md
├── LICENSE
└── .gitignore
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ installed
- MongoDB running locally or a MongoDB Atlas connection
- Redis running locally or configured remotely
- Cloudinary account credentials
- Gmail or SMTP credentials for forgot-password emails

## Environment Variables

Copy the sample environment file and update the values:

```bash
cp .env.sample .env
```

Example variables:

```env
MONGODB_URI=your_mongodb_uri
PORT=8000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
REDIS_URL=redis://localhost:6379
EMAIL=your_email@gmail.com
EMAIL_PASS=your_email_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
```

## Running the Project

### 1. Backend

```bash
cd Backend
npm install
npm run dev
```

The backend runs on:

- http://localhost:8000

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

- http://localhost:5173

### 3. Docker Compose

```bash
docker compose up --build
```

This starts the app using the configured Docker setup and Nginx reverse proxy.

## API Modules

The backend exposes routes under `/api/v1` for:

- Users
- Videos
- Subscriptions
- Comments
- Tweets
- Likes
- Search
- Downloads

## Common Features in Detail

### Authentication
- Sign up and sign in
- JWT-based session handling
- Refresh-token flow
- Password change support
- Forgot password and OTP verification

### Video Experience
- Upload videos and thumbnails
- Manage your uploaded videos
- Browse all videos
- Update video details
- Watch history tracking

### Community Features
- Subscribe to creators
- View channel profiles
- Like content
- Comment on videos
- Post tweets/status updates

### Media & Storage
- Cloudinary integration for asset uploads
- Static file serving for public assets
- Download routes for media-related actions

## Development Notes

- The backend uses Express and modular route/controller/service patterns.
- The frontend is built with a Vite React app and Tailwind CSS.
- Rate limiting is enabled for API endpoints to reduce abuse and excessive traffic.
- Docker configuration is included for easier local and deployment setup.

## License

This project is open source and available under the MIT License.

## Author

Deepak Yadav
