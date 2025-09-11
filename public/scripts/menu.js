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
    {   "amt": 20,  "emo": "📞",  "txt": "Prank Call"
    },
    {   "amt": 30,  "emo": "🧊",  "txt": "Ice Bucket"
    },
    {   "amt": 40,  "emo": "🧁",  "txt": "GIF Emote"
    },
    {   "amt": 50,  "emo": "💐",  "txt": "Speed Dating"
    },
    {   "amt": 60,  "emo": "🎁",  "txt": "Coaster Giveaway"
    },
    {   "amt": 70,  "emo": "🍕",  "txt": "Pizza Challenge"
    },
    {   "amt": 80,  "emo": "💬",  "txt": "Chat Roulette"
    },
    {   "amt": 100, "emo": "😱",  "txt": "Horror Game"
    },
    {   "amt": 120, "emo": "🔥",  "txt": "Fire Pit Stream"
    },
    {   "amt": 140, "emo": "🍑",  "txt": "Booty Bed Hour"
    },
    {   "amt": 160, "emo": "💝",  "txt": "Art Giveaway"
    },
    {   "amt": 180, "emo": "🏥",  "txt": "Nurse Ramo"
    },
    {   "amt": 200, "emo": "🎨",  "txt": "Body Art Stream"
    }
];


window.onload = () => {
    showSlides(slideIndex);
}

// -= Create the Slides
let slides = [];
const rewardSlide = listSlide("Rewards", rewards, "reward");
const goalSlide1 = listSlide("Goals", goals.slice(0, 7), "goal");
const goalSlide2 = listSlide("more Goals", goals.slice(7), "goal");
slides.push(rewardSlide, goalSlide1, goalSlide2);

// -= Adds slides to DOM
const container = document.getElementById('container');
slides.forEach(slide => {
    const slideDiv = slide;
    slideDiv.classList.add('slide', 'fade');
    container.appendChild(slideDiv);
});

// -= Builder for list ITEM with amount, emote, and text
function listItem(amt, emo, txt, cls) {
    const item = document.createElement('li');
    item.classList.add(cls);
    let amtP = ``;
    if (cls == 'reward') { amtP = `<p class="amt"><span class="dol">$${amt*5}</span>${amt}</p>` }
    if (cls == 'goal') { amtP = `<p class="amt">${amt}</p>` }
    item.innerHTML = amtP + `<p class="emo">${emo}</p><p class="txt">${txt}</p>`;
    return item;
}

// -= Builder for list SLIDE
function listSlide(title, items, classname) {
    const listDiv = document.createElement('div');
    const listTitle = document.createElement('h1');
    listTitle.textContent = title;
    listDiv.appendChild(listTitle);
    const listList = document.createElement('ul');
    listDiv.appendChild(listList);
    items.forEach(item => {
        const theItem = listItem(item.amt, item.emo, item.txt, classname);
        listList.appendChild(theItem);
    });
    return listDiv;
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