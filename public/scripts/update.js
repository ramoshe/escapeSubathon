let rewardCountdownInterval;

async function fetchOverlayData() {
  try {
    const [countRes, toggleRes, rewardRes] = await Promise.all([
      fetch("/.netlify/functions/count"),
      fetch("/.netlify/functions/toggle"),
      fetch("/.netlify/functions/special")
    ]);

    const [countData, toggleData, rewardData] = await Promise.all([
      countRes.json(),
      toggleRes.json(),
      rewardRes.json()
    ]);

    // Set globals
    window.subCount = countData.count ?? 0;
    window.outIRL = !!toggleData.is_irl;
    window.sleeping = !!toggleData.is_sleep;
    window.onJoy = !!toggleData.is_joystick;

    const rewardIsActive = rewardData.label && rewardData.goal > 0;

    window.special = {
      active: rewardIsActive,
      reward: rewardData.label ?? "",
      subs: rewardData.goal ?? 0,
      mins: rewardData.time_remaining != null
        ? Math.ceil(rewardData.time_remaining / 60)
        : null,
      seconds: rewardData.time_remaining ?? null
    };

    // Update Count
    const countEl = document.getElementById("count");
    if (countEl) countEl.textContent = window.subCount;

    // Update Next Goal
    const goalData = window.goalData || [];
    const nextGoal = goalData.find(g => g.subs > window.subCount);

    const nextGoalSpan = document.getElementById("nextgoal");
    const goalEmo = document.getElementById("goalemo");

    if (nextGoal) {
      if (nextGoalSpan) nextGoalSpan.textContent = nextGoal.title;
      if (goalEmo) goalEmo.textContent = nextGoal.emoji || "🎯";
    }

    // Update Reward Timer Display
    clearInterval(rewardCountdownInterval);

    if (window.special.active && window.special.seconds != null) {
      let secondsLeft = window.special.seconds;
      const rewardTimerEl = document.getElementById("rewardTimer");

      if (rewardTimerEl) {
        rewardTimerEl.textContent = Math.ceil(secondsLeft / 60);
      }

      rewardCountdownInterval = setInterval(() => {
        secondsLeft -= 60;

        if (secondsLeft <= 0) {
          clearInterval(rewardCountdownInterval);
          if (rewardTimerEl) rewardTimerEl.textContent = "0";
          window.special.active = false;
        } else if (rewardTimerEl) {
          rewardTimerEl.textContent = Math.ceil(secondsLeft / 60);
        }
      }, 60000); // Update every minute
    }

    window.dispatchEvent(new Event("overlayDataUpdated"));
  } catch (err) {
    console.error("Failed to fetch overlay data:", err);
  }
}

window.refreshOverlay = fetchOverlayData;
fetchOverlayData();
setInterval(fetchOverlayData, 60000); // Light fallback polling
