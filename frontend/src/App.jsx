import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MyResumes from "./pages/MyResumes";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import TemplateRouter from "./components/TemplateRouter";
import Footer from "./components/Footer";


const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen font-cabin text-black bg-gradient-to-br from-white to-gray-300 dark:text-white dark:from-[#111112] dark:to-[#19191c] transition-colors">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/my-resumes" element={
                <PrivateRoute>
                  <MyResumes />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/about" element={<About />} />
              
              {/* Dynamic resume template editing route */}
              <Route path="/templates/:templateName/:templateId?" element={
                <PrivateRoute>
                  <TemplateRouter />
                </PrivateRoute>
              } />

              <Route path="*" element={<div className="text-center mt-20 text-2xl">Page Not Found</div>} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              closeOnClick
              pauseOnHover
              draggable
              theme="dark"
              toastClassName={() =>
                "backdrop-blur-md bg-white/10 border border-white/20 text-black dark:text-white shadow-md rounded-xl px-4 py-3 font-medium"
              }
              bodyClassName={() => "text-sm text-white"}
              progressClassName="bg-blue-400 h-1"
            />
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
