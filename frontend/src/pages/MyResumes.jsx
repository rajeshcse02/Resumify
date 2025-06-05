import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from "react-toastify";

const MyResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user-resumes`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await res.json();
        setResumes(Array.isArray(data) ? data : []);
      } catch (err) {
        setResumes([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) {
      fetchResumes();
    }
  }, [user]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleEdit = (resume) => {
    navigate(`/templates/${resume.templateName}/${resume._id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/user-resumes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (res.ok) {
        setResumes(resumes.filter((r) => r._id !== id));
        toast.success('Resume deleted successfully');
      } else {
        console.error('Failed to delete resume');
        toast.error('Failed to delete resume');
      }
    } catch (err) {
      console.error('Error deleting resume', err);
      toast.error('Error deleting resume');
    }
  };

  return (
    <div className="min-h-screen p-6 pt-28">
      <h1 className="text-3xl font-bold mb-6 text-center">My Saved Resumes</h1>
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : resumes.length === 0 ? (
        <div className="text-center text-gray-600">You have no saved resumes.</div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="bg-transparent flex flex-col items-center relative"
            >
              <div
                className="relative rounded-lg flex items-center justify-center border border-gray-300 shadow-lg"
                style={{
                  width: '220px',
                  height: '310px',
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
                }}
              >
                {/* Delete icon */}
                <button
                  className="absolute top-2 right-2 bg-gradient-to-br from-black/80 to-black/40 rounded-full p-2 text-red-500 hover:text-red-700 z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(resume._id);
                  }}
                >
                  <FaTrashAlt size={18} />
                </button>

                {resume?.resumeData?.image ? (
                  <img
                    src={resume.resumeData.image}
                    alt={resume.templateName}
                    className="object-contain max-h-full max-w-full rounded-md transition-transform duration-200 hover:scale-105"
                    style={{ width: '210px', height: '300px', display: 'block' }}
                    onClick={() => handleEdit(resume)}
                  />
                ) : (
                  <div
                    className="h-[300px] w-[210px] bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-sm"
                    onClick={() => handleEdit(resume)}
                  >
                    No Preview
                  </div>
                )}

                <button
                  className="absolute left-1/2 -translate-x-1/2 bottom-6 px-3 py-1.5 bg-gradient-to-br from-black/80 to-black/40 dark:from-white/80 dark:to-white/30 text-white dark:text-black rounded font-semibold transition-transform duration-200 hover:scale-105 shadow-lg z-10 h-8 w-40 text-sm hover:bg-blue-700"
                  onClick={() => handleEdit(resume)}
                >
                  Edit Resume
                </button>
              </div>

              <span className="mt-5 text-xl font-bold text-gray-900 dark:text-white text-center">
                {resume.templateName}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyResumes;
