const Koa = require('koa')
const path = require('path')
const moment = require('moment')
const wechat = require('./wechat-lib/middleware')
const config = require('./config/config')
const Router = require('koa-router');
const {
    reply
} = require('./wechat/reply')
const {
    initSchema,
    connect
} = require('./app/database/init')




;(async () => {
    await connect(config.db)
    initSchema()
    //测试token的数据库存储

    // const {
    //     test
    // } = require('./wechat/index')

    // await test()
    const app = new Koa()
    const router = new Router();

    const views = require('koa-views')
    app.use(views(path.resolve(__dirname + '/app/views'),{
        extension: 'pug',
        options:{
            moment: moment
        }
    }))


    //加载认证的中间键
    //ctx 是koa的应用上下文
    // next 串联中间键的钩子函数
    // app.use(wechat(config.wechat, reply))

   //接入微信消息中间件
    // ctx是koa的应用上下文
    // next就是串联中间件的钩子函数
    require('./config/routes')(router);
    // app.use(wechat(config, reply));

    // 让路由中间件生效
    app.use(router.routes()).use(router.allowedMethods());
    app.listen(3008)
    console.log('Listen:' + 3008)
})()