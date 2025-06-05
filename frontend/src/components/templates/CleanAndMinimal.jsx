import { useState, useRef, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { toast } from "react-toastify";

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const CleanAndMinimal = () => {
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
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user-resumes/${templateId}`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                const data = await res.json();
                setResume(data.resumeData);
                setCustomSections(data.resumeData.customSections || []);
            } else {
                // Load template dummy data
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/templates/${templateName}`);
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
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user-resumes`, {
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
                        fontFamily: 'Lato, sans-serif',
                        pointerEvents: 'auto',
                        opacity: 1,
                        filter: 'none',
                    }}
                >
                    {/* Header with accent color */}
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 h-20"></div>

                    {/* Main Content */}
                    <div className="px-12 py-8">
                        {/* Name and Title */}
                        <div className="text-center mb-10">
                            <h1
                                className="text-5xl font-light text-gray-800 tracking-wide"
                                contentEditable
                                onBlur={e => handleFieldEdit('name', e)}
                                {...contentEditableProps}
                            >
                                {resume.name}
                            </h1>
                            <div
                                className="text-xl text-gray-600 mt-2"
                                contentEditable
                                onBlur={e => handleFieldEdit('title', e)}
                                {...contentEditableProps}
                            >
                                {resume.title}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="flex justify-center space-x-6 mb-10 text-sm text-gray-600">
                            {['email', 'phone', 'website', 'linkedin'].map(field => (
                                <div
                                    key={field}
                                    className="flex items-center"
                                    contentEditable
                                    onBlur={e => handleFieldEdit(field, e)}
                                    {...contentEditableProps}
                                >
                                    <span className="mr-1">
                                        {field === 'email' && '✉️'}
                                        {field === 'phone' && '📱'}
                                        {field === 'website' && '🌐'}
                                        {field === 'linkedin' && '🔗'}
                                    </span>
                                    {resume[field]}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            {/* Left Column - Experience and Custom Sections */}
                            <div className="w-7/12 pr-8">
                                <div className="border-b-2 border-teal-500 pb-2 mb-6">
                                    <h2 className="text-xl font-semibold text-teal-700">Experience</h2>
                                </div>
                                <ul className="space-y-6">
                                    {resume.experience.map((exp, idx) => (
                                        <li key={idx} className="relative group">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div
                                                        contentEditable
                                                        onBlur={e => handleArrayEdit('experience', idx, 'position', e)}
                                                        {...contentEditableProps}
                                                        className="font-semibold text-gray-800 text-lg"
                                                    >
                                                        {exp.position}
                                                    </div>
                                                    <div
                                                        contentEditable
                                                        onBlur={e => handleArrayEdit('experience', idx, 'company', e)}
                                                        {...contentEditableProps}
                                                        className="text-teal-600"
                                                    >
                                                        {exp.company}
                                                    </div>
                                                </div>
                                                <div
                                                    contentEditable
                                                    onBlur={e => handleArrayEdit('experience', idx, 'duration', e)}
                                                    {...contentEditableProps}
                                                    className="text-gray-500 text-sm"
                                                >
                                                    {exp.duration}
                                                </div>
                                            </div>
                                            <div
                                                contentEditable
                                                onBlur={e => handleArrayEdit('experience', idx, 'description', e)}
                                                {...contentEditableProps}
                                                className="text-gray-700 mt-2"
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
                                    className="mt-4 text-teal-600 hover:underline text-sm flex items-center"
                                    onClick={() => addArrayItem('experience')}
                                >
                                    <span className="mr-1">+</span> Add Experience
                                </button>

                                {/* Custom Sections moved to left */}
                                {customSections.map((section, idx) => (
                                    <div key={idx} className="mb-6 relative group">
                                        <div className="border-b-2 border-teal-500 pb-2 mb-3">
                                            <h2
                                                contentEditable
                                                onBlur={e => handleCustomSectionEdit(idx, 'title', e)}
                                                {...contentEditableProps}
                                                className="text-xl font-semibold text-teal-700"
                                            >
                                                {section.title}
                                            </h2>
                                        </div>
                                        <div
                                            contentEditable
                                            onBlur={e => handleCustomSectionEdit(idx, 'content', e)}
                                            {...contentEditableProps}
                                            className="text-gray-700"
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
                                    className="text-teal-600 hover:underline text-sm flex items-center"
                                    onClick={addCustomSection}
                                >
                                    <span className="mr-1">+</span> Add Custom Section
                                </button>
                            </div>

                            {/* Right Column - Skills, Education */}
                            <div className="w-5/12 pl-8 border-l border-gray-200">
                                {/* Summary */}
                                <div className="mb-8">
                                    <div className="border-b-2 border-teal-500 pb-2 mb-3">
                                        <h2 className="text-xl font-semibold text-teal-700">Summary</h2>
                                    </div>
                                    <div
                                        className="text-gray-700"
                                        contentEditable
                                        {...contentEditableProps}
                                        onBlur={e => handleFieldEdit('summary', e)}
                                    >
                                        {resume.summary}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="mb-8">
                                    <div className="border-b-2 border-teal-500 pb-2 mb-3">
                                        <h2 className="text-xl font-semibold text-teal-700">Skills</h2>
                                    </div>
                                    <ul className="flex flex-wrap gap-2">
                                        {resume.skills.map((skill, idx) => (
                                            <li key={idx} className="relative group">
                                                <div className="bg-teal-100 text-teal-800 px-3 pt-0 pb-4 rounded-full text-sm">
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
                                                    className="ml-1 text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                                                    onClick={() => removeArrayItem('skills', idx)}
                                                >
                                                    ×
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        type="button"
                                        className="mt-3 text-teal-600 hover:underline text-sm flex items-center"
                                        onClick={() => addArrayItem('skills')}
                                    >
                                        <span className="mr-1">+</span> Add Skill
                                    </button>
                                </div>

                                {/* Education */}
                                <div className="mb-8">
                                    <div className="border-b-2 border-teal-500 pb-2 mb-3">
                                        <h2 className="text-xl font-semibold text-teal-700">Education</h2>
                                    </div>
                                    <ul className="space-y-4">
                                        {resume.education.map((edu, idx) => (
                                            <li key={idx} className="relative group">
                                                <div
                                                    contentEditable
                                                    onBlur={e => handleArrayEdit('education', idx, 'degree', e)}
                                                    {...contentEditableProps}
                                                    className="font-semibold text-gray-800"
                                                >
                                                    {edu.degree}
                                                </div>
                                                <div
                                                    contentEditable
                                                    onBlur={e => handleArrayEdit('education', idx, 'school', e)}
                                                    {...contentEditableProps}
                                                    className="text-teal-600"
                                                >
                                                    {edu.school}
                                                </div>
                                                <div
                                                    contentEditable
                                                    onBlur={e => handleArrayEdit('education', idx, 'duration', e)}
                                                    {...contentEditableProps}
                                                    className="text-gray-500 text-sm"
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
                                        className="mt-3 text-teal-600 hover:underline text-sm flex items-center"
                                        onClick={() => addArrayItem('education')}
                                    >
                                        <span className="mr-1">+</span> Add Education
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row gap-6 mt-8">
                    <button
                        onClick={handleSaveResume}
                        className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
                    >
                        Save Resume
                    </button>
                    <button
                        onClick={downloadPDF}
                        className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
                    >
                        Download as PDF
                    </button>
                    <button
                        onClick={downloadPNG}
                        className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
                    >
                        Download as PNG
                    </button>
                </div>
            </div>
        </div>
    );
};


export default CleanAndMinimal;
