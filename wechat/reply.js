const {resolve}  = require('path')
let reply = async (ctx, next) => {
    const message = ctx.weixin
    let mp = require('./index')
    let client = mp.getWechat()
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
        } else if (content === '15') {
            let tempQrData = {
                expire_seconds: 40000,
                action_name: "QR_SCENE",
                action_info: {
                    scene: {
                        scene_id: 101
                    }
                }
            }
            let tempTicketData = await client.handle('createQrcode',tempQrData)
            console.log(tempTicketData)
            let tempQr =  client.showQrcode(tempTicketData.ticket)
            console.log(tempQr)
            reply = tempQr
        } else if (content ==='16') {
            const longurl = 'https://github.com/xiaosatufu?tab=stars'
            let shortData = await client.handle('createShortUrl','long2short',longurl)
            console.log(shortData)
            reply = shortData.short_url
        }
        ctx.body = reply
    }
    await next()
}


module.exports = {
    reply
}