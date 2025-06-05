import { use, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import defaultTemplate from '../assets/default-template.png';
import '../../src/index.css';

const Home = () => {
  const [templates, setTemplates] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userResumes, setUserResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/templates')
      .then((res) => {
        setTemplates(res.data);
        setLoading(false);
      })
      .catch(() => {
        setTemplates([]);
        setLoading(false);
      });

    if (user?.token) {
      axios
        .get('http://localhost:5000/api/user-resumes', {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setUserResumes(res.data))
        .catch(() => setUserResumes([]));
    } else {
      setUserResumes([]);
    }
  }, [user]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleTemplateClick = (tpl) => {
    if (!user?.token) {
      navigate(`/templates/${tpl.name}`);
      return;
    }
    const existing = userResumes.find((r) => r.templateName === tpl.name);
    if (existing) {
      navigate(`/templates/${tpl.name}/${existing._id}`);
    } else {
      navigate(`/templates/${tpl.name}`);
    }
  };

  /**
   * Variant for fading in and sliding up a single element.
   *   - initial: hidden (opacity 0, y: 20)
   *   - animate (whileInView): visible (opacity 1, y: 0)
   */
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  /**
   * Variants for the templates grid container to stagger‐reveal children.
   *   - hidden: no children are visible
   *   - visible: children appear in sequence with 0.2s stagger
   */
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  /**
   * Variant for each grid item (template card).
   *   - hidden: opacity 0, y: 20
   *   - visible: opacity 1, y: 0
   */
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center min-h-screen px-6">
        {/* Heading */}
        <motion.h1
          className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 via-blue-900 to-cyan-500 dark:from-white dark:to-cyan-600 drop-shadow-lg"
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Craft Your Standout Resume
        </motion.h1>

        {/* Sub‐text */}
        <motion.p
          className="mt-6 text-lg font-medium text-gray-800 dark:text-gray-300 max-w-xl"
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Build, customize, and download your professional resume in minutes. Get started now!
        </motion.p>

        {/* Down Arrow */}
        <motion.div
          className="mt-16 text-blue-600 dark:text-cyan-400 text-3xl animate-bounce"
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          ↓
        </motion.div>
      </section>

      {/* Templates Section */}
      <section className="py-20 px-4">
        <motion.h2
          className="text-center text-3xl font-bold mb-10 text-gray-800 dark:text-white"
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Choose a Template
        </motion.h2>

        {loading ? (
          <div className="flex justify-center items-center min-h-[350px]">
            <svg
              className="animate-spin h-10 w-10 text-blue-600 dark:text-white-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          </div>
        ) : (
          <motion.div
            className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {templates.map((tpl) => (
              <motion.div
                key={tpl.name}
                className="flex flex-col items-center"
                variants={itemVariants}
              >
                {/* Card Container */}
                <div
                  className="relative bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-700 shadow-lg"
                  style={{
                    width: '220px',
                    height: '310px',
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
                  }}
                >
                  <img
                    src={tpl?.dummyData?.image || defaultTemplate}
                    alt={tpl.displayName}
                    className="object-contain max-h-full max-w-full rounded-md transition-transform duration-200 hover:scale-105"
                    style={{ width: '210px', height: '300px', display: 'block' }}
                    onClick={() => handleTemplateClick(tpl)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultTemplate;
                    }}
                  />

                  {/* Overlay “Use Template” Button */}
                  <button
                    className="absolute left-1/2 -translate-x-1/2 bottom-6 px-3 py-1.5 bg-gradient-to-br from-black/80 to-black/40 dark:from-white/80 dark:to-white/30 text-white dark:text-black rounded font-semibold transition-transform duration-200 hover:scale-105 shadow-lg z-10 h-8 w-40 text-sm hover:bg-blue-700"
                    onClick={() => handleTemplateClick(tpl)}
                  >
                    Use Template
                  </button>
                </div>

                {/* Template Name */}
                <span className="mt-5 text-xl font-bold text-gray-900 dark:text-white text-center">
                  {tpl.displayName}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Home;
