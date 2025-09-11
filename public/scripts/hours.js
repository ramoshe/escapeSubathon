function countHours() {
    const start = new Date("2025-09-08T19:00:00-05:00");
    const current = new Date();

    const diffMs = current - start;
    const diffHours = diffMs / (1000 * 60 * 60);

    const hours = document.getElementById('hours');
    hours.innerHTML = diffHours.toFixed(0);
}

countHours();
setTimeout(countHours, 1800000);