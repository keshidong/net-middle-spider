import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();
await page.goto('https://www.youku.com');
await page.screenshot({path: 'example.png'});

await browser.close();
})();
