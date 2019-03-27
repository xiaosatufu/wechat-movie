const {
    resolve
} = require('path')
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
            let tempTicketData = await client.handle('createQrcode', tempQrData)
            console.log(tempTicketData)
            let tempQr = client.showQrcode(tempTicketData.ticket)
            console.log(tempQr)
            reply = tempQr
        } else if (content === '16') {
            const longurl = 'https://github.com/xiaosatufu?tab=stars'
            let shortData = await client.handle('createShortUrl', 'long2short', longurl)
            console.log(shortData)
            reply = shortData.short_url
        } else if (content === '17') {
            let semanticData = {
                query: '查一下明天从杭州到北京的南航机票',
                city: '杭州',
                category: 'flight,hotel',
                uid: message.FromUserName
            }
            let searchData = await client.handle('semantic', semanticData)

            console.log(searchData)

            reply = JSON.stringify(searchData)
        } else if (content === '18') {
            try {
                let deleteData = await client.handle('deleteMenu')
                console.log(deleteData)
                let menu = {
                    button: [{
                        name:'一级菜单',
                        sub_button:[
                            {
                                name:'二级菜单1',
                                type:'click',
                                key:'no_1'
                            },
                            {
                                name:'二级菜单2',
                                type:'click',
                                key:'no_2'
                            },
                            {
                                name:'二级菜单3',
                                type:'click',
                                key:'no_3'
                            }
                        ]
                    },
                        {
                            name:'分类',
                            type:"view",
                            url:'http://www.baidu.com'
                        },
                        {
                            name:'新菜单_'+Math.random(),
                            type:'click',
                            key:'new_111'
                        }
                    ]
                }
                let createData = await client.handle('createMenu', menu)
                console.log(createData)
            } catch (e) {
                console.log(e)
            }
            reply = '菜单创建成功'
        }
        ctx.body = reply
    }
    await next()
}


module.exports = {
    reply
}