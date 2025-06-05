import { useEffect } from 'react';  
const About = () => {
    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="pt-24 min-h-screen animate-fadeIn">
            <section className="min-h-[calc(100vh-6rem)]  flex items-center justify-center px-4">
                <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 flex flex-col gap-6">
                    <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-2">
                        About Resume Builder
                    </h1>
                    <p className="text-lg text-gray-700 dark:text-gray-200">
                        Resume Builder is your modern solution for crafting professional, eye-catching resumes with ease. Designed with a sleek, intuitive interface, our platform empowers you to create, customize, and download resumes that stand out in today’s competitive job market.
                    </p>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">Why Choose Us?</h2>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 space-y-1">
                            <li>Modern, customizable templates tailored for every industry</li>
                            <li>Real-time preview and editing for a seamless experience</li>
                            <li>Easy export to PDF and other formats</li>
                            <li>Privacy-focused: your data stays on your device</li>
                            <li>Accessible on any device, anytime</li>
                        </ul>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900 rounded-xl p-6 mt-4 flex flex-col items-center">
                        <span className="text-5xl mb-2">🚀</span>
                        <p className="text-indigo-700 dark:text-indigo-200 font-medium text-center">
                            Start building your future today with Resume Builder — where your career journey begins with a standout resume.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;