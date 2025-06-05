import { useState, useRef, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { toast } from "react-toastify";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const Elegant = () => {
    const [resume, setResume] = useState(null);
    const [customSections, setCustomSections] = useState([]);
    const previewRef = useRef();
    const { templateName, templateId } = useParams();
    const { user } = useAuth();
    const [forceDesktop, setForceDesktop] = useState(false);

  useEffect(() => {
    const isMobileDevice =
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      window.innerWidth < 768;
    const alreadyShown = localStorage.getItem("forceDesktopShown") === "true";
    if (isMobileDevice && !alreadyShown) {
      const userClickedOK = window.confirm(
        "📢 For the best experience, please use Desktop View.\n\nPress OK to switch into desktop layout now."
      );
      if (userClickedOK) {
        localStorage.setItem("forceDesktopShown", "true");
        setForceDesktop(true);
      } else {
        localStorage.setItem("forceDesktopShown", "true");
      }
    }
  }, []);

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (templateId) {
                // Load user's saved resume
                const res = await fetch(`http://localhost:5000/api/user-resumes/${templateId}`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                const data = await res.json();
                setResume(data.resumeData);
                setCustomSections(data.resumeData.customSections || []);
            } else {
                // Load template dummy data
                const res = await fetch(`http://localhost:5000/api/templates/${templateName}`);
                const data = await res.json();
                setResume(data.dummyData);
                setCustomSections(data.dummyData.customSections || []);
            }
        };
        fetchData();
    }, [templateName, templateId, user]);

    const contentEditableProps = {
        dir: 'ltr',
        style: { direction: 'ltr', unicodeBidi: 'plaintext', textAlign: 'left', outline: 'none' },
        suppressContentEditableWarning: true,
    };

    // ✅ Edits a single field (like name or summary)
    const handleFieldEdit = (field, e) => {
        setResume(prev => ({
            ...prev,
            [field]: e.target.innerText,
        }));
    };

    // ✅ Edits an item in experience or education
    const handleArrayEdit = (section, idx, key, e) => {
        setResume(prev => {
            const updated = [...prev[section]];
            updated[idx][key] = e.target.innerText;
            return {
                ...prev,
                [section]: updated,
            };
        });
    };

    // ✅ Edits a skill string directly
    const handleSkillEdit = (idx, e) => {
        setResume(prev => {
            const updated = [...prev.skills];
            updated[idx] = e.target.innerText;
            return {
                ...prev,
                skills: updated,
            };
        });
    };

    // ✅ Adds a new array item to experience, education, or skills
    const addArrayItem = section => {
        setResume(prev => {
            if (section === 'experience') {
                return {
                    ...prev,
                    experience: [
                        ...prev.experience,
                        {
                            position: 'New Position',
                            company: 'Company',
                            duration: 'Year - Year',
                            description: '',
                        },
                    ],
                };
            } else if (section === 'education') {
                return {
                    ...prev,
                    education: [
                        ...prev.education,
                        {
                            degree: 'New Degree',
                            school: 'School',
                            duration: 'Year - Year',
                        },
                    ],
                };
            } else if (section === 'skills') {
                return {
                    ...prev,
                    skills: [...prev.skills, 'New Skill'],
                };
            } else {
                return prev;
            }
        });
    };

    // ✅ Removes an item from experience, education, or skills
    const removeArrayItem = (section, idx) => {
        setResume(prev => {
            const updatedSection = prev[section].filter((_, i) => i !== idx);
            return {
                ...prev,
                [section]: updatedSection,
            };
        });
    };

    // ✅ Adds a custom section
    const addCustomSection = () => {
        setCustomSections(prev => [
            ...prev,
            {
                title: 'Custom Section',
                content: 'Describe here...',
            },
        ]);
    };

    // ✅ Edits custom section (fixing incorrect `prev` usage)
    const handleCustomSectionEdit = (idx, key, e) => {
        setCustomSections(prev => {
            const updated = [...prev];
            updated[idx][key] = e.target.innerText;
            return updated;
        });
    };

    // ✅ Removes a custom section
    const removeCustomSection = idx => {
        setCustomSections(prev => prev.filter((_, i) => i !== idx));
    };


    const downloadPDF = async () => {
        const input = previewRef.current;
        input.style.boxShadow = 'none';
        input.style.transition = 'none';

        const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            scrollY: -window.scrollY,
            onclone: doc => {
                const p = doc.getElementById('preview');
                p.style.boxShadow = 'none';
                p.querySelectorAll('button').forEach(el => el.remove());
            },
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(canvas);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);

        pdf.addImage(
            canvas,
            'PNG',
            (pdfWidth - imgProps.width * ratio) / 2,
            (pdfHeight - imgProps.height * ratio) / 2,
            imgProps.width * ratio,
            imgProps.height * ratio
        );
        pdf.save('resume.pdf');

        input.style.boxShadow = '';
        input.style.transition = '';
    };

    const downloadPNG = async () => {
        const input = previewRef.current;
        input.style.boxShadow = 'none';
        input.style.transition = 'none';

        const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            scrollY: -window.scrollY,
            onclone: doc => {
                const p = doc.getElementById('preview');
                p.style.boxShadow = 'none';
                p.querySelectorAll('button').forEach(el => el.remove());
            },
        });

        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'resume.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        input.style.boxShadow = '';
        input.style.transition = '';
    };

    const handleSaveResume = async () => {
        try {
            const payload = {
                _id: templateId,
                templateName,
                resumeData: { ...resume, customSections }
            };
            await fetch('http://localhost:5000/api/user-resumes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`,
                },
                body: JSON.stringify(payload),
            });
            toast.success('Resume saved successfully!');
        } catch (error) {
            console.error('Error saving resume:', error);
            toast.error('Failed to save resume. Please try again.');
        }
    };


    if (!resume) return <div className="min-h-screen flex flex-col items-center pt-28 pb-4"> Loading....</div>; // or a loading spinner

    return (
        
        <div className="min-h-screen flex flex-col justify-between items-center pt-28 py-12 bg-gray-50 dark:bg-[#18181b]">
            <div className="w-full flex flex-col items-center overflow-x-hidden">
                <div
                    ref={previewRef}
                    id="preview"
                    className="bg-white shadow-lg flex flex-col justify-between"
                    style={{
                        width: `${A4_WIDTH_PX}px`,
                        height: `${A4_HEIGHT_PX}px`,
                        fontFamily: "Poppins, sans-serif",
                    }}
                >
                
                    {/* Header */}
                    <div className="bg-red-800 h-6 w-full"></div>
                    <div className="flex flex-col items-center justify-center text-black py-4">
                        <h1
                            className="text-3xl font-bold text-center"
                            contentEditable
                            {...contentEditableProps}
                            onBlur={(e) => handleFieldEdit('name', e)}
                        >
                            {resume.name || 'Your Name'}
                        </h1>
                        <div
                            className="text-md mt-3 text-center"
                            contentEditable
                            {...contentEditableProps}
                            onBlur={(e) => handleFieldEdit('title', e)}
                        >
                            {resume.title || 'Your Title'}
                        </div>
                    </div>
                    <div className="w-full flex justify-center">
                        <hr className="border-t-1 border-gray-200 w-3/4" />
                    </div>
                    <div className="flex p-8 gap-10 text-sm text-gray-800 flex-grow">
                        {/* Left Column */}
                        <div className="w-1/2 space-y-8 pr-6 border-r border-gray-300">
                            {/* Profile */}
                            <div>
                                <h2 className="text-red-700 font-bold text-lg mb-2 flex items-center gap-2">
                                    Profile
                                </h2>
                                <ul className="list-none">
                                    {resume.email && (
                                        <li>
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l-4-4-4 4m8 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" />
                                                </svg>
                                                <span
                                                    className='mb-4'
                                                    contentEditable
                                                    {...contentEditableProps}
                                                    onBlur={e => handleFieldEdit('email', e)}
                                                >
                                                    {resume.email}
                                                </span>
                                            </span>
                                        </li>
                                    )}

                                    {resume.phone && (
                                        <li>
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm10-10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                </svg>
                                                <span
                                                    className='mb-4'
                                                    contentEditable
                                                    {...contentEditableProps}
                                                    onBlur={e => handleFieldEdit('phone', e)}
                                                >
                                                    {resume.phone}
                                                </span>
                                            </span>
                                        </li>
                                    )}

                                    {resume.linkedin && (
                                        <li>
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.867-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z" />
                                                </svg>
                                                <span
                                                    className='mb-4'
                                                    contentEditable
                                                    {...contentEditableProps}
                                                    onBlur={e => handleFieldEdit('linkedin', e)}
                                                >
                                                    {resume.linkedin}
                                                </span>
                                            </span>
                                        </li>
                                    )}

                                    {resume.address && (
                                        <li>
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 10c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8z" />
                                                </svg>
                                                <span
                                                    className='mb-4'
                                                    contentEditable
                                                    {...contentEditableProps}
                                                    onBlur={e => handleFieldEdit('address', e)}
                                                >
                                                    {resume.address}
                                                </span>
                                            </span>
                                        </li>
                                    )}

                                    {resume.website && (
                                        <li>
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 0v18m0-18c2.21 0 4 4.03 4 9s-1.79 9-4 9m0-18c-2.21 0-4 4.03-4 9s1.79 9 4 9" />
                                                </svg>
                                                <span
                                                    className='mb-4'
                                                    contentEditable
                                                    {...contentEditableProps}
                                                    onBlur={e => handleFieldEdit('website', e)}
                                                >
                                                    {resume.website}
                                                </span>
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-red-700 font-bold text-lg     mb-2">
                                    Education
                                </h2>
                                {resume.education.map((edu, idx) => (
                                    <div key={idx} className="relative group">
                                        <p
                                            className="font-semibold"
                                            contentEditable
                                            {...contentEditableProps}
                                            onBlur={(e) => handleArrayEdit('education', idx, 'degree', e)}
                                        >
                                            {edu.degree}
                                        </p>
                                        <p
                                            contentEditable
                                            {...contentEditableProps}
                                            onBlur={(e) => handleArrayEdit('education', idx, 'school', e)}
                                        >
                                            {edu.school}
                                        </p>
                                        <p
                                            className="italic text-gray-600"
                                            contentEditable
                                            {...contentEditableProps}
                                            onBlur={(e) => handleArrayEdit('education', idx, 'duration', e)}
                                        >
                                            {edu.duration}
                                        </p>
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                                            onClick={() => removeArrayItem('education', idx)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="text-red-700 underline mt-2"
                                    onClick={() => addArrayItem('education')}
                                >
                                    +Add Education
                                </button>
                            </div>

                            {/* Skills */}
                            <div>
                                <h2 className="text-red-700 font-bold text-lg mb-2">
                                    Skills
                                </h2>
                                <ul>
                                    {resume.skills.map((skill, idx) => (
                                        <li key={idx} className="relative group">
                                            <span
                                                contentEditable
                                                {...contentEditableProps}
                                                onBlur={(e) => handleSkillEdit(idx, e)}
                                            >
                                                • {skill}
                                            </span>
                                            <button
                                                type="button"
                                                className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                                                onClick={() => removeArrayItem('skills', idx)}
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className="text-red-700 underline mt-2"
                                    onClick={() => addArrayItem('skills')}
                                >
                                    +Add skills
                                </button>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="w-5/6 space-y-8">
                            {/* About Me */}
                            <div>
                                <h2 className="text-red-700 font-bold text-lg     mb-2">
                                    About Me
                                </h2>
                                <p
                                    contentEditable
                                    {...contentEditableProps}
                                    onBlur={(e) => handleFieldEdit('aboutMe', e)}
                                >
                                    {resume.summary || 'Write about yourself here...'}
                                </p>
                            </div>

                            {/* Experience */}
                            <div>
                                <h2 className="text-red-700 font-bold text-lg     mb-2">
                                    Experience
                                </h2>
                                {resume.experience.map((exp, idx) => (
                                    <div key={idx} className="relative group">
                                        <p
                                            className="font-semibold"
                                            contentEditable
                                            {...contentEditableProps}
                                            onBlur={(e) => handleArrayEdit('experience', idx, 'position', e)}
                                        >
                                            {exp.position}
                                        </p>
                                        <p
                                            contentEditable
                                            {...contentEditableProps}
                                            onBlur={(e) => handleArrayEdit('experience', idx, 'company', e)}
                                        >
                                            {exp.company}
                                        </p>
                                        <p
                                            className="text-gray-700"
                                            contentEditable
                                            {...contentEditableProps}
                                            onBlur={(e) => handleArrayEdit('experience', idx, 'description', e)}
                                        >
                                            {exp.description}
                                        </p>
                                        <p
                                            className="italic text-gray-600"
                                            contentEditable
                                            {...contentEditableProps}
                                            onBlur={(e) => handleArrayEdit('experience', idx, 'duration', e)}
                                        >
                                            {exp.duration}
                                        </p>
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                                            onClick={() => removeArrayItem('experience', idx)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="text-red-700 underline mt-2"
                                    onClick={() => addArrayItem('experience')}
                                >
                                    +Add experience
                                </button>
                            </div>

                            {/* Custom Sections */}
                            <div>
                                {customSections.map((section, idx) => (
                                    <div key={idx} className="relative group">
                                        <h2
                                            className="text-red-700 font-bold text-lg     mb-2"
                                            contentEditable
                                            {...contentEditableProps}
                                            onBlur={(e) => handleCustomSectionEdit(idx, 'title', e)}
                                        >
                                            {section.title}
                                        </h2>
                                        <p
                                            className="text-gray-700 mb-4"
                                            contentEditable
                                            {...contentEditableProps}
                                            onBlur={(e) => handleCustomSectionEdit(idx, 'content', e)}
                                        >
                                            {section.content}
                                        </p>
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                                            onClick={() => removeCustomSection(idx)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="text-red-700 underline mt-2"
                                    onClick={addCustomSection}
                                >
                                    +Add Custom sections
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-red-800 h-6 w-full"></div>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={handleSaveResume}
                        className="bg-gradient-to-r from-red-600 to-red-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
                    >
                        Save Resume
                    </button>
                    <button
                        onClick={downloadPDF}
                        className="bg-gradient-to-r from-red-600 to-red-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
                    >
                        Download as PDF
                    </button>
                    <button
                        onClick={downloadPNG}
                        className="bg-gradient-to-r from-red-600 to-red-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
                    >
                        Download as PNG
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Elegant;

