const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const filePath = 'users.xlsx';

// Initialize Excel file if it doesn't exist
if (!fs.existsSync(filePath)) {
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet([]);
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');
  xlsx.writeFile(workbook, filePath);
}

const readUsers = () => {
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets['Users'];
  return xlsx.utils.sheet_to_json(worksheet);
};

const writeUsers = (users) => {
  const worksheet = xlsx.utils.json_to_sheet(users);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');
  xlsx.writeFile(workbook, filePath);
};

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const users = readUsers();
  if (users.find(user => user.email === email)) {
    return res.status(400).send('Email already registered');
  }
  users.push({ username, email, password });
  writeUsers(users);
  res.status(201).send('User registered successfully');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(user => user.email === email && user.password === password);
  if (user) {
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
