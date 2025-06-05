import { useState } from "react";
import { Moon, Sun, User, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import Logo from "../assets/resumify.png";
import LogoDark from "../assets/resumify_dark.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Open drawer with animation
  const openMenu = () => {
    setDrawerVisible(true);
    setTimeout(() => setIsMenuOpen(true), 10); // allow mount before animating
  };

  // Close drawer with animation
  const closeMenu = () => {
    setIsMenuOpen(false);
    setTimeout(() => setDrawerVisible(false), 300); // match transition duration
  };

  const handleLogout = () => {
    try {
      if (!user) {
        toast.error("You are already logged out.");
        return;
      }
      logout();
      toast.success("Logged out successfully!");
      navigate("/");
      closeMenu();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong while logging out.");
      closeMenu();
    }
  };

  return (
    <>
      {/* MOBILE NAVBAR */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-white/30 dark:bg-black/10 backdrop-blur-md shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Hamburger Button */}
          <button
            onClick={openMenu}
            className="text-black dark:text-white"
          >
            <Menu size={24} />
          </button>

          {/* Centered Logo */}
          <div className="relative">
            <Link to="/">
              {darkMode ? (
                <img
                  src={LogoDark}
                  alt="Resumify Logo"
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <img
                  src={Logo}
                  alt="Resumify Logo"
                  className="h-8 w-auto object-contain"
                />
              )}
            </Link>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-black dark:text-white"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* OVERLAY + ANIMATED DRAWER */}
      {drawerVisible && (
        <>
          {/* Overlay */}
          <div
            onClick={closeMenu}
            className={`
              fixed inset-0
              bg-black/30 dark:bg-black/50
              backdrop-blur-md
              z-40
              transition-opacity duration-300
              ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
          />
          {/* Drawer */}
          <div
            className={`
              fixed top-0 left-0 h-full w-3/4
              bg-white/50 dark:bg-black/50
              z-50 backdrop-blur-md
              transition-transform duration-300 ease-in-out
              ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
            style={{ willChange: "transform" }}
          >
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeMenu}
                className="text-black dark:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Menu Links */}
            <nav className="flex flex-col items-start px-6 space-y-6 mt-4 text-black dark:text-white">
              <Link
                to="/"
                onClick={closeMenu}
                className="text-lg font-medium hover:underline"
              >
                Resumes
              </Link>

              <Link
                to="/my-resumes"
                onClick={closeMenu}
                className="text-lg font-medium hover:underline"
              >
                My Resumes
              </Link>

              <Link
                to="/about"
                onClick={closeMenu}
                className="text-lg font-medium hover:underline"
              >
                About
              </Link>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-lg font-medium text-left hover:underline"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to={location.pathname === "/login" ? "/register" : "/login"}
                  onClick={closeMenu}
                  className="text-lg font-medium hover:underline"
                >
                  {location.pathname === "/login" ? "Register" : "Login"}
                </Link>
              )}

              <Link
                to="/profile"
                onClick={closeMenu}
                className="text-lg font-medium hover:underline"
              >
                Profile
              </Link>
            </nav>
          </div>
        </>
      )}

      {/* DESKTOP NAVBAR */}
      <nav className="hidden md:flex fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95vw] max-w-3xl bg-white/10 dark:bg-black/20 backdrop-blur-md shadow-lg rounded-full px-3 py-3 border border-white/20 text-black dark:text-white">
        <div className="relative flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-inherit"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link to="/" className="text-sm font-medium text-inherit">
              Resumes
            </Link>
            <Link to="/my-resumes" className="text-sm font-medium text-inherit">
              My Resumes
            </Link>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/">
              {darkMode ? (
                <img
                  src={LogoDark}
                  alt="Resumify Logo"
                  className="h-28 w-auto object-contain"
                />
              ) : (
                <img
                  src={Logo}
                  alt="Resumify Logo"
                  className="h-28 w-auto object-contain"
                />
              )}
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/about" className="text-sm font-medium text-inherit">
              About
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-inherit"
              >
                Logout
              </button>
            ) : (
              <Link
                to={location.pathname === "/login" ? "/register" : "/login"}
                className="text-sm font-medium text-inherit"
              >
                {location.pathname === "/login" ? "Register" : "Login"}
              </Link>
            )}

            <Link to="/profile">
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-white font-semibold uppercase">
                {user?.name?.[0] || <User size={18} />}
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
