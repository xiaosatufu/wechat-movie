exports.reply = async (ctx, next) => {
    const message = ctx.weixin
    if (message.MsgType === 'text') {
        let content = message.Content
        let reply = '你说的' + content + '太复杂了无法解析'
        if (content === '1') {
            reply = '1jjj'
        } else if (content === '2') {
            reply = '2fff'
        } else if (content === '3') {
            reply = '3ddd'
        } else if (content === 'imooc') {
            reply = 'lll'
        }
        ctx.body = reply
    }
    await next()
}