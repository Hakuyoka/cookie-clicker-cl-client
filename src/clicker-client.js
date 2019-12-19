const puppeteer = require('puppeteer');
const SaveData = require("./SaveData");
const randCodeGen = require("./RandomEventKeyGen");
const Product = require("./model/Product");

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

let browser;
let page;
let goldenCoolieListener;
async function start() {
    browser = await puppeteer.launch(config)
    page = await browser.newPage();
    await page.goto('https://orteil.dashnet.org/cookieclicker/');
    await setSaveData(page);
    await page.waitFor("#bigCookie");

    let exitGoldenCookie = false;
    page.on('console', consoleObj => console.log(consoleObj.text()));
    goldenCoolieListener = setInterval(async ()=>{
        let shimmer = await page.$("#shimmers .shimmer");
        if(shimmer && !exitGoldenCookie) {
            exitGoldenCookie = true;
            console.log("Golden Cookie is appeared!!");
            randCodeGen.generate();
            console.log("type: " + randCodeGen.code)
        } else if(!shimmer && exitGoldenCookie) {
            exitGoldenCookie = false;
            randCodeGen.generate();
            console.log("Golden Cookie is dis appeared...")
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

async function availableProduction() {
    let productionsElement = await page.$$(".product.unlocked.enabled");
    let productionsPromise = productionsElement.map(async (element)=>{
        let titleElement = await element.$(".title");
        let text = await (await titleElement.getProperty('textContent')).jsonValue();
        let amountElement = await element.$(".price");
        let price = await (await amountElement.getProperty('textContent')).jsonValue();
        return new Product(text, price);
    });
    return await Promise.all(productionsPromise);
}

async function purchase(name) {
    let productionsElement = await page.$$(".product.unlocked.enabled");
    let productElement = productionsElement.find(async (element)=>{
        let titleElement = await element.$(".title");
        let text = await (await titleElement.getProperty('textContent')).jsonValue();
        return text.toLocaleLowerCase() === name.toLocaleLowerCase();
    });
    if(productElement) {
        console.log("buy " + name + "!");
        await productElement.click();
    } else {
        console.log("Can't buy");
    }
}

async function close() {
    let saveData = await page.evaluate(()=>{
        Game.WriteSave();
        return localStorage.getItem('CookieClickerGame');
    });
    clearInterval(goldenCoolieListener);
    new SaveData().save(saveData);
    await page.close();
    await browser.close();
}

module.exports = {
    click,
    start,
    clickGolden,
    availableProduction,
    purchase,
    close
};