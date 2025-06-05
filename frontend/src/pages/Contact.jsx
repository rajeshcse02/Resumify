import { useEffect } from 'react';  
const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const message = e.target.message.value;
        const mailtoLink = `mailto:rajeshcsengineer@gmail.com?subject=Regarding Resumify from - ${encodeURIComponent(name)}&body=${encodeURIComponent(`${message}\nContact me at: ${email}\nBest regards,\n${name}`)}`;
        window.location.href = mailtoLink;
    };

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-gradient-to-br from-white to-gray-100 dark:from-[#18181b] dark:to-[#23232a] min-h-screen flex flex-col items-center justify-center px-6 pt-28">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 via-blue-900 to-cyan-500 dark:from-white dark:to-cyan-600 drop-shadow-lg text-center">
                Contact Us
            </h1>
            <p className="mt-6 text-lg font-medium text-gray-800 dark:text-gray-300 max-w-xl text-center">
                Have questions or need assistance? Reach out to us, and we’ll get back to you as soon as possible.
            </p>
            <form className="mt-10 w-full max-w-lg bg-white dark:bg-[#23232a] p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Name</label>
                    <input type="text" id="name" name="name" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your Name" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email</label>
                    <input type="email" id="email" name="email" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your Email" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Message</label>
                    <textarea id="message" name="message" rows="4" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your Message" required></textarea>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:scale-105 transition"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default Contact;
