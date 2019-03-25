const sha1 = require('sha1')
const getRawBody = require('raw-body')
module.exports = (config) => {
    return async (ctx, next) => {
        const {
            signature,
            timestamp,
            nonce,
            echostr
        } = ctx.query

        const token = config.token

        let str = [token, timestamp, nonce].sort().join('')
        const sha = sha1(str)

        // get 认证 post 推送消息
        if (ctx.method === 'GET') {
            if (sha === signature) {
                ctx.body = echostr
            } else {
                ctx.body = 'failed'
            }
        } else if (ctx.method==='POST') {
            if (sha !== signature) {
                return (ctx.body='failed')
            }

            const data = await getRawBody(ctx.req,{
                length:ctx.length,
                limit:'1mb',
                encoding:ctx.charset
            })

            const content = await parseXML(data)
            ctx.status = 200
            ctx.type='application/xml'
            ctx.body = `
            <xml>
                <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                <CreateTime>${parseInt(new Date().getTime()/1000) + ''}</CreateTime>
                <MsgType><![CDATA[text]]></MsgType>
                <Content><![CDATA[${message.content}]]></Content>
                <MsgId>1234567890123456</MsgId>
            </xml>
            `


        }
    }
}