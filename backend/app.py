from flask import Flask, request, jsonify
import pandas as pd
import os
import bcrypt
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Define file paths
USERS_FILE = "Data/users.xlsx"
HRMS_FILE = "Data/hrms.xlsx"

# Ensure directories exist
if not os.path.exists("Data"):
    os.makedirs("Data")

# Ensure users.xlsx exists
if not os.path.exists(USERS_FILE):
    df = pd.DataFrame(columns=["Username", "Email", "Password"])
    df.to_excel(USERS_FILE, index=False, engine="openpyxl")

# Ensure hrms.xlsx exists with proper columns
def initialize_hrms_file():
    if not os.path.exists(HRMS_FILE):
        # Create columns: Manager Name, Team Member, and all factors
        columns = ["Manager Name", "Team Member", "Submission Date"]
        
        # Add all factor columns
        factors = [
            "Redeployment", "Marriage in offing", "Night shift", "Family problem",
            "Salary", "Higher education", "Performance", "VIC", "Skill set",
            "Attendance", "External Interviews", "Behavior/Motivation", "Rewards",
            "Duration in current role", "Training performance", "DIP payment",
            "Growth", "Personal problems", "Discipline / CAP / PCRB", 
            "Bench without work?", "Onsite job/Travel"
        ]
        
        columns.extend(factors)
        
        df = pd.DataFrame(columns=columns)
        df.to_excel(HRMS_FILE, index=False, engine="openpyxl")
        print(f"Created HRMS Excel file at {HRMS_FILE}")
    return True

# Initialize HRMS file
initialize_hrms_file()

# Read users from file
def read_users():
    return pd.read_excel(USERS_FILE, engine="openpyxl")

# Hash password
def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

# Verify password
def verify_password(stored_password, provided_password):
    return bcrypt.checkpw(provided_password.encode(), stored_password.encode())

# Save new user to file
def save_user(username, email, password):
    df = read_users()
    
    if email in df["Email"].values:
        return False  # User already exists
    
    hashed_password = hash_password(password)
    new_user = pd.DataFrame({"Username": [username], "Email": [email], "Password": [hashed_password]})
    df = pd.concat([df, new_user], ignore_index=True)
    df.to_excel(USERS_FILE, index=False, engine="openpyxl")
    return True

# Validate user credentials
def validate_user(email, password):
    df = read_users()
    user = df[df["Email"] == email]
    
    if not user.empty:
        stored_password = user.iloc[0]["Password"]
        username = user.iloc[0]["Username"]
        if verify_password(stored_password, password):
            return True, username
    
    return False, None

