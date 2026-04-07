import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Builder() {
    const [formData, setFormData] = useState({
        userName: '', dob: '', email: '', phone: '', address: '',
        summary: '', experience: '', education: '', projects: '', skills: ''
    });
    const [isExpired, setIsExpired] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    // Email states
    const [isEmailing, setIsEmailing] = useState(false);
    const [emailStatusMessage, setEmailStatusMessage] = useState('');

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await axios.get('https://pdf-locker-5m9g.onrender.com/api/status');
                setIsExpired(response.data.isExpired);
            } catch (error) {
                console.error(error);
            }
        };
        checkStatus();
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const formattedName = formData.userName.replace(/\s+/g, '');
            const password = `${formattedName}-${formData.dob}`;

            setPasswordMessage(`Success! Use this password to open your PDF: ${password}`);

            const response = await axios.post('https://pdf-locker-5m9g.onrender.com/api/resume/download', formData, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${formattedName}_Resume.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            if (error.response?.status === 403) setIsExpired(true);
            else alert("Error generating PDF.");
        }
        setIsDownloading(false);
    };

    const handleEmail = async () => {
        setIsEmailing(true);
        setEmailStatusMessage('Sending email...');
        try {
            await axios.post('https://pdf-locker-5m9g.onrender.com/api/resume/email', formData);
            setEmailStatusMessage('Resume successfully sent to your email!');
        } catch (error) {
            if (error.response?.status === 403) setIsExpired(true);
            else setEmailStatusMessage("Error sending email. Please check the address.");
        }
        setIsEmailing(false);
    };

    if (isExpired) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-100 p-4">
                <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl text-center border-t-4 border-red-500 w-full max-w-md">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Session Expired</h1>
                    <p className="text-slate-600">Resume submission time has ended.</p>
                </div>
            </div>
        );
    }

    const inputClass = "w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50";
    const labelClass = "block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 mt-4";

    return (
        // RESPONSIVE: Stack in column on mobile, row on large screens (lg)
        <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-slate-100 font-sans lg:overflow-hidden">

            {/* Left Panel: Form Workspace */}
            {/* RESPONSIVE: Full width on mobile, half width on desktop */}
            <div className="w-full lg:w-1/2 lg:h-full lg:overflow-y-auto bg-white shadow-2xl z-10 p-5 md:p-8 custom-scrollbar">
                <div className="max-w-xl mx-auto">

                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b pb-4">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Resume Builder</h1>
                        <Link
                            to="/admin"
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold py-2 px-4 rounded-md shadow-sm transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            Admin Panel <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>

                    {/* Personal Details */}
                    <h2 className="text-lg font-bold text-slate-700 mt-6 mb-3">Personal Details</h2>
                    {/* RESPONSIVE GRID: 1 column mobile, 2 columns tablet+ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
                        <div>
                            <label className={labelClass}>Full Name</label>
                            <input type="text" name="userName" placeholder="John Doe" className={inputClass} onChange={handleChange} />
                        </div>
                        <div>
                            <label className={labelClass}>Date of Birth (Password)</label>
                            <input type="date" name="dob" className={inputClass} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
                        <div>
                            <label className={labelClass}>Email</label>
                            <input type="email" name="email" placeholder="john@example.com" className={inputClass} onChange={handleChange} />
                        </div>
                        <div>
                            <label className={labelClass}>Phone</label>
                            <input type="text" name="phone" placeholder="+1 234 567 890" className={inputClass} onChange={handleChange} />
                        </div>
                    </div>

                    <label className={labelClass}>Location</label>
                    <input type="text" name="address" placeholder="City, Country" className={inputClass} onChange={handleChange} />

                    {/* Professional Details */}
                    <h2 className="text-lg font-bold text-slate-700 mt-8 mb-3 border-t pt-6">Professional Details</h2>

                    <label className={labelClass}>Professional Summary</label>
                    <textarea name="summary" rows="3" placeholder="A brief summary of your career and goals..." className={inputClass} onChange={handleChange} />

                    <label className={labelClass}>Experience</label>
                    <textarea name="experience" rows="4" placeholder="Company Name | Role | Dates&#10;- Key achievement 1&#10;- Key achievement 2" className={inputClass} onChange={handleChange} />

                    <label className={labelClass}>Education</label>
                    <textarea name="education" rows="3" placeholder="Degree | University | Year" className={inputClass} onChange={handleChange} />

                    <label className={labelClass}>Projects</label>
                    <textarea name="projects" rows="3" placeholder="Project Name | Technologies Used&#10;Brief description of the project..." className={inputClass} onChange={handleChange} />

                    <label className={labelClass}>Skills</label>
                    <input type="text" name="skills" placeholder="React, Node.js, Project Management (comma separated)" className={inputClass} onChange={handleChange} />

                    {/* Actions */}
                    <div className="mt-10 mb-8 lg:mb-4 lg:sticky bottom-0 bg-white py-4 border-t z-20">
                        {/* RESPONSIVE BUTTON GRID: Stack on tiny screens, side-by-side on larger screens */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading || !formData.userName || !formData.dob}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-lg font-bold shadow-sm transition-all disabled:opacity-50"
                            >
                                {isDownloading ? 'Generating...' : 'Download Protected PDF'}
                            </button>

                            <button
                                onClick={handleEmail}
                                disabled={isEmailing || !formData.email || !formData.userName || !formData.dob}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-lg font-bold shadow-sm transition-all disabled:opacity-50"
                            >
                                {isEmailing ? 'Sending...' : 'Email Resume'}
                            </button>
                        </div>

                        {/* Status Messages */}
                        <div className="flex flex-col gap-2 mt-4">
                            {passwordMessage && (
                                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-sm text-center font-medium">
                                    {passwordMessage}
                                </div>
                            )}

                            {emailStatusMessage && (
                                <div className={`p-3 border rounded-lg text-sm text-center font-medium ${emailStatusMessage.includes('Error') ? 'bg-red-50 text-red-800 border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
                                    {emailStatusMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Live Preview */}
            {/* RESPONSIVE: Adapts to remaining space */}
            <div className="w-full lg:w-1/2 lg:h-full lg:overflow-y-auto bg-slate-200 p-4 md:p-8 flex justify-center py-10">
                {/* RESPONSIVE A4 CONTAINER: Full width on mobile, strict A4 dimensions on desktop */}
                <div className="bg-white w-full max-w-3xl lg:w-[210mm] min-h-[50vh] lg:min-h-[297mm] shadow-xl p-6 md:p-10 text-slate-800 rounded-sm">

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-2 break-words">{formData.userName || 'YOUR NAME'}</h1>
                        <p className="text-xs md:text-sm text-slate-600">
                            {formData.email && <span>{formData.email} • </span>}
                            {formData.phone && <span>{formData.phone} • </span>}
                            {formData.address && <span>{formData.address}</span>}
                        </p>
                    </div>

                    {/* Summary */}
                    {formData.summary && (
                        <div className="mb-5">
                            <p className="text-xs md:text-sm leading-relaxed">{formData.summary}</p>
                        </div>
                    )}

                    {/* Dynamic Sections */}
                    <PreviewSection title="Experience" content={formData.experience} />
                    <PreviewSection title="Education" content={formData.education} />
                    <PreviewSection title="Projects" content={formData.projects} />
                    <PreviewSection title="Skills" content={formData.skills} />

                </div>
            </div>
        </div>
    );
}

// Helper component 
const PreviewSection = ({ title, content }) => {
    if (!content) return null;
    return (
        <div className="mb-5">
            <h3 className="text-base md:text-lg font-bold border-b-2 border-slate-800 uppercase tracking-wide mb-3">{title}</h3>
            <p className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
    );
};
