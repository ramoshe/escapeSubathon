// TODO
// -add subs/dollars
// -reset current count
// -toggle IRL
// -toggle Sleep

const settingsMsg = document.getElementById('settingsMsg');
const settingsForm = document.getElementById('settingsForm');

settingsForm.onsubmit = async (e) => {
  e.preventDefault();

  if (!window.currentUser || !window.currentPass) {
    settingsMsg.textContent = "You must log in first.";
    return;
  }

  const sendSettings = [];

  const subsToAdd = parseInt(document.getElementById('subsToAdd').value);
  // TODO

  const dollsToAdd = parseInt(document.getElementById('dollsToAdd').value.trim());
  // TODO


  const resetCount = parseInt(document.getElementById('resetCount').value.trim());
  resetCount ? sendSettings.push({setting: subCount, value: resetCount}) : null;

  const sleepToggle = document.getElementById('sleepToggle').value;
  sleepToggle ? sendSettings.push({setting: sleepActive, value: true}) : sendSettings.push({setting: sleepActive, value: false});

  const irlToggle = document.getElementById('irlToggle').value;
  irl ? sendSettings.push({setting: irlActive, value: true}) : sendSettings.push({setting: irlActive, value: false});

  try {
    const res = await fetch('/.netlify/functions/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: window.currentUser,
        password: window.currentPass,
        settings: sendSettings
      })
    });

    const data = await res.json();
    if (data.success) {
      settingsMsg.textContent = "Settings updated successfully!";
    } else {
      settingsMsg.textContent = "Error: " + (data.error || "Update failed");
    }
  } catch (err) {
    settingsMsg.textContent = "Server error while saving settings";
    console.error(err);
  }
};
