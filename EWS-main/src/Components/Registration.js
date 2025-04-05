import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const Registration = () => {
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [error, setError] = useState('');
// const [showPopup, setShowPopup] = useState(false);
const navigate = useNavigate();

const handleSubmit = async (e) => {
  // const formle= document.querySelector("form")
  
e.preventDefault();

try {
  const response = await fetch("http://127.0.0.1:5000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
      confirm_password: confirmPassword,
    }),
  });

  const data = await response.json();
  if (response.ok) {
    alert("Registration Successful! Redirecting to Login...");
    setTimeout(() => navigate("/login"), 1000); // Delay before navigating
  } else {
    alert(`Error: ${data.error}`);
  }
} catch (error) {
  console.error("Error:", error);
  alert("Failed to connect to the server.");
}




if (password !== confirmPassword) {
  setError('Passwords do not match');
  return;
}

setError('');
console.log('Registration data:', { username, email, password });
// setShowPopup(true);
};

// const handleClosePopup = () => {
// setShowPopup(false);
// navigate('/register');
// };

return (
<div style={styles.container}>
<div style={styles.card}>
<h2 style={styles.title}>Register Account</h2>
{error && <p style={styles.error}>{error}</p>}
<form onSubmit={handleSubmit} style={styles.form}>
<div style={styles.formGroup}>
<input
type="text"
value={username}
placeholder="Username"
onChange={(e) => setUsername(e.target.value)}
style={styles.input}
required
/>
</div>
<div style={styles.formGroup}>
<input
type="email"
value={email}
placeholder="Your Email"
onChange={(e) => setEmail(e.target.value)}
style={styles.input}
required
/>
</div>
<div style={styles.formGroup}>
<input
type="password"
value={password}
placeholder="Password"
onChange={(e) => setPassword(e.target.value)}
style={styles.input}
required
/>
</div>
<div style={styles.formGroup}>
<input
type="password"
value={confirmPassword}
placeholder="Confirm Password"
onChange={(e) => setConfirmPassword(e.target.value)}
style={styles.input}
required
/>
</div>
<div style={styles.buttonContainer}>
<button type="submit" style={styles.submitButton}>Register Account</button>
</div>
</form>
<p style={styles.footer}>
Already registered? <Link to="/login" style={styles.link}>Login</Link>
</p>
</div>



  {/* {showPopup && (
    <div style={styles.popup}>
      <div style={styles.popupContent}>
        <h3>Registration Successful!</h3>
        <p>
        Here to <Link to="/login" style={styles.link}>Login</Link>
        </p>
        <button onClick={handleClosePopup} style={styles.closeButton}>Close</button>
      </div>
    </div>
  )} */}
</div>
);
};

const styles = {
container: {
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
height: '100vh',
backgroundColor: '#CEE3D5',
fontFamily: 'Arial, sans-serif',
backgroundSize: 'cover',
},
card: {
backgroundColor: '#ffffff',
borderRadius: '12px',
boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
padding: '40px',
width: '100%',
maxWidth: '400px',
textAlign: 'center',
},
title: {
fontSize: '28px',
marginBottom: '20px',
color: '#333',
fontWeight: 'bold',
},
form: {
display: 'flex',
flexDirection: 'column',
},
formGroup: {
marginBottom: '15px',
},
input: {
width: '100%',
padding: '12px',
borderRadius: '6px',
border: '1px solid #ccc',
fontSize: '16px',
},
submitButton: {
background: '#5E5DF0',
borderRadius: '999px',
boxShadow: '#5E5DF0 0 10px 20px -10px',
boxSizing: 'border-box',
color: '#FFFFFF',
cursor: 'pointer',
fontFamily: 'Inter, Helvetica, "Apple Color Emoji", "Segoe UI Emoji", NotoColorEmoji, "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", EmojiSymbols, -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", sans-serif',
fontSize: '16px',
fontWeight: 700,
lineHeight: '24px',
opacity: 1,
outline: '0 solid transparent',
padding: '8px 18px',
userSelect: 'none',
WebkitUserSelect: 'none',
touchAction: 'manipulation',
width: 'fit-content',
wordBreak: 'break-word',
border: 0,
},
buttonContainer: {
display: 'flex',
justifyContent: 'center',
},
error: {
color: 'red',
marginBottom: '10px',
},
footer: {
marginTop: '20px',
color: '#666',
},
link: {
color: '#4f46e5',
textDecoration: 'none',
},
// popup: {
// position: 'fixed',
// top: 0,
// left: 0,
// right: 0,
// bottom: 0,
// backgroundColor: 'rgba(0, 0, 0, 0.5)',
// display: 'flex',
// alignItems: 'center',
// justifyContent: 'center',
// },
// popupContent: {
// backgroundColor: '#fff',
// padding: '20px',
// borderRadius: '8px',
// textAlign: 'center',
// },
closeButton: {
marginTop: '10px',
padding: '8px 16px',
backgroundColor: '#5E5DF0',
color: '#fff',
border: 'none',
borderRadius: '4px',
cursor: 'pointer',
},
};

export default Registration;
