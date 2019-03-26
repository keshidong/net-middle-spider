/*
 * simulate-spa-server.js
 *
 * Created by shidong.ke on 3/26/19 4:26 PM.
 * Copyright © 2019 net-middle-spider. All rights reserved.
 *
 */

import Koa from 'koa';
import Router from 'koa-router';
import optimist from 'optimist';
import compress from 'koa-compress';
import logger from 'koa-logger';

const { argv } = optimist;
const app = new Koa();
const router = new Router();
const PORT = argv.port ? parseInt(argv.port, 10) : 3001;

(async () => {
    router.get('*', async (ctx) => {
        console.info(ctx.request.headers);
        ctx.body = {
            testData: 'hello world!'
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

})().catch((e) => {
    console.log(e);

});
