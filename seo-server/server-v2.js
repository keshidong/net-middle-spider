/*
 * server-v1.js
 *
 * Created by shidong.ke on 3/27/19 11:14 AM.
 * Copyright © 2019 net-middle-spider. All rights reserved.
 *
 */


import Koa from 'koa';
import Router from 'koa-router';
import optimist from 'optimist';
import compress from 'koa-compress';
import logger from 'koa-logger';
import puppeteer from 'puppeteer';

const { argv } = optimist;
const app = new Koa();
const router = new Router();
const PORT = argv.port ? parseInt(argv.port, 10) : 3010;

const cacheDB = {};
// const requestQueue = [];

let browser;

const DateNowInSecond = () => Math.round((new Date().getTime() / 1000));

(async () => {
    browser = await puppeteer.launch({ headless: true });

    router.get('/clientRenderContent', async (ctx) => {
        const { url, contentPriority = false, cacheExpiredSensitive = false } = ctx.query;

        const [err, res] = await new Promise(async resolve => {
            const cacheContent = cacheDB[url];

            if (cacheContent) {
                const isExpired = cacheContent['expired'] < DateNowInSecond();

                if (!isExpired || (isExpired && !cacheExpiredSensitive)) {
                    resolve([null, {
                        err: 0,
                        message: 'ok',
                        content: cacheContent,
                        expired: isExpired,
                    }]);
                } else {
                    if (!contentPriority) {
                        resolve([{
                            err: 600,
                            message: 'cache expired',
                        }]);
                    }
                }
            } else if (!contentPriority) {
                resolve([{
                    err: 601,
                    message: 'no cache',
                }]);
            }

            // update/write cache
            if (!cacheContent || cacheContent['expired'] < DateNowInSecond()) {
                // todo:page manager
                // todo:queue manager
                const newPage = await browser.newPage();


                const [err, ] = await newPage.goto(url, {
                    waitUntil: 'networkidle2',
                })
                    .then(() => ([null]))
                    .catch((e) => ([{e, message: `puppeteer page goto ${url} error`}]));

                    if (err) {
                        console.log(err.message, err.e);
                        resolve([{
                            err: 400,
                            message: err.message,
                        }]);
                    } else {
                        // todo::test page error
                        // todo::ctx header some as url
                        const htmStr = await newPage.content();

                        // todo:db imp
                        cacheDB[url] = {
                            expired: DateNowInSecond() + 60,
                            content: htmStr,
                        };

                        // resolve result
                        resolve([null, {
                            err: 0,
                            message: 'ok',
                            content: htmStr,
                        }]);

                        console.log('cache log');
                    }

                newPage.close();
            }
        });
        // todo:校验e的来源格式是否符合预期
        err ? ctx.body = err : ctx.body = res;
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
};

Object.keys(NodeProcessClosedStatus).forEach((item) => {
    process.on(item, (err) => {
        console.error(err);
        process.exit(NodeProcessClosedStatus[item]);
    });
});

process.on('exit', exitHandler);
