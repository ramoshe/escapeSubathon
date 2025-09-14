// TODO can i find next goal based on count?

// SUBS COUNTER
async function getCount() {
    const res = await fetch('/.netlify/functions/counter');
    const data = await res.json();
    const count = data.count;

    const countDisplay = document.getElementById('count');
    countDisplay.innerHTML = count;
}

// HOURS COUNTER
function countHours() {
    const start = new Date("2025-09-08T19:00:00-05:00");
    const current = new Date();

    const diffMs = current - start;
    const diffHours = diffMs / (1000 * 60 * 60);

    const hours = document.getElementById('hours');
    hours.innerHTML = diffHours.toFixed(0);
}

window.onload = () => {
    countHours();
    setTimeout(countHours, 1800000);
}