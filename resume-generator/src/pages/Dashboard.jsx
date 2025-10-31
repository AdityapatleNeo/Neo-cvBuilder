

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import { dummyData } from '../assets/dummyResume.js';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/resume');
        if (!response.ok) throw new Error('Failed to fetch resumes');
        const data = await response.json();
        setCvList(data);
      } catch (error) {
        console.error(error);
        setCvList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCVs();
  }, []);

  const handleCreate = () => {
    navigate('/resumebuilder');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this CV?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/resume/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete CV');
      setCvList((prev) => prev.filter((cv) => cv._id !== id));
      alert('CV deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to delete CV. Please try again.');
    }
  };

  // open only razorpay window 
 const handlePayment = async () => {
    try {
     
      const options = {
        key: "rzp_test_RM8kd9Lzbkj1hG", 
        amount: 199, 
        currency: "INR",
        name: "Neo CVs",
        description: "Payment for Resume Download",
        image: "https://razorpay.com/favicon.png",

        handler: function (response) {
          alert(
            ` Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`
          );

        },

        theme: { color: "#3399cc" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      alert("Payment initialization failed.");
    }
  };

  return (
    <div className="dashboard-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Build Your Professional Resume in Minutes With Neo CVs</h1>
          <p className="hero-subtitle">
            Neo CVs helps you create beautiful, job-winning resumes effortlessly. 
            Choose from modern templates and start editing instantly.
          </p>
          <button className="primary-btn" onClick={handleCreate}>
            + Create New Resume
          </button>
        </div>
      </section>

      <section className="resume-section">
        <div className="dashboard-header">
          <h2 className="dashboard-headerTitle">Neo CVs Templates</h2>
          <button className="dashboard-buttonCreate" onClick={handleCreate}>
            + New CV
          </button>
        </div>
        <div className="dashboard-cardsGrid">
          {dummyData.map((cv) => (
            <div key={cv.title} className="dashboard-cardItem">
              <h3 className="dashboard-cardTitle">{cv.title}</h3>
              <p className="dashboard-cardDate">Click “Edit” to start this template</p>
              <div className="dashboard-cardActions">
                <button
                  className="dashboard-buttonCreate"
                  onClick={() => navigate('/resumebuilder', { state: { cvData: cv } })}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="resume-section">
        <div className="dashboard-header">
          <h2 className="dashboard-headerTitle">Your Saved CVs</h2>
        </div>
        {loading ? (
          <p>Loading saved resumes...</p>
        ) : cvList.length === 0 ? (
          <div className="dashboard-emptyState">
            <p className="dashboard-emptyText">You haven’t created any CVs yet.</p>
            <p className="dashboard-emptyText">Click “+ New CV” to get started.</p>
          </div>
        ) : (
          <div className="dashboard-cardsGrid">
            {cvList.map((cv, indx) => (
              <div key={indx} className="dashboard-cardItem">
                <h3 className="dashboard-cardTitle">{cv.personal.name || "Untitled CV"}</h3>
                <p className="dashboard-cardDate">
                  {cv.personal?.email} · {cv.personal?.phone}
                </p>

                <div className="dashboard-cardActions">
                  <button
                    className="dashboard-buttonCreate"
                    onClick={() => navigate('/resumebuilder', { state: { cvData: cv } })}
                  >
                    Update
                  </button>

                  <button
                    className="dashboard-buttonAction secondary"
                    onClick={() => handlePayment(cv)}
                  >
                    Download
                  </button>

                  <button
                    className="dashboard-buttonAction secondary"
                     onClick={() => handlePayment(cv)}
                  >
                    Share
                  </button>

                  <button
                    className="dashboard-buttonAction secondary"
                    onClick={() => handleDelete(cv._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="footer">
        <p>© 2025 Neo CVs. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
