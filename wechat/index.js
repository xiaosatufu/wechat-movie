// console.log(1)
const Wechat = require('../wechat-lib/index')
const WechatOAuth = require('../wechat-lib/oauth')
const config = require('../config/config')
const mongoose = require('mongoose')
const Token = mongoose.model('Token')

const Ticket = mongoose.model('Ticket');
const wechatCfg = {
    wechat: {
        appID: config.wechat.appID,
        appsecret: config.wechat.appsecret,
        token: config.wechat.token,
        getAccessToken: async () => {
            const res = await Token.getAccessToken()
            return res
        },
        saveAccessToken: async (data) => {
            // console.log(data)
            const res = await Token.saveAccessToken(data)
            return res

        },

        getTicket: async () => {
            const res = await Ticket.getTicket()

            return res
        },
        saveTicket: async (data) => {
            const res = await Ticket.saveTicket(data)

            return res
        }
    }
}

// console.log(2)
exports.test = async () => {
    // console.log(3)
    const client = new Wechat(wechatCfg.wechat)
    // console.log(client)
    const data = await client.fetchAccessToken()
    console.log('data in db')
    // console.log(data)
}

exports.getWechat = () => {
    return new Wechat(wechatCfg.wechat)
}
exports.getOAuth = () => {
    return new WechatOAuth(wechatCfg.wechat);
}