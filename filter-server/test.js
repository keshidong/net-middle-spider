/*
 * index.js
 *
 * Created by shidong.ke on 3/26/19 2:38 PM.
 * Copyright © 2019 net-middle-spider. All rights reserved.
 *
 */

import Koa from 'koa';
import Router from "koa-router";
import KoaIsBotMiddleware from './koa-isbot-middleware';

const app = new Koa();
const router = new Router();

router.get('*', async (ctx, next) => {
    console.log('isbot: ', ctx.state.isBot);
    next();
});


app.use(KoaIsBotMiddleware());
app.use(router.routes());


app.listen(3000, async (err) => {
    if (err) {
        console.log('error: ', err);
        await browser.close();
        return;
    }
    console.log(`server start at port: 3000`);
});
