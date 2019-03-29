/*
 * server-v1.js
 *
 * Created by shidong.ke on 3/20/19 6:09 PM.
 * Copyright © 2019 net-middle-spider. All rights reserved.
 *
 */


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

let browser;
(async () => {
    browser = await puppeteer.launch({ headless: false });

    router.get('/asyncRenderHtml', async (ctx) => {
        const { url } = ctx.query;

        const newPage = await browser.newPage();

        await newPage.goto(url, {
            waitUntil: 'networkidle2',
        })
            .catch((e) => {
                console.log(e);
                ctx.throw(400, 'params url cannot be accessed');
            });

        // todo::test page error
        // todo::ctx header some as url
        const htmStr = await newPage.content();
        newPage.close();

        ctx.set('Content-Type', 'text/html; charset=utf-8');

        ctx.body = htmStr;
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

})().catch((e) => {
    console.log(e);

});


const NodeProcessClosedStatus = Object.freeze({
    uncaughtException: 1,
    SIGINT: 2,
    SIGUSR1: 3,
    SIGUSR2: 4,
});

process.stdin.resume();

const exitHandler = (code) => {
    console.log('close process', code);
    if (browser) {
        browser.close();
    }
}

Object.keys(NodeProcessClosedStatus).forEach((item) => {
    process.on(item, () => {
        process.exit(NodeProcessClosedStatus[item]);
    });
});

process.on('exit', exitHandler)
