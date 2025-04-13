import React, { useState, useEffect } from "react";
import "./Workplace.css";

const Workplace = () => {
  const team = {
    members: ["Alice", "Bob", "Charlie", "David"]
  };

  const factors = [
    "Redeployment",
    "Marriage in offing",
    "Night shift",
    "Family problem",
    "Salary",
    "Higher education",
    "Performance",
    "VIC",
    "Skill set",
    "Attendance",
    "External Interviews",
    "Behavior/Motivation",
    "Rewards",
    "Duration in current role",
    "Training performance",
    "DIP payment",
    "Growth",
    "Personal problems",
    "Discipline / CAP / PCRB",
    "Bench without work?",
    "Onsite job/Travel"
  ];

  const factorOptions = {
    "Redeployment": [
      "Actively seeking redeployment / difficulty in redeploying",
      "Has talked about redeployment though not pursuing actively",
      "No issues"
    ],
    "Marriage in offing": [
      "Definite that would leave",
      "Might leave...",
      "No issues"
    ],
    "Night shift": [
      "Has health problems due to night shifts...asked persistently for a day shift",
      "Has mentioned about moving to day shift...not persistent",
      "No issues"
    ],
    "Family problem": [
      "We know these are causing problems at job...performance, late, etc",
      "Seems to be able to cope",
      "No issues"
    ],
    "Salary": [
      "Extremely dissatisfied",
      "Dissatisfied",
      "No issues"
    ],
    "Higher education": [
      "Studying for entrance, not wanting to pursue through edu@University",
      "Mentioned interest in higher education...might be applying for the same",
      "No issues"
    ],
    "Performance": [
      "NI for more than 3 months",
      "Inconsistent",
      "No issues"
    ],
    "VIC": [
      "Not received VIC in the last 3 months",
      "Inconsistent",
      "No issues"
    ],
    "Skill set": [
      "Completely out of sync with current job profile",
      "Somewhat out of sync",
      "Right fit"
    ],
    "Attendance": [
      "Frequently on leave, unscheduled",
      "Frequent leave due to known reasons",
      "No issues"
    ],
    "External Interviews": [
      "Has been sighted, confirmed to be taking interviews",
      "Word of mouth...may be taking interviews",
      "No issues"
    ],
    "Behavior/Motivation": [
      "Low on motivation, indiscipline...disinterested with the job",
      "Low motivation...but trying to cope",
      "No issues"
    ],
    "Rewards": [
      "Not rewarded / appreciated for the last 1 year",
      "Not rewarded / appreciated for the last 6 months",
      "No issues"
    ],
    "Duration in current role": [
      "More than 2 yrs",
      "More than 18 months",
      "No issues"
    ],
    "Training performance": [
      "Not clearing tollgates",
      "Difficulty / barely clearing tollgates",
      "No issues"
    ],
    "DIP payment": [
      "Getting DIP payment next month",
      "Getting DIP next quarter",
      "No issues"
    ],
    "Growth": [
      "Failed to clear growth opportunity more than once",
      "Failed to clear growth opportunity once",
      "No issues"
    ],
    "Personal problems": [
      "Severe problems interfering with work",
      "Problems...able to cope with difficulty",
      "No issues"
    ],
    "Discipline / CAP / PCRB": [
      "Pending PCRB, Given more than one CAP",
      "Pending PCRB, Given one CAP",
      "No issues"
    ],
    "Bench without work?": [
      "On bench without work for more than 3 months",
      "On bench without work more than 1 month",
      "No issues"
    ],
    "Onsite job/Travel": [
      "Wants onsite job / challenge with high travel",
      "Mentioned wanting onsite job...challenge with high travel",
      "No issues"
    ]
  };

  const [showMembers, setShowMembers] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [factorRatings, setFactorRatings] = useState({});
  const [username, setUsername] = useState("User");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

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
    setFactorRatings({});
    // Clear any previous submit messages
    setSubmitMessage(null);
  };

  const handleRatingChange = (factorIndex, reason) => {
    if (!selectedMember) return;

    setFactorRatings((prev) => ({
      ...prev,
      [factorIndex]: reason
    }));
  };

  const handleSubmit = async () => {
    if (!selectedMember || Object.keys(factorRatings).length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const evaluationData = {
        managerName: username.charAt(0).toUpperCase() + username.slice(1),
        teamMember: selectedMember,
        factorRatings: {}
      };
      
      // Add all factors with their ratings (or null if not rated)
      factors.forEach((factor, index) => {
        evaluationData.factorRatings[factor] = factorRatings[index] || null;
      });
      
      // Send data to backend
      const response = await fetch('http://localhost:5000/submit-evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluationData),
        credentials: 'include'
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmitMessage({ type: 'success', text: result.message });
        // Reset form after successful submission
        setSelectedMember(null);
        setFactorRatings({});
        setShowMembers(false);
      } else {
        setSubmitMessage({ type: 'error', text: result.error || 'Failed to submit evaluation' });
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      setSubmitMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <header className="dashboard-header">
          <h1>Team Management Workplace</h1>
        </header>

        <div className="team-section">
          <div className="manager-info">
            <i className="manager-icon"></i>
            <h2 className="manager-name">Team Manager: {username.charAt(0).toUpperCase() + username.slice(1)}</h2>
          </div>

          <div className="divider"></div>
          
          {submitMessage && (
            <div className={`message ${submitMessage.type}`}>
              {submitMessage.text}
            </div>
          )}

          <div className="team-members-container">
            <h3 className={`team-title ${showMembers ? 'active' : ''}`} onClick={handleToggleMembers}>
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
              <div className="factor-section">
                <h4 className="factor-title">Select Factors for {selectedMember}</h4>
                <ul className="factor-list">
                  {factors.map((factor, index) => (
                    <li key={index} className="factor-item">
                      <div className="factor-label">{factor}</div>
                      <select
                        value={factorRatings[index] || ""}
                        onChange={(e) => handleRatingChange(index, e.target.value)}
                        className="rating-select"
                      >
                        <option value="">Select Reason</option>
                        {factorOptions[factor].map((reason, i) => (
                          <option key={i} value={reason}>{reason}</option>
                        ))}
                      </select>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={!selectedMember || Object.keys(factorRatings).length === 0 || isSubmitting}
            className={`submit-button ${!selectedMember || Object.keys(factorRatings).length === 0 || isSubmitting ? 'disabled' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Workplace;