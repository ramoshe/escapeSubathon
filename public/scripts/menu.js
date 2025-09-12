const rewards = [
    {   "amt": 1,   "emo": "⚙️",  "txt": "Wheel Spin"
    },
    {   "amt": 2,   "emo": "🎯",  "txt": "Wheel Pick"
    },
    {   "amt": 3,   "emo": "👤",  "txt": "Name or Pic"
    },
    {   "amt": 4,   "emo": "🌟",  "txt": "*Goal Special*"
    },
    {   "amt": 5,   "emo": "👙",  "txt": "Outfit Choice"
    },
    {   "amt": 10,  "emo": "🌹",  "txt": "Discord Date"
    },
    {   "amt": 20,  "emo": "🍆",  "txt": "Naughty Stream"
    }
];
const goals = [
    {   "amt": 10,  "emo": "💋",  "txt": "Sexy ASMR"
    },
    {   "amt": 40,  "emo": "🖐",  "txt": "Never Have I"
    },
    {   "amt": 60,  "emo": "🧊",  "txt": "Ice Bucket"
    },
    {   "amt": 80,  "emo": "💐",  "txt": "Speed Dating"
    },
    {   "amt": 100, "emo": "🎲",  "txt": "WILDCARD"
    },
    {   "amt": 120, "emo": "💬",  "txt": "Chat Roulette"
    },
    {   "amt": 140, "emo": "🧁",  "txt": "GIF Emote"
    },
    {   "amt": 170,  "emo": "🍕",  "txt": "Pizza Challenge"
    },
    {   "amt": 200, "emo": "🎲",  "txt": "WILDCARD"
    },
    {   "amt": 230, "emo": "🔥",  "txt": "Fire Pit Stream"
    },
    {   "amt": 260, "emo": "💃🏽",  "txt": "Dance Challenge"
    },
    {   "amt": 300, "emo": "🎲",  "txt": "WILDCARD"
    },
    {   "amt": 340, "emo": "🎁",  "txt": "Coaster Raffle"
    },
    {   "amt": 380, "emo": "😱",  "txt": "Horror Game"
    },
    {   "amt": 420, "emo": "☘️",  "txt": "Baked Baking"
    },
    {   "amt": 460, "emo": "🍑",  "txt": "Booty Bed Hour"
    },
    {   "amt": 500, "emo": "🎲",  "txt": "WILDCARD"
    },
    {   "amt": 550, "emo": "🏥",  "txt": "Nurse Ramo"
    },
    {   "amt": 600, "emo": "🎲",  "txt": "WILDCARD"
    },
    {   "amt": 200, "emo": "🎨",  "txt": "Glow Body Art"
    },
    {   "amt": 160, "emo": "💝",  "txt": "Art Giveaway"
    }
];


window.onload = () => {
    showSlides(slideIndex);
}

// -= Create the Slides
let slides = [];
const rewardSlide = makeSlide("Rewards", rewards, "reward", "fade");
const goalSlide1 = makeSlide("Goals", goals.slice(0, 7), "goal", "fadepush");
const goalSlide2 = makeSlide("more Goals", goals.slice(7, 14), "goal", "push");
const goalSlide3 = makeSlide("more Goals", goals.slice(14), "goal", "pushfade");
slides.push(rewardSlide, goalSlide1, goalSlide2, goalSlide3);

// -= Adds slides to DOM
const container = document.getElementById('container');
slides.forEach(slide => {
    container.appendChild(slide);
});

// -= Builder for list ITEM with amount, emote, and text
function makeListItem(amt, emo, txt, cls) {
    const item = document.createElement('li');
    item.classList.add(cls);
    let amtP = ``;
    if (cls == 'reward') { amtP = `<p class="amt"><span class="dol">$${amt*5}</span>${amt}</p>` }
    if (cls == 'goal') { amtP = `<p class="amt">${amt}</p>` }
    item.innerHTML = amtP + `<p class="emo">${emo}</p><p class="txt">${txt}</p>`;
    return item;
}

// -= Builder for list SLIDE
function makeSlide(title, items, classname, animation) {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slide', animation);
    const slideTitle = document.createElement('h1');
    slideTitle.textContent = title;
    slideDiv.appendChild(slideTitle);
    const slideList = document.createElement('ul');
    slideDiv.appendChild(slideList);
    items.forEach(item => {
        const listItem = makeListItem(item.amt, item.emo, item.txt, classname);
        slideList.appendChild(listItem);
    });
    return slideDiv;
}

// -= Cycles thorough slides
let slideIndex = 0;
function showSlides() {
    let i;
    let slides = document.getElementsByClassName("slide");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "flex";
    setTimeout(showSlides, 10000);
}