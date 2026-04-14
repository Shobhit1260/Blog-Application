# 📝 Full Stack Blog Application

A modern, feature-rich blogging platform built with Node.js, Express, MongoDB, and React. This application allows users to create, read, update, and delete blog posts with rich text editing, user authentication, email notifications, and AI-powered features.

## ✨ Features

### Authentication & User Management
- **User Registration & Login** - Secure authentication with JWT tokens
- **OAuth Integration** - Sign in with Google and GitHub
- **Password Management** - Change password and password reset functionality
- **User Profiles** - Customizable user profiles with avatars
- **Profile Settings** - Privacy controls and notification preferences

### Blog Features
- **Create & Edit Posts** - Rich text editor (Quill.js) for composing blog posts
- **Read Posts** - Browse all published blogs with beautiful cards and detailed view
- **Delete Posts** - Authors can manage their published content
- **Search & Filter** - Find blogs by title, author, or other criteria
- **Like & Comments** - Engage with posts through likes and comments
- **Trending Posts** - Discover popular content

### Email Notifications
- ✅ **Welcome Email** - Upon user registration
- ✅ **Like Notifications** - When someone likes your post
- ✅ **Comment Notifications** - When someone comments on your post
- ✅ **Follow Notifications** - When someone follows your profile
- ✅ **Weekly Digest** - Summary of your blog statistics
- **Customizable Preferences** - Users control which notifications they receive

### Image Management
- **Image Upload** - Upload blog post images via Cloudinary
- **Image Optimization** - Automatic image compression and optimization
- **Responsive Images** - Optimized for all device sizes

### UI/UX
- **Dark/Light Theme** - Toggle between dark and light mode with persistent preferences
- **Responsive Design** - Fully responsive with Tailwind CSS
- **Notifications** - Toast notifications for user actions (React Hot Toast)
- **SEO Optimized** - Meta tags and helmet integration for better SEO
- **Smooth Animations** - Framer Motion for elegant transitions

### AI Features
- **AI-Powered Content** - OpenAI integration for content suggestions and assistance
- **Smart Features** - AI-driven recommendations and content enhancement

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: 
  - JWT (JSON Web Tokens)
  - Passport.js (OAuth strategies)
  - bcryptjs (Password hashing)
- **Email**: Nodemailer with SMTP
- **File Upload**: Multer + Cloudinary
- **API**: RESTful API
- **External APIs**:
  - OpenAI API (AI features)
  - Cloudinary (Image hosting)
  - Google OAuth 2.0
  - GitHub OAuth 2.0

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + PostCSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **UI Components**: 
  - React Quill (Rich text editor)
  - React Markdown (Markdown rendering)
  - Framer Motion (Animations)
  - React Hot Toast (Notifications)
  - React Helmet Async (Meta tags)
