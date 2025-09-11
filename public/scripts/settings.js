const goal = 100;

function isNameSelected() {
    const amy = document.getElementById("amy");
    const ramo = document.getElementById("ramo");
    const namesForm = document.getElementById("streamer-selector");

    if (amy.checked || ramo.checked) {
        namesForm.style.border = "none";
        return true;
    } else {
        namesForm.style.border = "2px solid red";
        alert("Subs not added, must select a person.");
        return false;
    }
}

function addDonation() {
    if (isNameSelected()) {
        const total = document.querySelector(".total");
        const amount = document.querySelector(".amount");

        let donation = document.querySelector("#donation-amount").value;
        donation = donation / 5;

        countWho(donation);

        let currentTotal = parseFloat(total.innerHTML);
        let currentAmount = parseFloat(amount.style.height);

        const newTotal = parseFloat(currentTotal) + parseFloat(donation);
        const newAmount = currentAmount + ((donation / goal) * 100);
        // console.log(`${newTotal} ${newAmount}%`);

        total.innerHTML = `${newTotal}`;
        amount.style.height = `${newAmount}%`;

        document.querySelector("#donation-amount").value = "";
    }
}

var input = document.getElementById("donation-amount");
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        if (isNameSelected()) {
            event.preventDefault();
            document.getElementById("add-donation").click();
        }
    }
});

function addSubs(n) {
    if (isNameSelected()) {
        const total = document.querySelector(".total");
        const amount = document.querySelector(".amount");

        const donation = n;

        countWho(n);

        let currentTotal = parseFloat(total.innerHTML);
        let currentAmount = parseFloat(amount.style.height);

        const newTotal = parseFloat(currentTotal) + parseFloat(donation);
        const newAmount = currentAmount + ((donation / goal) * 100);
        // console.log(`${newTotal} ${newAmount}%`);

        total.innerHTML = `${newTotal}`;
        amount.style.height = `${newAmount}%`;

        document.querySelector("#donation-amount").value = "";
    }
}

function countWho(n) {
    const amyCount = document.getElementById("amy-count");
    const ramoCount = document.getElementById("ramo-count");

    if (amy.checked) {
        let count = parseFloat(amyCount.innerHTML);
        count = parseFloat(count) + parseFloat(n);
        amyCount.innerHTML = parseFloat(count).toFixed(1);
    } else if (ramo.checked) {
        let count = parseFloat(ramoCount.innerHTML);
        count = parseFloat(count) + parseFloat(n);
        ramoCount.innerHTML = parseFloat(count).toFixed(1);
    }

    amy.checked = false;
    ramo.checked = false;
}
