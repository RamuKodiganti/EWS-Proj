import React, { useState, useEffect } from "react";
import "./Workplace.css";

const Workplace = () => {
  const team = {
    members: ["Alice", "Bob", "Charlie", "David"],
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
    "Onsite job/Travel",
  ];

  const factorOptions = {
    Redeployment: [
      "Actively seeking redeployment / difficulty in redeploying",
      "Has talked about redeployment though not pursuing actively",
      "No issues",
    ],
    "Marriage in offing": [
      "Definite that would leave",
      "Might leave...",
      "No issues",
    ],
    "Night shift": [
      "Has health problems due to night shifts...asked persistently for a day shift",
      "Has mentioned about moving to day shift...not persistent",
      "No issues",
    ],
    "Family problem": [
      "We know these are causing problems at job...performance, late, etc",
      "Seems to be able to cope",
      "No issues",
    ],
    Salary: ["Extremely dissatisfied", "Dissatisfied", "No issues"],
    "Higher education": [
      "Studying for entrance, not wanting to pursue through edu@University",
      "Mentioned interest in higher education...might be applying for the same",
      "No issues",
    ],
    Performance: ["NI for more than 3 months", "Inconsistent", "No issues"],
    VIC: ["Not received VIC in the last 3 months", "Inconsistent", "No issues"],
    "Skill set": [
      "Completely out of sync with current job profile",
      "Somewhat out of sync",
      "Right fit",
    ],
    Attendance: [
      "Frequently on leave, unscheduled",
      "Frequent leave due to known reasons",
      "No issues",
    ],
    "External Interviews": [
      "Has been sighted, confirmed to be taking interviews",
      "Word of mouth...may be taking interviews",
      "No issues",
    ],
    "Behavior/Motivation": [
      "Low on motivation, indiscipline...disinterested with the job",
      "Low motivation...but trying to cope",
      "No issues",
    ],
    Rewards: [
      "Not rewarded / appreciated for the last 1 year",
      "Not rewarded / appreciated for the last 6 months",
      "No issues",
    ],
    "Duration in current role": [
      "More than 2 yrs",
      "More than 18 months",
      "No issues",
    ],
    "Training performance": [
      "Not clearing tollgates",
      "Difficulty / barely clearing tollgates",
      "No issues",
    ],
    "DIP payment": [
      "Getting DIP payment next month",
      "Getting DIP next quarter",
      "No issues",
    ],
    Growth: [
      "Failed to clear growth opportunity more than once",
      "Failed to clear growth opportunity once",
      "No issues",
    ],
    "Personal problems": [
      "Severe problems interfering with work",
      "Problems...able to cope with difficulty",
      "No issues",
    ],
    "Discipline / CAP / PCRB": [
      "Pending PCRB, Given more than one CAP",
      "Pending PCRB, Given one CAP",
      "No issues",
    ],
    "Bench without work?": [
      "On bench without work for more than 3 months",
      "On bench without work more than 1 month",
      "No issues",
    ],
    "Onsite job/Travel": [
      "Wants onsite job / challenge with high travel",
      "Mentioned wanting onsite job...challenge with high travel",
      "No issues",
    ],
  };

  const [showMembers, setShowMembers] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [factorRatings, setFactorRatings] = useState({});
  const [username, setUsername] = useState("User");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [selectedFactor, setSelectedFactor] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("currentUser");
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
    setSelectedFactor(null);
    // Clear any previous submit messages
    setSubmitMessage(null);
  };

  const handleFactorClick = (factorIndex) => {
    setSelectedFactor(selectedFactor === factorIndex ? null : factorIndex);
  };

  const handleRatingChange = (factorIndex, reason) => {
    if (!selectedMember) return;

    setFactorRatings((prev) => ({
      ...prev,
      [factorIndex]: reason,
    }));

    // Optionally close the dropdown after selection
    setSelectedFactor(null);
  };

  const handleSubmit = async () => {
    if (!selectedMember || Object.keys(factorRatings).length === 0) return;

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const evaluationData = {
        managerName: username.charAt(0).toUpperCase() + username.slice(1),
        teamMember: selectedMember,
        factorRatings: {},
      };

      // Add all factors with their ratings (or null if not rated)
      factors.forEach((factor, index) => {
        evaluationData.factorRatings[factor] = factorRatings[index] || null;
      });

      // Send data to backend
      const response = await fetch("http://localhost:5000/submit-evaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(evaluationData),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage({ type: "success", text: result.message });
        // Reset form after successful submission
        setSelectedMember(null);
        setFactorRatings({});
        setShowMembers(false);
      } else {
        setSubmitMessage({
          type: "error",
          text: result.error || "Failed to submit evaluation",
        });
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      setSubmitMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
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
            <h2 className="manager-name">
              Team Manager:{" "}
              {username.charAt(0).toUpperCase() + username.slice(1)}
            </h2>
          </div>

          <div className="divider"></div>

          {submitMessage && (
            <div className={`message ${submitMessage.type}`}>
              {submitMessage.text}
            </div>
          )}

          <div className="team-members-container">
            <h3
              className={`team-title ${showMembers ? "active" : ""}`}
              onClick={handleToggleMembers}
            >
              <span>Team Members</span>
              <i className={`arrow-icon ${showMembers ? "up" : "down"}`}></i>
            </h3>

            {showMembers && (
              <ul className="team-list">
                {team.members.map((member) => (
                  <li
                    key={member}
                    className={`team-member ${
                      selectedMember === member ? "selected" : ""
                    }`}
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
                <h4 className="factor-title">
                  Select Factors for {selectedMember}
                </h4>
                <ul className="factor-list">
                  {factors.map((factor, index) => (
                    <li key={index} className="factor-item">
                      <div
                        className={`factor-header ${
                          selectedFactor === index ? "active" : ""
                        } ${factorRatings[index] ? "rated" : ""}`}
                        onClick={() => handleFactorClick(index)}
                      >
                        <div className="factor-label">{factor}</div>
                        {factorRatings[index] && (
                          <div className="selected-reason">
                            {factorRatings[index]}
                          </div>
                        )}
                        <i
                          className={`factor-arrow ${
                            selectedFactor === index ? "up" : "down"
                          }`}
                        ></i>
                      </div>

                      {selectedFactor === index && (
                        <div className="reason-dropdown">
                          {factorOptions[factor].map((reason, i) => (
                            <div
                              key={i}
                              className={`reason-option ${
                                factorRatings[index] === reason
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => handleRatingChange(index, reason)}
                            >
                              {reason}
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={
              !selectedMember ||
              Object.keys(factorRatings).length === 0 ||
              isSubmitting
            }
            className={`submit-button ${
              !selectedMember ||
              Object.keys(factorRatings).length === 0 ||
              isSubmitting
                ? "disabled"
                : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Evaluation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Workplace;

// here we have factors in there we 3 options for every foctor options right
// an there now i want to differentiate the evry factor options is like 1,3,5
// first option of every factor belongs 1 and second options of every factor belongs to  3, and 3 option of every factor belongs 5 okk
// and now i want the code dashboard okk
// in the dashboard i want a table displaying
// first column should be team member name , second colums should 1 and third colums should 3, and forth colums should be 5 and fivth colums result
// in there first colums displayed that team member name and 2,3,4 colums should be displayed what the user selected those are displayed belongs to there options
// like the user selected fisrt options to evry factor then in the column name 1 should be displayed every first reason of factors and in the third colums also (i.e colums name 3) displayed second option of every factor and similarly in the fourth colums(i.e column name 5) there also displayed third options of factor which are selected by team member okkkk
// for last column (i.e which result column )there display green yellow and red this are don by below logic okk
// for that result column
// case-1
// in the column name 1 the options will be only 1 option and in the colums name 3 and 5 is selected any number option then it get yellow
// case-2
// in the column name 1 the option is selected 2 or more and in colums name 3 and 5 selected any then it gets red okkk
// case-3
// colums name 3 selected (i.e second option of evry factor) 3 or more and column 1 will be 0 and in column 5 any then it get yellow
// case-4
// no options is selcted in colums name 1(i.e first option of evry factor) and less than 3 options is selcted in colums name 3(i.e second option of evry factor) and 1 or more options selected in column name 5(i.e third option of evry factor) then it displayed green
