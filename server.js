const express = require('express');
const crypto = require('crypto');

const app = express();

// Configured email addresses
const emailAddresses = [
  "im7548631@gmail.com",
  "ffrd8734@gmail.com",
  "heyjrhjrhrj@gmail.com",
];

// HTML Dashboard Code
const htmlDashboard = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Dashboard</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    body { background-color: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
    .card { background: #1e293b; border-radius: 12px; padding: 30px; max-width: 500px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h1 { font-size: 1.5rem; margin-bottom: 20px; color: #38bdf8; text-align: center; }
    .section { margin-bottom: 25px; background: #334155; padding: 15px; border-radius: 8px; }
    h2 { font-size: 1.1rem; margin-bottom: 10px; color: #94a3b8; }
    ul { list-style: none; }
    li { background: #1e293b; padding: 8px 12px; margin-bottom: 6px; border-radius: 6px; font-family: monospace; color: #e2e8f0; font-size: 0.9rem; }
    .password-box { display: flex; gap: 10px; align-items: center; margin-top: 10px; }
    input[type="text"] { flex: 1; padding: 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #38bdf8; font-family: monospace; font-size: 1rem; outline: none; }
    button { padding: 10px 16px; border: none; background: #0284c7; color: white; border-radius: 6px; cursor: pointer; font-weight: bold; transition: background 0.2s; }
    button:hover { background: #0369a1; }
    .endpoints { font-size: 0.85rem; color: #64748b; margin-top: 15px; text-align: center; }
    .endpoints a { color: #38bdf8; text-decoration: none; }
    .endpoints a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Node.js API Dashboard</h1>

    <div class="section">
      <h2>Configured Email Addresses</h2>
      <ul id="email-list">
        <li>Loading emails...</li>
      </ul>
    </div>

    <div class="section">
      <h2>20-Character Password Generator</h2>
      <div class="password-box">
        <input type="text" id="password-display" readonly placeholder="Click generate..." />
        <button onclick="generatePassword()">Generate</button>
      </div>
    </div>

    <div class="endpoints">
      Endpoints: 
      <a href="/api/emails" target="_blank">/api/emails</a> | 
      <a href="/api/passwords" target="_blank">/api/passwords</a>
    </div>
  </div>

  <script>
    async function fetchEmails() {
      try {
        const res = await fetch('/api/emails');
        const data = await res.json();
        const list = document.getElementById('email-list');
        list.innerHTML = data.emails.map(email => '<li>' + email + '</li>').join('');
      } catch (err) {
        document.getElementById('email-list').innerHTML = '<li>Error loading emails</li>';
      }
    }

    async function generatePassword() {
      try {
        const res = await fetch('/api/passwords');
        const data = await res.json();
        document.getElementById('password-display').value = data.password;
      } catch (err) {
        document.getElementById('password-display').value = 'Error generating password';
      }
    }

    fetchEmails();
    generatePassword();
  </script>
</body>
</html>`;

// Handle Root (HTML Dashboard)
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(htmlDashboard);
});

// Handle GET /api/emails
app.get('/api/emails', (req, res) => {
  res.json({
    success: true,
    count: emailAddresses.length,
    emails: emailAddresses,
  });
});

// Helper to generate a secure random password using crypto
function generateRandomPassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let password = "";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    const randomIndex = randomValues[i] % charset.length;
    password += charset[randomIndex];
  }
  return password;
}

// Handle GET /api/passwords
app.get('/api/passwords', (req, res) => {
  const password = generateRandomPassword(20);
  res.json({
    success: true,
    length: password.length,
    password: password,
  });
});

// Fetch PORT from environment, fallback to 5900 if not set
const PORT = process.env.PORT || 5900;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
