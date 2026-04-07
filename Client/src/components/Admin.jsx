import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
    const [resumes, setResumes] = useState([]);
    
    // States for Modal editing
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        const res = await axios.get('http://localhost:5000/api/admin/resumes');
        setResumes(res.data);
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this entry?")) {
            await axios.delete(`http://localhost:5000/api/admin/resumes/${id}`);
            fetchResumes(); 
        }
    };

    // 1. Open Modal & load ALL resume details into state
    const handleEditClick = (resume) => {
        setEditingId(resume._id);
        setEditFormData({ ...resume }); // Copies all fields (email, skills, etc.)
    };

    // 2. Handle input changes in the Modal
    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    // 3. Save changes to backend and close Modal
    const handleSave = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/resumes/${id}`, editFormData);
            setEditingId(null); 
            fetchResumes();     
        } catch (error) {
            console.error("Failed to update resume", error);
            alert("Error updating resume");
        }
    };

    const inputClass = "w-full border border-gray-300 rounded p-2 text-sm mb-3";

    return (
        <div className="p-8 max-w-6xl mx-auto relative">
            <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
            
            {/* --- MAIN DATA TABLE --- */}
            <div className="overflow-x-auto bg-white shadow-md rounded">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="p-3 border">Name</th>
                            <th className="p-3 border">Email</th>
                            <th className="p-3 border">DOB</th>
                            <th className="p-3 border text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resumes.map(resume => (
                            <tr key={resume._id} className="border-b hover:bg-gray-50">
                                <td className="p-3 border font-semibold">{resume.userName}</td>
                                <td className="p-3 border">{resume.email || 'N/A'}</td>
                                <td className="p-3 border">{resume.dob}</td>
                                <td className="p-3 border flex justify-center gap-2">
                                    <button 
                                        onClick={() => handleEditClick(resume)} 
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded transition"
                                    >
                                        Edit Details
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(resume._id)} 
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- EDIT MODAL OVERLAY --- */}
            {editingId && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
                        
                        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Edit Resume Details</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase">Full Name</label>
                                <input type="text" name="userName" value={editFormData.userName || ''} onChange={handleEditChange} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase">DOB</label>
                                <input type="date" name="dob" value={editFormData.dob || ''} onChange={handleEditChange} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase">Email</label>
                                <input type="email" name="email" value={editFormData.email || ''} onChange={handleEditChange} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase">Phone</label>
                                <input type="text" name="phone" value={editFormData.phone || ''} onChange={handleEditChange} className={inputClass} />
                            </div>
                        </div>

                        <label className="block text-xs font-bold text-gray-600 uppercase mt-2">Address</label>
                        <input type="text" name="address" value={editFormData.address || ''} onChange={handleEditChange} className={inputClass} />

                        <label className="block text-xs font-bold text-gray-600 uppercase mt-2">Professional Summary</label>
                        <textarea name="summary" rows="2" value={editFormData.summary || ''} onChange={handleEditChange} className={inputClass} />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mt-2">Experience</label>
                                <textarea name="experience" rows="4" value={editFormData.experience || ''} onChange={handleEditChange} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mt-2">Education</label>
                                <textarea name="education" rows="4" value={editFormData.education || ''} onChange={handleEditChange} className={inputClass} />
                            </div>
                        </div>

                        <label className="block text-xs font-bold text-gray-600 uppercase mt-2">Projects</label>
                        <textarea name="projects" rows="2" value={editFormData.projects || ''} onChange={handleEditChange} className={inputClass} />

                        <label className="block text-xs font-bold text-gray-600 uppercase mt-2">Skills</label>
                        <input type="text" name="skills" value={editFormData.skills || ''} onChange={handleEditChange} className={inputClass} />

                        {/* Modal Action Buttons */}
                        <div className="flex justify-end gap-4 mt-6 border-t pt-4">
                            <button 
                                onClick={() => setEditingId(null)} 
                                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded font-bold transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleSave(editingId)} 
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold transition"
                            >
                                Save Changes
                            </button>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    );
}