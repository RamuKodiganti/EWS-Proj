import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define all factors from the HRMS system
  const allFactors = [
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

  // Define the option groups (1, 3, 5)
  const factorOptions = {
    Redeployment: {
      "Actively seeking redeployment / difficulty in redeploying": 1,
      "Has talked about redeployment though not pursuing actively": 3,
      "No issues": 5,
    },
    "Marriage in offing": {
      "Definite that would leave": 1,
      "Might leave...": 3,
      "No issues": 5,
    },
    "Night shift": {
      "Has health problems due to night shifts...asked persistently for a day shift": 1,
      "Has mentioned about moving to day shift...not persistent": 3,
      "No issues": 5,
    },
    "Family problem": {
      "We know these are causing problems at job...performance, late, etc": 1,
      "Seems to be able to cope": 3,
      "No issues": 5,
    },
    Salary: {
      "Extremely dissatisfied": 1,
      Dissatisfied: 3,
      "No issues": 5,
    },
    "Higher education": {
      "Studying for entrance, not wanting to pursue through edu@University": 1,
      "Mentioned interest in higher education...might be applying for the same": 3,
      "No issues": 5,
    },
    Performance: {
      "NI for more than 3 months": 1,
      Inconsistent: 3,
      "No issues": 5,
    },
    VIC: {
      "Not received VIC in the last 3 months": 1,
      Inconsistent: 3,
      "No issues": 5,
    },
    "Skill set": {
      "Completely out of sync with current job profile": 1,
      "Somewhat out of sync": 3,
      "Right fit": 5,
    },
    Attendance: {
      "Frequently on leave, unscheduled": 1,
      "Frequent leave due to known reasons": 3,
      "No issues": 5,
    },
    "External Interviews": {
      "Has been sighted, confirmed to be taking interviews": 1,
      "Word of mouth...may be taking interviews": 3,
      "No issues": 5,
    },
    "Behavior/Motivation": {
      "Low on motivation, indiscipline...disinterested with the job": 1,
      "Low motivation...but trying to cope": 3,
      "No issues": 5,
    },
    Rewards: {
      "Not rewarded / appreciated for the last 1 year": 1,
      "Not rewarded / appreciated for the last 6 months": 3,
      "No issues": 5,
    },
    "Duration in current role": {
      "More than 2 yrs": 1,
      "More than 18 months": 3,
      "No issues": 5,
    },
    "Training performance": {
      "Not clearing tollgates": 1,
      "Difficulty / barely clearing tollgates": 3,
      "No issues": 5,
    },
    "DIP payment": {
      "Getting DIP payment next month": 1,
      "Getting DIP next quarter": 3,
      "No issues": 5,
    },
    Growth: {
      "Failed to clear growth opportunity more than once": 1,
      "Failed to clear growth opportunity once": 3,
      "No issues": 5,
    },
    "Personal problems": {
      "Severe problems interfering with work": 1,
      "Problems...able to cope with difficulty": 3,
      "No issues": 5,
    },
    "Discipline / CAP / PCRB": {
      "Pending PCRB, Given more than one CAP": 1,
      "Pending PCRB, Given one CAP": 3,
      "No issues": 5,
    },
    "Bench without work?": {
      "On bench without work for more than 3 months": 1,
      "On bench without work more than 1 month": 3,
      "No issues": 5,
    },
    "Onsite job/Travel": {
      "Wants onsite job / challenge with high travel": 1,
      "Mentioned wanting onsite job...challenge with high travel": 3,
      "No issues": 5,
    },
  };

  // Function to determine option category (1, 3, or 5) for a given factor value
  const getOptionCategory = (factor, value) => {
    if (!value || !factorOptions[factor]) return null;

    for (const [optionText, category] of Object.entries(
      factorOptions[factor]
    )) {
      if (value === optionText) {
        return category;
      }
    }
    return null;
  };

  // Function to determine result color based on the specified rules
  const determineResultColor = (options) => {
    const countCategory1 = options[1].length;
    const countCategory3 = options[3].length;
    const countCategory5 = options[5].length > 0;

    // Case 2: Column 1 has 2 or more options - RED
    if (countCategory1 >= 2) {
      return "red";
    }

    // Case 1: Column 1 has exactly 1 option - YELLOW
    if (countCategory1 === 1) {
      return "yellow";
    }

    // Case 3: No options in column 1, 3 or more options in column 3 - YELLOW
    if (countCategory1 === 0 && countCategory3 >= 3) {
      return "yellow";
    }

    // Case 4: No options in column 1, less than 3 options in column 3, and 1 or more in column 5 - GREEN
    if (countCategory1 === 0 && countCategory3 < 3 && countCategory5) {
      return "green";
    }

    // Default case
    return "gray";
  };

  // Process data to organize by team member and option categories
  const processData = (data) => {
    const processedData = [];

    // Group data by team member
    const teamMemberGroups = {};

    data.forEach((item) => {
      const teamMember = item["Team Member"];
      if (!teamMemberGroups[teamMember]) {
        teamMemberGroups[teamMember] = {
          name: teamMember,
          manager: item["Manager Name"],
          options: {
            1: [],
            3: [],
            5: [],
          },
          rawData: {},
        };
      }

      // Process each factor
      allFactors.forEach((factor) => {
        const value = item[factor];
        if (value) {
          // Store the raw data
          teamMemberGroups[teamMember].rawData[factor] = value;

          // Determine option category and add to the appropriate list
          const category = getOptionCategory(factor, value);
          if (category) {
            teamMemberGroups[teamMember].options[category].push({
              factor,
              value,
            });
          }
        }
      });
    });

    // Convert the grouped data to an array and determine result colors
    Object.values(teamMemberGroups).forEach((memberData) => {
      memberData.resultColor = determineResultColor(memberData.options);
      processedData.push(memberData);
    });

    return processedData;
  };

  // Fetch data from the backend or use sample data (for development)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Use mock data to avoid network issues during development
        // In production, this should fetch from the API
        // const response = await fetch('http://localhost:5000/get-hrms-data');
        // const data = await response.json();

        // Hard-coded sample data (for development/demo purposes)
        const sampleData = [
          {
            "Manager Name": "Sai",
            "Team Member": "Charlie",
            "Submission Date": "2025-04-13 15:50:18",
            "Family problem":
              "We know these are causing problems at job...performance, late, etc",
          },
          {
            "Manager Name": "Sai",
            "Team Member": "Alice",
            "Submission Date": "2025-04-13 15:53:08",
            Redeployment:
              "Actively seeking redeployment / difficulty in redeploying",
            "Marriage in offing": "Definite that would leave",
            "Night shift":
              "Has mentioned about moving to day shift...not persistent",
            "Family problem": "Seems to be able to cope",
            Salary: "Extremely dissatisfied",
            "Higher education":
              "Studying for entrance, not wanting to pursue through edu@University",
            Performance: "Inconsistent",
            VIC: "Not received VIC in the last 3 months",
            "Skill set": "Somewhat out of sync",
            Attendance: "Frequently on leave, unscheduled",
            "Behavior/Motivation": "Low motivation...but trying to cope",
            "Duration in current role": "More than 2 yrs",
            "Training performance": "Not clearing tollgates",
            Growth: "Failed to clear growth opportunity once",
            "Personal problems": "Problems...able to cope with difficulty",
            "Bench without work?":
              "On bench without work for more than 3 months",
            "Onsite job/Travel":
              "Wants onsite job / challenge with high travel",
          },
          {
            "Manager Name": "Ramu",
            "Team Member": "David",
            "Submission Date": "2025-04-13 21:01:14",
            Redeployment:
              "Actively seeking redeployment / difficulty in redeploying",
            "Marriage in offing": "Might leave...",
            "Night shift":
              "Has health problems due to night shifts...asked persistently for a day shift",
            Salary: "Extremely dissatisfied",
            "Higher education":
              "Mentioned interest in higher education...might be applying for the same",
            Performance: "Inconsistent",
            VIC: "Not received VIC in the last 3 months",
            "Skill set": "Completely out of sync with current job profile",
            "External Interviews": "Word of mouth...may be taking interviews",
          },
        ];

        const processedData = processData(sampleData);
        setTeamData(processedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch team data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Team Risk Assessment Dashboard</h1>

      {loading ? (
        <div className="loading-indicator">Loading team data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Team Member</th>
                <th>High Risk Factors (1)</th>
                <th>Medium Risk Factors (3)</th>
                <th>Low Risk Factors (5)</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {teamData.map((member, index) => (
                <tr key={index}>
                  <td className="team-member-name">{member.name}</td>
                  <td className="option-cell">
                    <ul className="option-list">
                      {member.options[1].map((option, optIndex) => (
                        <li key={optIndex} className="option-item">
                          <strong>{option.factor}:</strong> {option.value}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="option-cell">
                    <ul className="option-list">
                      {member.options[3].map((option, optIndex) => (
                        <li key={optIndex} className="option-item">
                          <strong>{option.factor}:</strong> {option.value}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="option-cell">
                    <ul className="option-list">
                      {member.options[5].map((option, optIndex) => (
                        <li key={optIndex} className="option-item">
                          <strong>{option.factor}:</strong> {option.value}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className={`result-cell ${member.resultColor}`}>
                    {member.resultColor === "red"
                      ? "High Risk"
                      : member.resultColor === "yellow"
                      ? "Medium Risk"
                      : member.resultColor === "green"
                      ? "Low Risk"
                      : "Undefined"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
