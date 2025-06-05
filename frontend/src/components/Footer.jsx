import { useEffect } from 'react';  
const Footer = () => {
    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);
    return (
        <footer className="py-6 mt-10 border-t border-gray-300 dark:border-gray-700">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-gray-700 dark:text-gray-300 text-sm">© 2025 Resumify. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 sm:mt-0">
                    <a href="/about" className="text-gray-700 dark:text-gray-300 text-sm hover:underline">About</a>
                    <a href="/contact" className="text-gray-700 dark:text-gray-300 text-sm hover:underline">Contact</a>
                    <a href="/privacy" className="text-gray-700 dark:text-gray-300 text-sm hover:underline">Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
