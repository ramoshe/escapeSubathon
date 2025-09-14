// TODO can i find next goal based on count?

window.onload = () => {
    getCount();
    countHours();
    setTimeout(countHours, 1000000);
}

// SUBS COUNTER
async function getCount() {
    const res = await fetch('/.netlify/functions/counter');
    const data = await res.json();
    const count = data.count;

    const countDisplay = document.getElementById('count');
    countDisplay.innerHTML = count.toFixed(0);
}

// HOURS COUNTER
function countHours() {
    const start = new Date("2025-09-14T19:00:00-00:00");
    const current = new Date();

    const diffMs = current - start;
    const diffHours = diffMs / (1000 * 60 * 60);

    const hours = document.getElementById('hours');
    hours.innerHTML = diffHours.toFixed(0);
}