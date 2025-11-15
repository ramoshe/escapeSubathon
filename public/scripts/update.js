async function fetchOverlayData() {
  try {
    const [countRes, toggleRes, specialRes] = await Promise.all([
      fetch("/.netlify/functions/count"),
      fetch("/.netlify/functions/toggle"),
      fetch("/.netlify/functions/special")
    ]);

    const [countData, toggleData, specialData] = await Promise.all([
      countRes.json(),
      toggleRes.json(),
      specialRes.json()
    ]);

    // Set globals
    window.subCount = countData.count ?? 0;
    window.outIRL = !!toggleData.is_irl;
    window.sleeping = !!toggleData.is_sleep;
    window.onJoy = !!toggleData.is_joystick;
    window.special = {
        active: !!specialData.active,
        reward: String(specialData.reward || ""),
        subs:   Number(specialData.subs || 0),
    };

    // Update Count
    const countEl = document.getElementById("count");
    if (countEl) countEl.textContent = window.subCount;

    // Update Next Goal
    const goalData = window.menuData.goals;
    const nextGoal = goalData.find(g => g.amt > window.subCount);
    document.getElementById("nextgoal").textContent = nextGoal.txt;
    document.getElementById("goalemo").textContent = nextGoal.emo;

    window.buildSlides?.();
    window.dispatchEvent(new Event("overlayDataUpdated"));
  } catch (err) {
    console.error("Failed to fetch overlay data:", err);
  }
}

window.refreshOverlay = fetchOverlayData;
fetchOverlayData();
setInterval(fetchOverlayData, 60000); // Light fallback polling
