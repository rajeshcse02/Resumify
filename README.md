# 📄 Resumify - Resume Builder MERN App

**Project Name**: Resumify  
**Website Link**: [resumify-khaki.vercel.app](https://resumify-khaki.vercel.app/) *(Update after deployment)*

---

## 🧠 Overview

**Resumify** is a full-featured resume builder web application built with the **MERN stack**. It allows users to register, log in, and choose from professional resume templates. With real-time WYSIWYG editing, users can build, preview (in A4 layout), and download resumes as PDF and PNG. The application providing a seamless resume-building experience.

![image](https://github.com/user-attachments/assets/0a484614-1e98-42c1-a2a0-9bf3d9d79d82)

---

## ✨ Features

- ✅ **User Authentication** – JWT-based secure login, registration, and logout
- 🧩 **Template Gallery** – Browse from multiple professional resume templates
- ✍️ **Live Editing** – Real-time WYSIWYG editing with preview
- 📄 **PDF Export** – Export resumes in consistent A4 format using jsPDF
- 🖼️ **PNG Export** - Export resumes in PNG using html2canvas
- 💾 **Save & Resume** – Save resume data and continue editing later
- 🔐 **Protected Routes** – Auth-required access to `/profile`, `/my-resumes`, and edit pages
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
1. Push server/ folder to GitHub.
2. Go to Render, create a new Web Service.
3. Connect your GitHub repo.
4. Set the start command:
```bash
npm run dev
```
5. Add environment variables:
    - MONGO_URI
    - JWT_SECRET
Deploy the backend.

🔐 Environment Variables
Backend .env:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 👨‍💻 Contribution

**Contributions are welcome!**
If you find bugs or want to add features, fork the repo and submit a pull request.


---

### 🙌 Acknowledgments

Built with ❤️ by **Rajesh R**
Thanks to the open-source tools, packages, and communities that made this project possible.
