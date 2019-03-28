const request = require('request-promise')
const base = 'https://api.weixin.qq.com/cgi-bin/'
const mpBase = 'https://mp.weixin.qq.com/cgi-bin/'
const semanticUrl = 'https://api.weixin.qq.com/semantic/semproxy/search?'

const api = {
    semanticUrl,
    accessToken: base + 'token?grant_type=client_credential',
    qrcode: {
        create: base + 'qrcode/create?',
        show: mpBase + 'showqrcode?'
    },
    shortUrl: {
        create: base + 'shorturl?'
    },
    menu: {
        create: base + 'menu/create?',
        delete: base + 'menu/delete?'
    },
    ticket: {
        get: base + 'ticket/getticket?'
    }
}
module.exports = class Wechat {
    constructor(opts) {
        this.opts = Object.assign({}, opts)
        this.appID = opts.appID
        this.appsecret = opts.appsecret
        this.getAccessToken = opts.getAccessToken
        this.saveAccessToken = opts.saveAccessToken
        this.getTicket = opts.getTicket
        this.saveTicket = opts.saveTicket

        this.fetchAccessToken()
    }
    async request(options) {
        options = Object.assign({}, options, {
            json: true
        })
        try {
            const res = await request(options)
            return res
        } catch (err) {
            console.log(err)
        }
    }

    async fetchAccessToken() {
        let data = await this.getAccessToken()
        // console.log(data)
        // if(this.getAccessToken){
        //     // console.log(1)
        //     data = await this.getAccessToken()
        // }
        if (!this.isValid(data)) {
            data = await this.updateAccessToken()
        }
        await this.saveAccessToken(data)
        return data
    }

    async updateAccessToken() {
        const url = `${api.accessToken}&appid=${this.appID}&secret=${this.appsecret}`
        const data = await this.request({
            url
        })
        // console.log(data)
        const now = new Date().getTime()
        const expiresIn = now + (data.expires_in - 20) * 1000

        data.expires_in = expiresIn
        // console.log(data)
        return data

    }

    async fetchTicket(token) {
        let data = await this.getTicket()
        if (!this.isValid(data, 'ticket')) {
            data = await this.updateTicket(token)

        }
        await this.saveTicket(data)
        return data
    }




    async updateTicket(token) {
        const url = `${api.ticket.get}access_token=${token}&type=jsapi`

        const data = await this.request({
            url
        })
        const now = new Date().getTime()
        const expiresIn = now + (data.expires_in - 20) * 1000

        data.expires_in = expiresIn

        return data
    }




    isValid(data) {
        if (!data || !data.expires_in) {
            return false
        }
        const expiresIn = data.expires_in
        const now = new Date().getTime()

        if (now < expiresIn) {
            return true
        } else {
            return false
        }
    }


    async handle(operation, ...args) {
        const tokenData = await this.fetchAccessToken()
        const options = this[operation](tokenData.token, ...args)
        console.log(options)
        const data = await this.request(options)
        return data
    }

    //创建二维码ticket
    createQrcode(token, qr) {
        const url = api.qrcode.create + 'access_token=' + token
        const body = qr
        return {
            method: 'POST',
            url,
            body
        }

    }
    //通过ticket 换取二维码
    showQrcode(ticket) {
        const url = api.qrcode.show + 'ticket=' + encodeURI(ticket)
        return url

    }
    //长链接转短链接
    createShortUrl(token, action = 'long2short', longurl) {
        const url = api.shortUrl.create + 'access_token=' + token
        const body = {
            action,
            long_url: longurl
        }
        return {
            method: 'POST',
            url,
            body
        }

    }

    //查询特定的语句进行分析
    semantic(token, semanticData) {
        const url = api.semanticUrl + 'access_token=' + token
        console.log(url)
        semanticData.appID = this.appID
        return {
            method: 'POST',
            url,
            body: semanticData
        }

    }
    //menu
    createMenu(token, menu) {
        const url = api.menu.create + 'access_token=' + token
        return {
            method: 'POST',
            url,
            body: menu
        }
    }
    //menu
    deleteMenu(token) {
        const url = api.menu.delete + 'access_token=' + token
        return {
            url
        }
    }

}

// test git