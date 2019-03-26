/*
 * filter-server-v1.js
 *
 * Created by shidong.ke on 3/22/19 3:53 PM.
 * Copyright © 2019 net-middle-spider. All rights reserved.
 *
 */

import Koa from 'koa';
import Router from 'koa-router';
import optimist from 'optimist';
import compress from 'koa-compress';
import logger from 'koa-logger';
import isbot from './koa-isbot-middleware';
import httpProxy from 'http-proxy-middleware';
const k2c = require('koa2-connect');

import request from 'request-promise';

const { argv } = optimist;
const app = new Koa();
const router = new Router();

const PORT = argv.port ? parseInt(argv.port, 10) : 3000;

(async () => {
    router.get('*', async (ctx, next) => {
        if (isbot(ua)) {
            // 请求seo server
            // 去除用户相关的header内容

        } else {
            // 通知seo server更新cache

            // 中转请求，包括其他的header头部数据
            // nginx是如何做到的
            // 反向proxy??


        }

       const body = await request({

            url: 'https://www.google.com/',
            method: ctx.method,
            header: ctx.header,
            body: ctx.body,
        });

       // todo:how to response all header meta
        // no user info in header such as cookie
        //
        ctx.set('Content-Type', 'text/html');

        // 用户相关，比如不同ip下返回不同的数据
        ctx.response.body = body;
    });

    app.use(isbot());
    app.use(compress());
    app.use(logger());

    app.use((ctx, next) => {
        // todo: config

        debugger
        if (ctx.state.isBot) {
            // todo:request from seo server

        } else {
            if (ctx.req.method === 'GET') {
                // 通知seo server
            }

            // todo:test proxy header and cookie
            // proxy server
            const target = 'http://127.0.0.1:3001';
            k2c(httpProxy({
                target,
            }))(ctx, next);

            // ctx.respond = false;
            //
            // console.info(`- proxy - ${ctx.req.method} ${target}${ctx.req.url}`);
            // return new Promise(resolve => {
            //     proxyServer.web(ctx.req, ctx.res, {
            //         target,
            //     }, e => {
            //         const status = {
            //             ECONNRESET: 502,
            //             ECONNREFUSED: 503,
            //             ETIMEOUT: 504,
            //         }[ e.code ];
            //         debugger
            //         if (status) ctx.status = status;
            //         console.error(`- proxy - ${ctx.status} ${ctx.req.method} ${target}${ctx.req.url}`);
            //         resolve();
            //     });
            // });
        }

    });

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
}

Object.keys(NodeProcessClosedStatus).forEach((item) => {
    process.on(item, () => {
        process.exit(NodeProcessClosedStatus[item]);
    });
});

process.on('exit', exitHandler)
