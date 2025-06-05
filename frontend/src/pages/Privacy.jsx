import { useEffect } from 'react';  
const Privacy = () => {
    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-gradient-to-br from-white to-gray-100 dark:from-[#18181b] dark:to-[#23232a] min-h-screen flex flex-col items-center justify-center px-6 pt-28">
            <h1 className="h-12 text-4xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 via-blue-900 to-cyan-500 dark:from-white dark:to-cyan-600 drop-shadow-lg text-center" >
                Privacy Policy
            </h1>
            <div className="mt-5 w-full max-w-3xl bg-white dark:bg-[#23232a] p-6 rounded-lg shadow-lg">
                <p className="text-gray-800 dark:text-gray-300 mb-4">
                    At Resumify, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.
                </p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Information We Collect</h2>
                <p className="text-gray-800 dark:text-gray-300 mb-4">
                    We may collect personal information such as your name, email address, and resume details when you use our services.
                </p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">How We Use Your Information</h2>
                <p className="text-gray-800 dark:text-gray-300 mb-4">
                    Your information is used to provide and improve our services, communicate with you, and ensure a seamless experience.
                </p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Data Security</h2>
                <p className="text-gray-800 dark:text-gray-300 mb-4">
                    We implement robust security measures to protect your data from unauthorized access, alteration, or disclosure.
                </p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your Rights</h2>
                <p className="text-gray-800 dark:text-gray-300 mb-4">
                    You have the right to access, update, or delete your personal information. Contact us for assistance.
                </p>
                <p className="text-gray-800 dark:text-gray-300">
                    For more details, feel free to reach out to us at <a href="mailto:support@resumify.com" className="text-blue-600 dark:text-cyan-400 hover:underline">support@resumify.com</a>.
                </p>
            </div>
        </div>
    );
};

export default Privacy;
