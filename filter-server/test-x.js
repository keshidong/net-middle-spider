/*
 * test-x.js
 *
 * Created by shidong.ke on 3/26/19 4:56 PM.
 * Copyright © 2019 net-middle-spider. All rights reserved.
 *
 */

const Koa = require('koa');
const Router = require('koa-router');
const proxy = require('koa2-proxy-middleware');
const httpProxy = require('http-proxy-middleware');
const k2c = require('koa2-connect');

const app = new Koa();
const router = new Router();

router.get('*', async (ctx, next) => {
    console.log('isbot: ');
    next();
});

const options = {
    targets: {
        '/user': {
            // this is option of http-proxy-middleware
            target: 'http://localhost:3001', // target host
            changeOrigin: true, // needed for virtual hosted sites
        },
        '/user/:id': {
            target: 'http://localhost:3001',
            changeOrigin: true,
        },
        // (.*) means anything
        '/api/(.*)': {
            target: 'http://10.94.123.123:1234',
            changeOrigin: true,
            pathRewrite: {
                '/passager/xx': '/mPassenger/ee', // rewrite path
            }
        },
    }
}

app.use((ctx, next) => {
    k2c(httpProxy({
        target: 'http://127.0.0.1:3001'
    }))(ctx, next);
});

app.listen(3005);
