import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md shadow-md"
    >
      {darkMode ? <Sun className="text-white" /> : <Moon className="text-black" />}
    </button>
  );
};

export default ThemeToggle;