- **Utilities**:
  - DOMPurify (XSS protection)
  - Auth0 (Alternative auth)

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **MongoDB** account and connection string
- **Cloudinary** account credentials
- **Gmail/SMTP** credentials for email notifications
- **OpenAI API Key** for AI features
- **OAuth Credentials** (Google & GitHub)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd blogApp
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd blogApi
npm install
```

#### Environment Variables
Create a `.env` file in the `blogApi` directory with the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Secret
SECRET_KEY=your_secret_key

# Email Configuration (Gmail/SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# AI API
OPENAI_API_KEY=your_openai_api_key

# Image Hosting
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OAuth - GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

#### Start Backend Server
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Environment Variables (if needed)
Create a `.env` file in the `frontend` directory if using environment variables:

```env
VITE_API_URL=http://localhost:5000
```

#### Start Frontend Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: Available in routes files

## 📁 Project Structure

```
blogApp/
├── blogApi/                          # Backend directory
│   ├── config/
│   │   ├── db.js                     # MongoDB connection
│   │   └── passport.js               # Passport authentication config
│   ├── controllers/
│   │   ├── usercontroller.js         # User logic (auth, profile, settings)
│   │   ├── blogcontroller.js         # Blog CRUD operations
│   │   └── aicontroller.js           # AI-powered features
│   ├── middleware/
│   │   ├── auth.js                   # JWT authentication middleware
│   │   └── multer.js                 # File upload configuration
│   ├── models/
│   │   ├── userSchema.js             # User data model with settings
│   │   └── blogSchema.js             # Blog post data model
│   ├── routes/
│   │   ├── authRoutes.js             # Authentication endpoints
│   │   ├── userRoutes.js             # User profile & settings endpoints
│   │   ├── blogRoutes.js             # Blog CRUD endpoints
│   │   └── airoutes.js               # AI feature endpoints
│   ├── utils/
│   │   ├── emailSender.js            # Email configuration
│   │   ├── notificationService.js    # Email notification templates
│   │   ├── cloudinary.js             # Cloudinary upload config
│   │   └── sendtoken.js              # JWT token generation
│   ├── server.js                     # Express app entry point
│   ├── package.json                  # Backend dependencies
│   └── .env                          # Environment variables
│
├── frontend/                         # Frontend directory
│   ├── src/
│   │   ├── components/
│   │   │   ├── BlogCard.jsx          # Blog post card component
│   │   │   ├── Header.jsx            # Navigation header
│   │   │   ├── Footer.jsx            # Footer component
│   │   │   ├── Hero.jsx              # Landing page hero
│   │   │   └── ThemeToggle.jsx       # Dark/light theme toggle
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Homepage
│   │   │   ├── BlogDetail.jsx        # Individual blog view
│   │   │   ├── CreateEdit.jsx        # Create/edit blog post
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── MyProfile.jsx         # User profile
│   │   │   ├── MyPosts.jsx           # User's published posts
│   │   │   ├── Settings.jsx          # User settings & preferences
│   │   │   ├── ForgotPassword.jsx    # Password reset
│   │   │   ├── ResetPassword.jsx     # Reset password with token
│   │   │   ├── Contact.jsx           # Contact page
│   │   │   ├── About.jsx             # About page
│   │   │   ├── Profile.jsx           # Other user's profile
│   │   │   ├── Privacy.jsx           # Privacy policy
│   │   │   ├── Terms.jsx             # Terms of service
│   │   │   ├── Guidelines.jsx        # Community guidelines
│   │   │   └── Cookies.jsx           # Cookie policy
│   │   ├── context/
│   │   │   └── ThemeContext.jsx      # Theme context for dark/light mode
│   │   ├── store/
│   │   │   ├── store.js              # Redux store configuration
│   │   │   └── userSlice.js          # User state management
│   │   ├── utils/
│   │   │   └── api.js                # Axios API instance
│   │   ├── data/
│   │   │   └── dummyBlogs.js         # Sample blog data
│   │   ├── styles/
│   │   │   ├── index.css             # Global styles
│   │   │   └── quill.css             # Rich editor styles
│   │   ├── App.jsx                   # Main app component
│   │   └── main.jsx                  # React entry point
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   └── index.html                    # HTML entry point
│
├── README.md                         # This file
└── EMAIL_FEATURES_IMPLEMENTED.md     # Email notification documentation
```

## 🔐 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password with token

### User Routes
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/changepassword` - Change password
- `GET /api/users/settings` - Get user settings
- `PUT /api/users/settings/notifications` - Update notification preferences
- `PUT /api/users/settings/privacy` - Update privacy settings
- `DELETE /api/users/:id` - Delete user account

### Blog Routes
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create new blog (auth required)
- `PUT /api/blogs/:id` - Update blog (auth required)
- `DELETE /api/blogs/:id` - Delete blog (auth required)
- `POST /api/blogs/:id/like` - Like a blog
- `POST /api/blogs/:id/comment` - Comment on blog
- `GET /api/blogs/:id/comments` - Get blog comments

### AI Routes
- `POST /api/ai/suggest` - Get AI content suggestions
- `POST /api/ai/improve` - Improve content with AI

## 🔧 Configuration

### MongoDB Setup
1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Add your IP address to the whitelist
4. Update `MONGO_URI` in `.env`

### Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret
3. Update the environment variables

### Gmail Setup for Email Notifications
1. Enable 2-factor authentication on Gmail
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password as `SMTP_PASS` in `.env`

### OAuth Setup
1. **Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **GitHub OAuth**:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create new OAuth App
   - Set Authorization callback URL

## 📧 Email Notifications

The application automatically sends emails for:
- **User Registration** - Welcome email with account confirmation
- **Blog Likes** - Notify author when someone likes their post
- **Blog Comments** - Notify author when someone comments
- **New Followers** - Notify when someone follows your profile
- **Weekly Digest** - Weekly summary of blog statistics

Users can customize these preferences in their Settings page.

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables on your hosting platform
2. Update `FRONTEND_URL` and `BACKEND_URL` for production
3. Deploy using Git or CLI

### Frontend Deployment (Vercel/Netlify)
1. Update API base URL to production backend
2. Build: `npm run build`
3. Deploy the `dist` folder

## 🧪 Testing

For API testing:
- Use Postman, Thunder Client, or similar tools
- Use JWT tokens obtained from login endpoint
- Import the token in Authorization header: `Bearer <token>`

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📞 Support

For issues and questions, please:
- Check existing issues on GitHub
- Create a new issue with detailed information
- Contact the development team

## 🎯 Future Enhancements

- [ ] Blogging categories and tags
- [ ] Advanced search with filters
- [ ] Blog scheduling
- [ ] Social sharing features
- [ ] Reading time estimation
- [ ] User followers/following system
- [ ] Blog recommendations
- [ ] Analytics dashboard
- [ ] Export to PDF/Word
- [ ] Multi-language support

---

**Happy Blogging! 📝✨**
