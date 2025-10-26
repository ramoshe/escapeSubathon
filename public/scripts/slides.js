// Pull in MENU DATA
const rewards = window.menuData.rewards;
const goals = window.menuData.goals;
const IRLrewards = window.menuData.IRLrewards;
// TEST
    // window.onJoy = true;
    // window.sleeping = true;
    // window.outIRL = true;
    // window.special = {active:true, subs:10, reward:"Cool Reward", mins:10};

// Holder for ALL SLIDES
window.generatedSlides = [];

// +GOALS SLIDES
const goal1 = makeSlide("list", {title:"Goals", items: goals.slice(0,7)}, "goal", "fadepush");
const goal2 = makeSlide("list", {title:"More Goals", items: goals.slice(7,14)}, "goal", "push");
const goal3 = makeSlide("list", {title:"Top Goals", items: goals.slice(14)}, "goal", "pushfade");
window.generatedSlides.push(goal1, goal2, goal3);

// +EQUALS SLIDE -platform setting
const eqPlat = window.onJoy ? `100 Tokens` : `500 Kicks`;
const eqDoll = `<span class="eq-or eq-text">or</span>
$5 USD<span class="eq-pref eq-text">☜ helps most</span>
<span class="eq-text">!escape for links</span>`;
const equalSlide = makeSlide("text", {emo:"👯‍♀️", title:"Equal to 1 Sub", txt: [eqPlat, eqDoll]}, "equal", "fade");
window.generatedSlides.push(equalSlide);

// +REWARDS SLIDE -normal, IRL, or sleeping
if (window.sleeping) {
    const sleepSlide = makeSlide("text", {emo:"😴", title:"Rewards & Goals are paused", txt: [`will resume upon awakening`]}, "sleep", "fade");
    window.generatedSlides.push(sleepSlide);
} else if (window.outIRL) {
    const IRLrewardSlide = makeSlide("list", {title: "IRL Rewards", items: IRLrewards}, "reward", "fade");
    window.generatedSlides.push(IRLrewardSlide);
} else {
    const rewardSlide = makeSlide("list", {title: "Rewards", items: rewards}, "reward", "fade");
    window.generatedSlides.push(rewardSlide);
}

// +SPECIAL SLIDE -countdown optional
if (window.special.active) {
    const reward = `<span class="amount">— ${special.subs} Subs - or $${special.subs*5} —</span>
    <br /><span class="thing">${special.reward}</span>`;
    // !
    const timer = special.mins > 0 ? `ends in ${special.mins} min!` : ``;
    const specialSlide = makeSlide("text", {emo:"🌟", title:"REWARD SPECIAL", txt: [reward, timer]}, "special", "fade");
    window.generatedSlides.push(specialSlide);
}

// -= HELPER FUNCTIONS that create slides and their content

// -= Buids a Slide with animation setting
function makeSlide(type, content, classname, animation) {
    const slide = document.createElement('div');
    slide.classList.add('slide', animation);
    slide.dataset.effect = animation;
    if (type == "list") {
        const slideTitle = document.createElement('h1');
        slideTitle.textContent = content.title;
        slide.appendChild(slideTitle);
        const slideList = makeList(content.items, classname);
        slide.appendChild(slideList);
    }
    if (type == "text") {
        slide.classList.add(classname);
        const slideContent = makeContent(content.emo, content.title, content.txt);
        slideContent.forEach(item => {
            slide.appendChild(item);
        });
    }
    return slide;
}

// -= Builds list for slide (from goals and rewards data)
function makeList(items, classname) {
    const list = document.createElement('ul');
    items.forEach(item => {
        const listItem = makeListItem(item.amt, item.emo, item.txt, classname);
        list.appendChild(listItem);
    });
    return list;
}

// -= Builds item for list for slide
function makeListItem(amt, emo, txt, cls) {
    const item = document.createElement('li');
    item.classList.add(cls);
    let amtP = ``;
    if (cls == 'reward') { amtP = `<p class="amt"><span class="dol">$${amt*5}</span>${amt}</p>` }
    if (cls == 'goal') { amtP = `<p class="amt">${amt}</p>` }
    item.innerHTML = amtP + `<p class="emo">${emo}</p><p class="txt">${txt}</p>`;
    return item;
}

// -= Builds text content slide
function makeContent(emo, title, txt) {
    const content = [];
    const slideEmo = document.createElement('h1');
    slideEmo.classList.add('bigemo');
    slideEmo.textContent = emo;
    content.push(slideEmo);
    const slideTitle = document.createElement('h1');
    slideTitle.textContent = title;
    content.push(slideTitle);
    txt.forEach(item => {
        const textItem = document.createElement('h2');
        textItem.innerHTML = item;
        content.push(textItem);
    });
    return content;
}
