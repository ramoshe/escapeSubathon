const loginForm = document.getElementById("login-form");
const settingsForm = document.getElementById("settings-form");
const counterInput = document.getElementById("counter");
const sleepInput = document.getElementById("sleepActive");
const irlInput = document.getElementById("irlActive");
const msg = document.getElementById("settings-msg");

let currentUser = null;
let currentPass = null;

// --- 1. AUTHORIZE USER ---
async function authorizeUser(username, password) {
  const res = await fetch("/.netlify/functions/authorization", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  return data.success;
}

// --- 2. SHOW SETTINGS ---
async function showSettings() {
  const username = loginForm.username.value;
  const password = loginForm.password.value;

  const authorized = await authorizeUser(username, password);
  if (!authorized) {
    alert("Invalid username or password");
    return;
  }

  currentUser = username;
  currentPass = password;

  loginForm.style.display = "none";
  settingsForm.style.display = "block";

  // Load current settings (GET from settings blob)
  const allKeys = await fetchSettings();
  counterInput.value = allKeys.counter ?? 0;
  sleepInput.checked = allKeys.sleepActive === "true";
  irlInput.checked = allKeys.irlActive === "true";
}

// --- 3. SUBMIT SETTINGS ---
async function submitSettings() {
  if (!currentUser || !currentPass) {
    msg.textContent = "Not authorized";
    return;
  }

  // Re-authenticate before submitting
  const authorized = await authorizeUser(currentUser, currentPass);
  if (!authorized) {
    msg.textContent = "Authorization failed";
    return;
  }

  // Build updates array
  const updates = [
    { key: "counter", value: counterInput.value },
    { key: "sleepActive", value: sleepInput.checked },
    { key: "irlActive", value: irlInput.checked },
  ];

  const res = await fetch("/.netlify/functions/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updates }),
  });

  const data = await res.json();
  if (data.success) {
    msg.textContent = "Settings saved!";
  } else {
    msg.textContent = "Save failed: " + (data.error || "Unknown");
  }
}

// --- HELPER: FETCH CURRENT SETTINGS ---
async function fetchSettings() {
  const res = await fetch("/.netlify/functions/settings", {
    method: "GET",
  });
  const data = await res.json();
  return data.settings || {};
}

// --- EVENTS ---
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await showSettings();
});

settingsForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await submitSettings();
});