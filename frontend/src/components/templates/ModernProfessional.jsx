import { useState, useRef, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { toast } from "react-toastify";

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const ModernProfessional = () => {
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
        <div className="min-h-screen flex flex-col items-center pt-28 pb-4">
            <div className="w-full max-w-4xl flex flex-col items-center">
                <div
                    ref={previewRef}
                    id="preview"
                    className="relative bg-white shadow-2xl border border-gray-200 overflow-hidden"
                    style={{
                        width: `${A4_WIDTH_PX}px`,
                        height: `${A4_HEIGHT_PX}px`,
                        fontFamily: 'Poppins, sans-serif',
                        pointerEvents: 'auto',
                        opacity: 1,
                        filter: 'none',
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center bg-blue-700 text-white px-12 py-8">
                        <div className="flex-1">
                            <h1
                                className="text-4xl font-bold tracking-tight"
                                contentEditable
                                onBlur={e => handleFieldEdit('name', e)}
                                {...contentEditableProps}
                            >
                                {resume.name}
                            </h1>
                            <div
                                className="text-xl font-medium mt-1"
                                contentEditable
                                onBlur={e => handleFieldEdit('title', e)}
                                {...contentEditableProps}
                            >
                                {resume.title}
                            </div>
                        </div>
                        <div className="text-right space-y-1 text-sm">
                            {['email', 'phone', 'address', 'linkedin', 'website'].map(field => (
                                <div
                                    key={field}
                                    contentEditable
                                    onBlur={e => handleFieldEdit(field, e)}
                                    {...contentEditableProps}
                                >
                                    {resume[field]}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex px-12 py-8 gap-8">
                        {/* Left Column */}
                        <div className="w-1/3 pr-4 border-r border-gray-200">
                            {/* Profile */}
                            <div className="mb-8">
                                <h2 className="text-blue-700 font-bold text-lg mb-2 uppercase tracking-wider">
                                    Profile
                                </h2>
                                <div
                                    className="text-gray-800 text-base min-h-[40px]"
                                    contentEditable
                                    {...contentEditableProps}
                                    onBlur={e => handleFieldEdit('summary', e)}
                                >
                                    {resume.summary}
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="mb-8">
                                <h2 className="text-blue-700 font-bold text-lg mb-2 uppercase tracking-wider">
                                    Skills
                                </h2>
                                <ul className="flex flex-wrap gap-2">
                                    {resume.skills.map((skill, idx) => (
                                        <li key={idx} className="relative">
                                            <div className="inline-block items-center bg-blue-100 text-blue-800 px-3 pt-0 pb-4 rounded-full text-sm whitespace-nowrap break-keep min-h-[32px]">
                                                <span
                                                    contentEditable
                                                    onBlur={e => handleSkillEdit(idx, e)}
                                                    {...contentEditableProps}
                                                    className="outline-none"
                                                >
                                                    {skill}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className="ml-2 text-red-400 hover:text-red-600 text-xs font-bold"
                                                onClick={() => removeArrayItem('skills', idx)}
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    type="button"
                                    className="mt-2 text-blue-600 hover:underline text-xs"
                                    onClick={() => addArrayItem('skills')}
                                >
                                    + Add Skill
                                </button>
                            </div>



                            {/* Education */}
                            <div className="mb-8">
                                <h2 className="text-blue-700 font-bold text-lg mb-2 uppercase tracking-wider">
                                    Education
                                </h2>
                                <ul className="space-y-3">
                                    {resume.education.map((edu, idx) => (
                                        <li key={idx} className="relative group">
                                            <div
                                                contentEditable
                                                onBlur={e => handleArrayEdit('education', idx, 'degree', e)}
                                                {...contentEditableProps}
                                                className="font-semibold text-black dark:text-black"
                                            >
                                                {edu.degree}
                                            </div>
                                            <div
                                                contentEditable
                                                onBlur={e => handleArrayEdit('education', idx, 'school', e)}
                                                {...contentEditableProps}
                                                className="text-gray-700"
                                            >
                                                {edu.school}
                                            </div>
                                            <div
                                                contentEditable
                                                onBlur={e => handleArrayEdit('education', idx, 'duration', e)}
                                                {...contentEditableProps}
                                                className="text-gray-500 text-xs"
                                            >
                                                {edu.duration}
                                            </div>
                                            <button
                                                type="button"
                                                className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                                                onClick={() => removeArrayItem('education', idx)}
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    className="mt-2 text-blue-600 hover:underline text-xs"
                                    onClick={() => addArrayItem('education')}
                                >
                                    + Add Education
                                </button>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="w-2/3 pl-4">
                            <div className="mb-8">
                                <h2 className="text-blue-700 font-bold text-lg mb-2 uppercase tracking-wider">
                                    Experience
                                </h2>
                                <ul className="space-y-5">
                                    {resume.experience.map((exp, idx) => (
                                        <li key={idx} className="relative group">
                                            <div className="flex justify-between items-center">
                                                <div
                                                    contentEditable
                                                    onBlur={e => handleArrayEdit('experience', idx, 'position', e)}
                                                    {...contentEditableProps}
                                                    className="font-semibold text-black dark:text-black"
                                                >
                                                    {exp.position}
                                                </div>
                                                <div
                                                    contentEditable
                                                    onBlur={e => handleArrayEdit('experience', idx, 'duration', e)}
                                                    {...contentEditableProps}
                                                    className="text-gray-500 text-xs"
                                                >
                                                    {exp.duration}
                                                </div>
                                            </div>
                                            <div
                                                contentEditable
                                                onBlur={e => handleArrayEdit('experience', idx, 'company', e)}
                                                {...contentEditableProps}
                                                className="text-blue-800 font-medium"
                                            >
                                                {exp.company}
                                            </div>
                                            <div
                                                contentEditable
                                                onBlur={e => handleArrayEdit('experience', idx, 'description', e)}
                                                {...contentEditableProps}
                                                className="text-gray-800 text-sm mt-1 min-h-[24px]"
                                            >
                                                {exp.description}
                                            </div>
                                            <button
                                                type="button"
                                                className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                                                onClick={() => removeArrayItem('experience', idx)}
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    className="mt-2 text-blue-600 hover:underline text-xs"
                                    onClick={() => addArrayItem('experience')}
                                >
                                    + Add Experience
                                </button>
                            </div>

                            {/* Custom Sections */}
                            {customSections.map((section, idx) => (
                                <div key={idx} className="mb-8 relative group">
                                    <h2
                                        contentEditable
                                        onBlur={e => handleCustomSectionEdit(idx, 'title', e)}
                                        {...contentEditableProps}
                                        className="text-blue-700 font-bold text-lg mb-2 uppercase tracking-wider"
                                    >
                                        {section.title}
                                    </h2>
                                    <div
                                        contentEditable
                                        onBlur={e => handleCustomSectionEdit(idx, 'content', e)}
                                        {...contentEditableProps}
                                        className="text-gray-800 text-base min-h-[40px]"
                                    >
                                        {section.content}
                                    </div>
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
                                type="button"
                                className="mt-2 text-blue-600 hover:underline text-xs"
                                onClick={addCustomSection}
                            >
                                + Add Custom Section
                            </button>
                        </div>
                    </div>

                    {/* <div className="absolute bottom-4 right-8 text-xs text-blue-300 font-mono opacity-60">
                        Powered by Resume Builder
                    </div> */}
                </div>

                {/* Only show buttons if not in preview mode */}
                <div className="flex flex-row gap-6 mt-8">
                    <button
                        onClick={handleSaveResume}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
                    >
                        Save Resume
                    </button>
                    <button
                        onClick={downloadPDF}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
                    >
                        Download as PDF
                    </button>
                    <button
                        onClick={downloadPNG}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
                    >
                        Download as PNG
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModernProfessional;
