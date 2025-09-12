function addDonation() {
    // if (isNameSelected()) {
        const total = document.querySelector(".total");
        const amount = document.querySelector(".amount");

        let donation = document.querySelector("#donation-amount").value;
        donation = donation / 5;

        // countWho(donation);

        let currentTotal = parseFloat(total.innerHTML);
        let currentAmount = parseFloat(amount.style.height);

        const newTotal = parseFloat(currentTotal) + parseFloat(donation);
        const newAmount = currentAmount + ((donation / goal) * 100);
        // console.log(`${newTotal} ${newAmount}%`);

        total.innerHTML = `${newTotal}`;
        amount.style.height = `${newAmount}%`;

        document.querySelector("#donation-amount").value = "";
    // }
}

var input = document.getElementById("donation-amount");
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        // if (isNameSelected()) {
            event.preventDefault();
            document.getElementById("add-donation").click();
        // }
    }
});

function addSubs(n) {
    // if (isNameSelected()) {
        const total = document.querySelector(".total");
        const amount = document.querySelector(".amount");

        const donation = n;

        // countWho(n);

        let currentTotal = parseFloat(total.innerHTML);
        let currentAmount = parseFloat(amount.style.height);

        const newTotal = parseFloat(currentTotal) + parseFloat(donation);
        const newAmount = currentAmount + ((donation / goal) * 100);
        // console.log(`${newTotal} ${newAmount}%`);

        total.innerHTML = `${newTotal}`;
        amount.style.height = `${newAmount}%`;

        document.querySelector("#donation-amount").value = "";
    // }
}
