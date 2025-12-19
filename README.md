# 🎓 UniBro - University Resource Management Platform

A comprehensive university management system that connects students with their academic resources, faculty, and peers through an intuitive and modern interface.

## ✨ Features

### 📚 Resource Management
- **Organized Learning Materials**: Access assignments, quizzes, presentations, projects, notes, and past papers
- **Department & Semester Selection**: Navigate resources by your specific department and semester
- **Smart Dashboard**: Overview of all your academic materials in one place

### 👥 Faculty Directory
- **Staff Profiles**: View detailed faculty information including qualifications, office hours, and contact details
- **Department Filtering**: Search and filter faculty by department
- **Contact Integration**: Direct email access to professors

### 💬 Real-Time Communication
- **Group Chat**: Semester-wise chat rooms for collaborative learning
- **Live Typing Indicators**: See when others are typing
- **Reply & Delete**: Interactive message features
- **Mobile & Desktop**: Responsive chat interface for all devices

### 🔐 Authentication & Security
- **Email Verification**: Secure account verification system
- **Password Reset**: Easy password recovery via email
- **Protected Routes**: Access control for authenticated users
- **Session Management**: Secure JWT-based authentication

### 🎨 User Experience
- **Dark Mode**: Built-in theme switching for comfortable viewing
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Real-Time Updates**: Live data synchronization across the platform
- **Professional UI**: Clean, modern interface with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icon set
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js & Express** - Server framework
- **MongoDB** - Database
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/unibro.git
cd unibro
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Environment Setup**

Create `.env` file in the backend directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. **Run the application**
```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)
npm run dev
```

5. **Access the application**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`

## 📁 Project Structure

```
unibro/
├── backend/
│   ├── config/         # Database & email configuration
│   ├── controllers/    # Request handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Auth & validation
│   └── utils/          # Helper functions
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Route pages
    │   ├── services/    # API & socket services
    │   └── App.jsx      # Main application
    └── public/
```

## 🔑 Key Features Explained

### Staff Management
- Admin users can add, edit, and delete faculty profiles
- Lazy loading with pagination for better performance
- Search and filter capabilities
- Profile verification system

### Chat System
- Real-time messaging with Socket.io
- Room-based conversations (department + semester)
- Message deletion and reply functionality
- Unread message indicators
- Typing indicators for active users

### Authentication Flow
1. User registration with email
2. Email verification link sent
3. Account activation via link
4. Secure login with JWT tokens
5. Password reset functionality

## 🎯 Usage

### For Students
1. Register and verify your email
2. Select your department and semester
3. Access learning resources
4. Chat with classmates in group rooms
5. View faculty information and contact professors

### For Admins
1. Manage faculty profiles
2. Monitor system usage
3. Access all platform features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ by Yasir

## 🐛 Known Issues

- Performance optimization ongoing for large chat histories
- Mobile chat UX improvements in progress

## 🔮 Future Enhancements

- [ ] File upload for assignments
- [ ] Video call integration
- [ ] Calendar for deadlines
- [ ] Grade tracking system
- [ ] Push notifications
- [ ] Mobile app version

---

**Need help?** Open an issue or contact support at yasirmarwa09@gmail.com
