import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const team = {
    members: ["Alice", "Bob", "Charlie", "David"]
  };

  const reasons = [
    "Family Problems",
    "Salary Issues",
    "Low Performance",
    "Disciplinary Issues",
    "Frequent Absence",
    "Lack of Skills",
    "Violation of Policies", 
    "Team Conflicts",
    "Poor Time Management",
    "Customer Complaints"
  ];

  const performanceOptions = [
    "Bad Performance",
    "Not Bad", 
    "Okay",
    "Good",
    "Excellent"
  ];

  const [showMembers, setShowMembers] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [reasonCounts, setReasonCounts] = useState({});
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const storedUsername = localStorage.getItem('currentUser');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleToggleMembers = () => {
    setShowMembers(!showMembers);
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setReasonCounts({});
  };

  const handleOptionClick = (index) => {
    if (!selectedMember) return;

    setReasonCounts((prev) => {
      const newCount = (prev[index] || 0) + 1;
      return { ...prev, [index]: newCount };
    });
  };

  const handleSubmit = () => {
    const selectedReasons = Object.entries(reasonCounts)
      .filter(([_, count]) => count > 0)
      .map(([index, count]) => `${reasons[index]} (x${count})`)
      .join(", ");
    
    alert(`Submitted for ${selectedMember}: ${selectedReasons}`);
    setSelectedMember(null);
    setReasonCounts({});
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <header className="dashboard-header">
          <h1>Team Management Dashboard</h1>
        </header>

        <div className="team-section">
          <div className="manager-info">
            <i className="manager-icon"></i>
            <h2 className="manager-name">Team Manager: {username.charAt(0).toUpperCase() + username.slice(1)}</h2>
          </div>

          <div className="divider"></div>

          <div className="team-members-container">
            <h3 
              className={`team-title ${showMembers ? 'active' : ''}`} 
              onClick={handleToggleMembers}
            >
              <span>Team Members</span>
              <i className={`arrow-icon ${showMembers ? 'up' : 'down'}`}></i>
            </h3>
            
            {showMembers && (
              <ul className="team-list">
                {team.members.map((member) => (
                  <li
                    key={member}
                    className={`team-member ${selectedMember === member ? "selected" : ""}`}
                    onClick={() => handleMemberClick(member)}
                  >
                    <div className="member-avatar">{member.charAt(0)}</div>
                    <span className="member-name">{member}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {showMembers && selectedMember && (
            <>
              <div className="divider"></div>
              <div className="reason-section">
                <h4 className="reason-title">Select Reason for {selectedMember}</h4>
                <ul className="reason-list">
                  {reasons.map((reason, index) => (
                    <li key={index} className="reason-item">
                      <div 
                        className={`reason-label ${reasonCounts[index] > 0 ? 'selected' : ''}`}
                        onClick={() => handleOptionClick(index)}
                      >
                        {reason}
                      </div>
                      {reasonCounts[index] > 0 && (
                        <select
                          value={reasonCounts[index] || 0}
                          onChange={(e) => setReasonCounts({ 
                            ...reasonCounts, 
                            [index]: parseInt(e.target.value) 
                          })}
                          className="performance-select"
                        >
                          <option value="0">Select Performance</option>
                          {performanceOptions.map((option, idx) => (
                            <option key={idx} value={idx + 1}>{option}</option>
                          ))}
                        </select>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={!selectedMember}
            className={`submit-button ${!selectedMember ? 'disabled' : ''}`}
          >
            Submit Evaluation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

