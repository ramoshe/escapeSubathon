const loginContainer = document.getElementById('login-container');
const settingsContainer = document.getElementById('settings-container');
const error = document.getElementById('error');

// Handle login
document.getElementById('loginBtn').onclick = async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('/.netlify/functions/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.success) {
      // Save creds temporarily in memory
      window.currentUser = username;
      window.currentPass = password;

      loginContainer.style.display = 'none';
      settingsContainer.style.display = 'block';
    } else {
      error.textContent = 'Invalid username or password';
    }
  } catch (err) {
    error.textContent = 'Error connecting to server';
    console.error(err);
  }
};