# Register User
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Invalid request"}), 400
        
        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        confirm_password = data.get("confirm_password", "").strip()
        
        if not username or not email or not password or not confirm_password:
            return jsonify({"error": "All fields are required"}), 400
        
        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400
        
        if save_user(username, email, password):
            return jsonify({"message": "Registration successful!"}), 201
        else:
            return jsonify({"error": "User already exists"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Login User
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Invalid request"}), 400
        
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        
        is_valid, username = validate_user(email, password)
        if is_valid:
            return jsonify({
                "message": "Login successful",
                "username": username
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Submit Evaluation
@app.route("/submit-evaluation", methods=["POST"])
def submit_evaluation():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Invalid request"}), 400
        
        manager_name = data.get("managerName", "")
        team_member = data.get("teamMember", "")
        factor_ratings = data.get("factorRatings", {})
        
        if not manager_name or not team_member:
            return jsonify({"error": "Manager name and team member are required"}), 400
        
        # Initialize the HRMS file if it doesn't exist
        initialize_hrms_file()
        
        # Read existing data
        try:
            df = pd.read_excel(HRMS_FILE, engine="openpyxl")
        except Exception as e:
            print(f"Error reading HRMS file: {e}")
            # If there's an error reading, recreate the file
            initialize_hrms_file()
            df = pd.read_excel(HRMS_FILE, engine="openpyxl")
        
        # Create a new row with null values for all columns
        new_row = {col: None for col in df.columns}
        
        # Fill in the values we have
        new_row["Manager Name"] = manager_name
        new_row["Team Member"] = team_member
        new_row["Submission Date"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Fill in factor ratings
        for factor, rating in factor_ratings.items():
            if factor in df.columns:
                new_row[factor] = rating
        
        # Append the new row
        df_new_row = pd.DataFrame([new_row])
        df = pd.concat([df, df_new_row], ignore_index=True)
        
        # Save to Excel file
        df.to_excel(HRMS_FILE, index=False, engine="openpyxl")
        
        return jsonify({
            "message": f"Evaluation for {team_member} submitted successfully",
            "timestamp": new_row["Submission Date"]
        }), 201
    except Exception as e:
        print(f"Error in submit_evaluation: {e}")
        return jsonify({"error": str(e)}), 500

# Get HRMS Data endpoint
@app.route("/get-hrms-data", methods=["GET"])
def get_hrms_data():
    try:
        # Check if HRMS file exists
        if not os.path.exists(HRMS_FILE):
            initialize_hrms_file()
            return jsonify([]), 200
        
        # Read HRMS data from Excel file
        df = pd.read_excel(HRMS_FILE, engine="openpyxl")
        
        # Convert DataFrame to a list of dictionaries (JSON format)
        data = df.to_dict(orient="records")
        
        return jsonify(data), 200
    except Exception as e:
        print(f"Error retrieving HRMS data: {e}")
        return jsonify({"error": str(e)}), 500

# Get team members endpoint (for dropdown lists)
@app.route("/get-team-members", methods=["GET"])
def get_team_members():
    try:
        if not os.path.exists(HRMS_FILE):
            initialize_hrms_file()
            return jsonify([]), 200
        
        df = pd.read_excel(HRMS_FILE, engine="openpyxl")
        
        # Get unique team members
        team_members = df["Team Member"].dropna().unique().tolist()
        
        return jsonify(team_members), 200
    except Exception as e:
        print(f"Error retrieving team members: {e}")
        return jsonify({"error": str(e)}), 500

# Get managers endpoint (for filtering)
@app.route("/get-managers", methods=["GET"])
def get_managers():
    try:
        if not os.path.exists(HRMS_FILE):
            initialize_hrms_file()
            return jsonify([]), 200
        
        df = pd.read_excel(HRMS_FILE, engine="openpyxl")
        
        # Get unique managers
        managers = df["Manager Name"].dropna().unique().tolist()
        
        return jsonify(managers), 200
    except Exception as e:
        print(f"Error retrieving managers: {e}")
        return jsonify({"error": str(e)}), 500

# Get team member data by name
@app.route("/get-team-member/<name>", methods=["GET"])
def get_team_member(name):
    try:
        if not os.path.exists(HRMS_FILE):
            initialize_hrms_file()
            return jsonify({"error": "Team member not found"}), 404
        
        df = pd.read_excel(HRMS_FILE, engine="openpyxl")
        
        # Filter by team member name
        member_data = df[df["Team Member"] == name]
        
        if member_data.empty:
            return jsonify({"error": "Team member not found"}), 404
        
        # Get the most recent evaluation (sort by submission date)
        if "Submission Date" in member_data.columns:
            member_data = member_data.sort_values("Submission Date", ascending=False)
        
        # Convert to dictionary
        result = member_data.iloc[0].to_dict()
        
        return jsonify(result), 200
    except Exception as e:
        print(f"Error retrieving team member data: {e}")
        return jsonify({"error": str(e)}), 500

# Delete team member evaluation
@app.route("/delete-evaluation", methods=["DELETE"])
def delete_evaluation():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Invalid request"}), 400
        
        team_member = data.get("teamMember", "")
        submission_date = data.get("submissionDate", "")
        
        if not team_member or not submission_date:
            return jsonify({"error": "Team member and submission date are required"}), 400
        
        if not os.path.exists(HRMS_FILE):
            return jsonify({"error": "No evaluations found"}), 404
        
        df = pd.read_excel(HRMS_FILE, engine="openpyxl")
        
        # Filter out the record to delete
        initial_length = len(df)
        df = df[~((df["Team Member"] == team_member) & (df["Submission Date"] == submission_date))]
        
        if len(df) == initial_length:
            return jsonify({"error": "Evaluation not found"}), 404
        
        # Save the updated dataframe
        df.to_excel(HRMS_FILE, index=False, engine="openpyxl")
        
        return jsonify({"message": f"Evaluation for {team_member} deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting evaluation: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)