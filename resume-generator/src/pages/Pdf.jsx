

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, PDFDownloadLink } from "@react-pdf/renderer";
import "./Pdf.css";
import { FresherLayout } from "./FresherLayout";

export default function ResumeBuilder() {
    const location = useLocation();

    const [data, setData] = useState({
        personal: {
            image: "",
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            introduction: "",
        },
        education: [{ degree: "", institution: "", percentage: "" }],
        experience: [
            {
                organization: "",
                location: "",
                position: "",
                ctc: "",
                joiningDate: "",
                leavingDate: "",
                technologies: "",
            },
        ],
        projects: [
            {
                title: "",
                teamSize: "",
                duration: "",
                technologies: "",
                description: "",
            },
        ],
        skills: [{ name: "", level: "" }],
        socials: [{ platform: "", link: "" }],
    });
    const navigate = useNavigate()
    const [layoutOptions, setLayoutOptions] = useState({
        color: "#e63946",
        font: "Helvetica",
        fontSize: 12,
    });

    const [layoutChoice, setLayoutChoice] = useState("Basic");
    const [newData, setNewData] = useState([])
    useEffect(() => {
        if (location.state && location.state.cvData) {
            const cv = location.state.cvData;
            setNewData(cv)
            setData({
                personal: cv.personal || {
                    image: "",
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    city: "",
                    state: "",
                    pincode: "",
                    introduction: "",
                },
                education: cv.education || [{ degree: "", institution: "", percentage: "" }],
                experience: cv.experience || [
                    {
                        organization: "",
                        location: "",
                        position: "",
                        ctc: "",
                        joiningDate: "",
                        leavingDate: "",
                        technologies: "",
                        description: "",
                    },
                ],
                projects: cv.projects || [
                    {
                        title: "",
                        teamSize: "",
                        duration: "",
                        technologies: "",
                        description: "",
                    },
                ],
                skills: cv.skills || [{ name: "", level: "" }],
                socials: cv.socials || [{ platform: "", link: "" }],
            });
            setLayoutOptions(cv.layoutOptions || { color: "#e63946", font: "Helvetica", fontSize: 12 });
            setLayoutChoice(cv.layoutChoice || "Basic");

            console.log("Prefilled Resume Data:", cv);
        }
    }, [location.state]);

    const handlePersonalChange = (e) =>
        setData({
            ...data,
            personal: { ...data.personal, [e.target.name]: e.target.value },
        });

    const handleArrayChange = (section, index, field, value) => {
        const updated = [...data[section]];
        updated[index][field] = value;
        setData({ ...data, [section]: updated });
    };

    const addArrayItem = (section, emptyItem) => {
        setData({ ...data, [section]: [...data[section], emptyItem] });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () =>
                setData({
                    ...data,
                    personal: { ...data.personal, image: reader.result },
                });
            reader.readAsDataURL(file);
        }
    };


    const handleLayoutChange = (e) => {
        setLayoutOptions({ ...layoutOptions, [e.target.name]: e.target.value });
    };

    const getDocumentComponent = () => (
        <FresherLayout data={data} layoutOptions={layoutOptions} selectedLayout={layoutChoice} />
    );

    const handleSaveResume = async () => {
        try {
            if (
                !data ||
                Object.values(data).every((value) => !value || value === "" || (Array.isArray(value) && value.length === 0))
            ) {
                alert("Please fill in the resume details before saving.");
                return;
            }


            // if (!data.name || !data.email) {
            //     alert("please fill are the fields");
            //     return;
            // }

            const response = await fetch("http://localhost:5000/api/resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    layoutOptions,
                    layoutChoice,
                }),
            });

            if (response.ok) {
                console.log("Save Successfully");
                alert("Resume saved successfully!");
                navigate("/");
            } else {
                console.log("Failed to save resume.");
                alert("Failed to save resume.");
            }
        } catch (error) {
            console.error("Error saving resume:", error);
            alert("Error saving resume.");
        }
    };


    const handleUpdate = async (id, updatedData) => {
        if (!window.confirm("Are you sure you want to update this CV?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/resume/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to update CV');

            alert('CV updated successfully!');
            navigate('/')
        } catch (error) {
            console.error(error);
            alert('Failed to update CV. Please try again.');
        }
    };

    console.log(newData)
    return (
        <div className="builder-wrapper">
            <div className="form-section">
                <h1 className="title">Resume Builder</h1>

                <h2>Layout Customization</h2>
                <div className="layout-customization">
                    <div>
                        <label>Color:</label>
                        <input
                            type="color"
                            name="color"
                            value={layoutOptions.color}
                            onChange={handleLayoutChange}
                        />
                    </div>
                    <div>
                        <label>Font:</label>
                        <select
                            name="font"
                            value={layoutOptions.font}
                            onChange={handleLayoutChange}
                        >
                            <option>Helvetica</option>
                            <option>Times-Roman</option>
                            <option>Courier</option>
                            <option>Arial</option>
                        </select>
                    </div>
                    <div>
                        <label>Font Size:</label>
                        <input
                            type="number"
                            name="fontSize"
                            min="8"
                            max="24"
                            value={layoutOptions.fontSize}
                            onChange={handleLayoutChange}
                        />
                    </div>
                </div>

                <h2>Select Layout</h2>
                <select
                    className="layout-options"
                    name="layoutChoice"
                    value={layoutChoice}
                    onChange={(e) => setLayoutChoice(e.target.value)}
                >
                    <option value={"Basic"}>ATS Friendly CV</option>
                    <option value={"Formal"}>Freshers</option>
                    <option value={"Experience"}>Graphic Designer CV</option>
                </select>

                <h2>Basic Details</h2>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {data.personal.image && (
                    <img
                        src={data.personal.image}
                        alt="Profile"
                        width="100"
                        className="profile-preview"
                    />
                )}
                <input name="name" placeholder="Full Name" value={data.personal.name} onChange={handlePersonalChange} required />
                <input name="email" placeholder="Email" value={data.personal.email} onChange={handlePersonalChange} required />
                <input name="phone" placeholder="Phone" value={data.personal.phone} onChange={handlePersonalChange} required />
                <input name="address" placeholder="Address" value={data.personal.address} onChange={handlePersonalChange} required />
                <div className="multi-input">
                    <input name="city" placeholder="City" value={data.personal.city} onChange={handlePersonalChange} required />
                    <input name="state" placeholder="State" value={data.personal.state} onChange={handlePersonalChange} required />
                    <input name="pincode" placeholder="Pincode" value={data.personal.pincode} onChange={handlePersonalChange} required />
                </div>
                <textarea
                    name="introduction"
                    placeholder="Introductory Paragraph"
                    value={data.personal.introduction}
                    onChange={handlePersonalChange}
                    required
                />

                <h2>Education</h2>
                {data.education.map((ed, i) => (
                    <div key={i} className="section-block">
                        <input
                            placeholder="Degree"
                            value={ed.degree}
                            onChange={(e) => handleArrayChange("education", i, "degree", e.target.value)}
                            required
                        />
                        <input
                            placeholder="Institution"
                            value={ed.institution}
                            onChange={(e) => handleArrayChange("education", i, "institution", e.target.value)}
                            required
                        />
                        <input
                            placeholder="Percentage / CGPA"
                            value={ed.percentage}
                            onChange={(e) => handleArrayChange("education", i, "percentage", e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button
                    className="add-btn"
                    onClick={() => addArrayItem("education", { degree: "", institution: "", percentage: "" })}
                >
                    + Add Education
                </button>

                <h2>Experience</h2>
                {data.experience.map((ex, i) => (
                    <div key={i} className="section-block">
                        <input
                            placeholder="Organization"
                            value={ex.organization}
                            onChange={(e) => handleArrayChange("experience", i, "organization", e.target.value)}
                            required
                        />
                        <input
                            placeholder="Location"
                            value={ex.location}
                            onChange={(e) => handleArrayChange("experience", i, "location", e.target.value)}
                            required
                        />
                        <input
                            placeholder="Position"
                            value={ex.position}
                            onChange={(e) => handleArrayChange("experience", i, "position", e.target.value)}
                            required
                        />
                        <input
                            placeholder="CTC"
                            value={ex.ctc}
                            onChange={(e) => handleArrayChange("experience", i, "ctc", e.target.value)}
                            required
                        />
                        <div className="multi-input">
                            <input
                                type="date"
                                value={ex.joiningDate}
                                onChange={(e) => handleArrayChange("experience", i, "joiningDate", e.target.value)}
                                required
                            />
                            <input
                                type="date"
                                value={ex.leavingDate}
                                onChange={(e) => handleArrayChange("experience", i, "leavingDate", e.target.value)}
                                required
                            />
                        </div>
                        <input
                            placeholder="Technologies Worked On"
                            value={ex.technologies}
                            onChange={(e) => handleArrayChange("experience", i, "technologies", e.target.value)}
                            required
                        />
                         <input
                            placeholder="Description"
                            value={ex.description}
                            onChange={(e) => handleArrayChange("experience", i, "description", e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button
                    className="add-btn"
                    onClick={() =>
                        addArrayItem("experience", {
                            organization: "",
                            position: "",
                            joiningDate: "",
                            leavingDate: "",
                            technologies: "",
                            description: "",
                        })
                    }
                >
                    + Add Experience
                </button>

                <h2>Projects</h2>
                {data.projects.map((p, i) => (
                    <div key={i} className="section-block">
                        <input
                            placeholder="Project Title"
                            value={p.title}
                            onChange={(e) => handleArrayChange("projects", i, "title", e.target.value)}
                            required
                        />
                        <div className="multi-input">
                            <input
                                placeholder="TeamSize"
                                value={p.teamSize}
                                onChange={(e) => handleArrayChange("projects", i, "teamSize", e.target.value)}
                                required
                            />
                            <input
                                placeholder="Duration"
                                value={p.duration}
                                onChange={(e) => handleArrayChange("projects", i, "duration", e.target.value)}
                                required
                            />
                        </div>
                        <input
                            placeholder="Technologies"
                            value={p.technologies}
                            onChange={(e) => handleArrayChange("projects", i, "technologies", e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={p.description}
                            onChange={(e) => handleArrayChange("projects", i, "description", e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button
                    className="add-btn"
                    onClick={() => addArrayItem("projects", { title: "", description: "" })}
                >
                    + Add Project
                </button>

                <h2>Skills</h2>
                {data.skills.map((s, i) => (
                    <div key={i} className="multi-input">
                        <input
                            placeholder="Skill Name"
                            value={s.name}
                            onChange={(e) => handleArrayChange("skills", i, "name", e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Proficiency (%)"
                            value={s.level}
                            onChange={(e) => handleArrayChange("skills", i, "level", e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button
                    className="add-btn"
                    onClick={() => addArrayItem("skills", { name: "", level: "" })}
                >
                    + Add Skill
                </button>

                <h2>Social Profiles</h2>
                {data.socials.map((so, i) => (
                    <div key={i} className="multi-input">
                        <input
                            placeholder="Platform"
                            value={so.platform}
                            onChange={(e) => handleArrayChange("socials", i, "platform", e.target.value)}
                            required
                        />
                        <input
                            placeholder="Profile Link"
                            value={so.link}
                            onChange={(e) => handleArrayChange("socials", i, "link", e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button
                    className="add-btn"
                    onClick={() => addArrayItem("socials", { platform: "", link: "" })}
                >
                    + Add Social
                </button>
                {
                    newData._id ? <button className="save-btn" onClick={() => handleUpdate(newData._id)}>
                        Update Resume
                    </button> : <button className="save-btn" onClick={handleSaveResume}>
                        💾 Save Resume
                    </button>
                }


            </div>

            <div className="preview-section">
                <h2 className="preview-heading">Live Resume Preview</h2>
                <div
                    className="html-preview"
                    style={{
                        fontFamily: layoutOptions.font,
                        fontSize: `${layoutOptions.fontSize}px`,
                        color: "#333",
                    }}
                >
                    {data.personal.image && (
                        <img src={data.personal.image} alt="Profile" width={'150px'}  style={{marginLeft:'600px'}} className="profile-preview" />
                    )}
                    <h1 style={{ color: layoutOptions.color }}>{data.personal.name}</h1>
                    <p>
                        
                       <span>{data.personal.email}</span> | <span>{data.personal.phone}</span>
                        
                        
                    </p>
                    <p>
                        <span>{data.personal.address}</span> | <span>{data.personal.city}</span> |{" "}
                        <span>
                            {data.personal.state} | {data.personal.pincode}
                        </span>
                    </p>
                    <strong>Summary</strong>
                    <pre>{data.personal.introduction}</pre>

                    <h3 style={{ color: layoutOptions.color }}>Education</h3>
                    {data.education.map((ed, i) => (
                        <p key={i}>
                            {ed.degree} - {ed.institution} ({ed.percentage})
                        </p>
                    ))}

                    <h3 style={{ color: layoutOptions.color }}>Experience</h3>
                    {data.experience.map((ex, i) => (
                        <>
                            <p key={i}>
                                {ex.position} at {ex.organization} ({ex.joiningDate} - {ex.leavingDate}) -{" "}
                                {ex.location}
                            </p>
                            <p>CTC - {ex.ctc}</p>
                            <p>TechStack - {ex.technologies}</p>
                        </>
                    ))}

                    <h3 style={{ color: layoutOptions.color }}>Projects</h3>
                    {data.projects.map((ex, i) => (
                        <>
                            <strong key={i}>{ex.title}</strong>
                            <br />
                            <em>
                                TeamSize {ex.teamSize} - Duration {ex.duration}
                            </em>
                            <p>
                                <strong>Technologies - </strong> {ex.technologies}
                            </p>
                            <p>- {ex.description}</p>
                        </>
                    ))}

                    <h3 style={{ color: layoutOptions.color }}>Skills</h3>
                    {data.skills.map((s, i) => (
                        <p key={i}>
                            {s.name} - {s.level}%
                        </p>
                    ))}

                    <h3 style={{ color: layoutOptions.color }}>Social Media</h3>
                    {data.socials.map((s, i) => (
                        <p key={i}>
                            {s.platform} - {s.link}
                        </p>
                    ))}
                </div>

                <div className="download-container">
                    <PDFDownloadLink
                        document={<Document>{getDocumentComponent()}</Document>}
                        fileName={`${data.personal.name || "resume"}.pdf`}
                    >
                        {({ loading }) =>
                            loading ? "Preparing…" : (
                                <button className="download-btn"> Download PDF</button>
                            )
                        }
                    </PDFDownloadLink>
                     {/* <PDFDownloadLink
                        document={<Document>{getDocumentComponent()}</Document>}
                        fileName={`${data.personal.name || "resume"}.pdf`}
                    >
                        {({ loading }) =>
                            loading ? "Preparing…" : (
                                <button className="download-btn"> Share PDF</button>
                            )
                        }
                    </PDFDownloadLink> */}
                </div>
                 
            </div>
        </div>
    );
}
