const Koa = require('koa')
const wechat = require('./wechat-lib/middleware')
const config = require('./config/config')
const {
    reply
} = require('./wechat/reply')
const {
    initSchema,
    connect
} = require('./app/database/init')




;
(async () => {
    await connect(config.db)
    initSchema()
    //测试token的数据库存储

    const {
        test
    } = require('./wechat/index')

    await test()
    const app = new Koa()
    //加载认证的中间键
    //ctx 是koa的应用上下文
    // next 串联中间键的钩子函数
    app.use(wechat(config.wechat, reply))


    app.listen(3008)
    console.log('Listen:' + 3008)
})()