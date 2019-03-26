/*
 * koa-isbot-middleware.js
 *
 * Created by shidong.ke on 3/26/19 12:12 PM.
 * Copyright © 2019 net-middle-spider. All rights reserved.
 *
 */

import isbot from 'isbot'

export default () => {
    return async function (ctx, next) {
        const source = ctx.request.headers['user-agent'] || '';
        ctx.state.isBot = isbot(source);
        next();
    }
}
