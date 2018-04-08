import Koa from 'koa';
import Router from 'koa-router';
import optimist from 'optimist';
import compress from 'koa-compress';
import logger from 'koa-logger';
import puppeteer from "puppeteer";

const { argv } = optimist;
const app = new Koa();
const router = new Router();
const PORT = argv.port ? parseInt(argv.port, 10) : 3000;

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    router.get('/api/html', async (ctx) => {
        const { url } = ctx.query;
        await page.goto(url, {
            waitUntil: 'networkidle2',
        });
        const htmStr = await page.content();
        ctx.body = {
            html: htmStr,
        };
    });

    app.use(compress());
    app.use(logger());
    app.use(router.routes());

    app.listen(PORT, async (err) => {
        if (err) {
            console.log('error: ', err);
            await browser.close();
            return;
        }
        console.log(`server start at port: ${PORT}`);
    });
    await page.screenshot({path: 'example.png'});

})().catch(() => {});


