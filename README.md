# 📄 Resumify - Resume Builder MERN App

**Project Name**: Resumify  
**Website Link**: [www.resumify.app](https://www.resumify.app) *(Update after deployment)*

---

## 🧠 Overview

**Resumify** is a full-featured resume builder web application built with the **MERN stack**. It allows users to register, log in, and choose from professional resume templates. With real-time WYSIWYG editing, users can build, preview (in A4 layout), and download resumes as PDFs. The application includes secure authentication and personalized profile management, providing a seamless resume-building experience.

![preview](https://github.com/user-attachments/assets/preview-image-path.png) *(Replace with actual image/GIF)*

---

## ✨ Features

- ✅ **User Authentication** – JWT-based secure login, registration, and logout
- 🧩 **Template Gallery** – Browse from multiple professional resume templates
- ✍️ **Live Editing** – Real-time WYSIWYG editing with preview
- 📄 **PDF Export** – Export resumes in consistent A4 format using jsPDF
- 💾 **Save & Resume** – Save resume data and continue editing later
- 🔐 **Protected Routes** – Auth-required access to `/profile`, `/my-resumes`, and edit pages
- 📱 **Mobile Responsive** – Optimized layout across devices (mobile, tablet, desktop)
- 🛠 **Profile Management** – Display email and secure password update feature

---

## 🛠️ Technologies Used

- **Frontend**: React + Vite + Tailwind CSS + jsPDF + html2canvas
- **Backend**: Node.js + Express.js + MongoDB Atlas + Mongoose
- **Authentication**: JWT (JSON Web Token)
- **Hosting**:  
  - Frontend: [Vercel](https://vercel.com/)  
  - Backend: [Render](https://render.com/)
- **Deployment & CI/CD**: GitHub + Vercel (auto deployment)

---

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/resumify.git
cd resumify
```
### 2. Install dependencies
Frontend

```bash
cd client
npm install
```
Backend
```bash
cd ../server
npm install
```
### 3. Set up environment variables
Backend: Create a .env file inside the server directory:
```bash
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
```
### 4. Run the app locally
Backend
```bash
cd server
npm run dev
```
Frontend
```bash
cd client
npm run dev
```

5. Access the app
Visit http://localhost:5173 to view the application locally.

🚀 Deployment 
<br/>
🔹 Frontend Deployment (Vercel)
1. Push client/ folder to GitHub.
2. Go to Vercel, create a new project.
3. Import the repo and set:
      - Build Command: npm run build
      - Output Directory: dist
4. Add any environment variables if needed (API base URL).
5. Deploy!
<br/>
🔸 Backend Deployment (Render)
Push server/ folder to GitHub.
Go to Render, create a new Web Service.
Connect your GitHub repo.
Set the start command:
```bash
npm run dev
```
5. Add environment variables:
    - MONGO_URI
    - JWT_SECRET
Deploy the backend.

🧪 Folder Structure
```bash
resumify/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/           # Login, Register, Profile, MyResumes
│   │   ├── templates/       # Resume templates (e.g., ModernProfessional.jsx)
│   │   ├── components/      # Navbar, ProtectedRoute, etc.
│   │   ├── context/         # AuthContext, ThemeContext
│   │   └── App.jsx
│   └── public/
│
├── server/                  # Express backend
│   ├── routes/              # authRoutes.js, templates.js, userResumes.js
│   ├── models/              # User, ResumeTemplate, etc.
│   └── index.js             # Main server entry
│
└── README.md
```
🔐 Environment Variables
Backend .env:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
### 🔑 Key Frontend Routes

* `/` – Homepage with all resume templates
* `/login` – User login
* `/register` – User registration
* `/profile` – Profile page (shows email, allows password change)
* `/my-resumes` – List of saved resumes (auth required)
* `/templatename/templateid` – Edit selected template
* `/my-resumes/:id` – Re-edit saved resume


### 📦 Key Backend API Endpoints

* `POST /api/auth/register` – Register user
* `POST /api/auth/login` – Authenticate user and return token
* `GET /api/templates/` – Get all templates
* `GET /api/templates/:id` – Get template by ID
* `POST /api/resumes/save` – Save resume data
* `GET /api/resumes/user` – Get all resumes saved by user
* `GET /api/resumes/:id` – Get specific resume data
* `PUT /api/user/update-password` – Update password

### 👨‍💻 Contribution

**Contributions are welcome!**
If you find bugs or want to add features, fork the repo and submit a pull request.

---

### 📜 License

This project is licensed under the [MIT License](LICENSE).

---

### 🙌 Acknowledgments

Built with ❤️ by **Rajesh R**
Thanks to the open-source tools, packages, and communities that made this project possible.
