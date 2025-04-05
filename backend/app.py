from flask import Flask, request, jsonify
import pandas as pd
import os
import bcrypt
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

# USERS_FILE = "data/users.xlsx"
USERS_FILE = "Data/users.xlsx"

# Ensure users.xlsx exists
if not os.path.exists("Data"):
    os.makedirs("Data")

if not os.path.exists(USERS_FILE):
    df = pd.DataFrame(columns=["Username", "Email", "Password"])
    df.to_excel(USERS_FILE, index=False, engine="openpyxl")

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

if __name__ == "__main__":
    app.run(debug=True, port=5000)