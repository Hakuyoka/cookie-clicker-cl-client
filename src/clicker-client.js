const puppeteer = require('puppeteer');
const SaveData = require("./SaveData");
const randCodeGen = require("./RandomEventKeyGen");

const config = {
    headless: false
};

const setSaveData = async (page) => {
    const saveData = new SaveData();
    let saveDataHash = saveData.load();
    if (saveDataHash) {
        await page.evaluate((saveDataHash)=>{
            localStorage.setItem('CookieClickerGame', saveDataHash);
        }, saveDataHash);
    }
};

let page = null;
async function start() {
    const browser = await puppeteer.launch(config);
    page = await browser.newPage();
    await page.goto('https://orteil.dashnet.org/cookieclicker/');
    await setSaveData(page);
    await page.waitFor("#bigCookie");

    let exitGoldenCookie = false;
    page.on('console', consoleObj => console.log(consoleObj.text()));
    setInterval(async ()=>{
        let shimmer = await page.$("#shimmers .shimmer");
        if(shimmer && !exitGoldenCookie) {
            exitGoldenCookie = true;
            console.log("Golden Cookie is appeared!!");
            randCodeGen.generate();
            console.log("type: " + randCodeGen.code)
        } else if(!shimmer && exitGoldenCookie) {
            exitGoldenCookie = false;
        }
    }, 500);
}

async function click() {
    await page.click("#bigCookie");
    await page.evaluate(()=>{
        console.log(Math.floor(Game.cookies) + " + " + Game.computedMouseCps);
    });
    return false
}

async function clickGolden() {
    await page.click(".shimmer");
    await page.evaluate(()=>{
        console.log(Game.textParticles[0].text);
    });
    return false
}

module.exports = {
    click,
    start,
    clickGolden
};