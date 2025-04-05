import React, { useState } from "react";
import "./Workplace.css";

const team = {
  manager: "John Doe",
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

const Workplace = () => {
  const [showMembers, setShowMembers] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleToggleMembers = () => {
    setShowMembers(!showMembers);
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setSelectedOptions([]); // Reset options when selecting a new member
  };

  const handleOptionClick = (index) => {
    if (!selectedMember) return; // Prevent selection if no member is selected

    setSelectedOptions((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSubmit = () => {
    alert(`Submitted for ${selectedMember}: ${selectedOptions.map(index => reasons[index]).join(", ")}`);
    setSelectedOptions([]);
    setSelectedMember(null);
  };

  return (
    <div className="workplace-container">
      {/* Left Side: Team Members */}
      <div className="team-section">
        <h2 className="manager-name">Team Manager: {team.manager}</h2>
        <h3 className="team-title" onClick={handleToggleMembers} style={{ cursor: "pointer" }}>
          Team Members
        </h3>
        {showMembers && (
          <ul className="team-list">
            {team.members.map((member) => (
              <li
                key={member}
                className={`team-member ${selectedMember === member ? "selected" : ""}`}
                onClick={() => handleMemberClick(member)}
              >
                {member}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Side: Questions */}
      <div className="question-section">
        <h2 className="question-title">Choose Reason</h2>
        <ul className="reason-list">
          {reasons.map((reason, index) => (
            <li
              key={index}
              className={`reason-item ${selectedOptions.includes(index) ? "selected" : ""}`}
              onClick={() => handleOptionClick(index)}
              style={{ cursor: selectedMember ? "pointer" : "not-allowed" }}
            >
              {reason}
            </li>
          ))}
        </ul>
        <button
          onClick={handleSubmit}
          disabled={!selectedMember}
          className="submit-button"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Workplace;