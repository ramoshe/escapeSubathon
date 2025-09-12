// -= Pull in menu data
const rewards = window.menuData.rewards;
const goals = window.menuData.goals;
const IRLrewards = window.menuData.IRLrewards;

// -= Holder for slides
window.generatedSlides = [];

// -= HELPER Builds list SLIDE from goals and rewards data
function makeListSlide(title, items, classname, animation) {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slide', animation);
    slideDiv.dataset.effect = animation;
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

// -= HELPER - Builds list ITEM with amount, emote, and text
function makeListItem(amt, emo, txt, cls) {
    const item = document.createElement('li');
    item.classList.add(cls);
    let amtP = ``;
    if (cls == 'reward') { amtP = `<p class="amt"><span class="dol">$${amt*5}</span>${amt}</p>` }
    if (cls == 'goal') { amtP = `<p class="amt">${amt}</p>` }
    item.innerHTML = amtP + `<p class="emo">${emo}</p><p class="txt">${txt}</p>`;
    return item;
}

// -= Create the Slides
const goalSlide1 = makeListSlide("Goals", goals.slice(0, 7), "goal", "fadepush");
const goalSlide2 = makeListSlide("more Goals", goals.slice(7, 14), "goal", "push");
const goalSlide3 = makeListSlide("even more Goals", goals.slice(14), "goal", "pushfade");

window.generatedSlides.push(goalSlide1, goalSlide2, goalSlide3);

window.sleeping = true;

if (window.sleeping) {
    const sleepSlide = document.createElement('div');
    sleepSlide.classList.add('slide', 'fade');
    sleepSlide.dataset.effect = 'fade';
    sleepSlide.innerHTML = `<h1 class="bigemo">😴</h1>
            <h1>Rewards & Goals are paused</h1>
            <h2>will resume upon awakening</h2>`
    window.generatedSlides.push(sleepSlide);
} else if (window.IRLactive) {
    const IRLrewardSlide = makeListSlide("IRL Rewards", IRLrewards, "reward", "fade");
    window.generatedSlides.push(IRLrewardSlide);
} else {
    const rewardSlide = makeListSlide("Rewards", rewards, "reward", "fade");
    window.generatedSlides.push(rewardSlide);
}