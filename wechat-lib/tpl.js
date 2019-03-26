const ejs = require('ejs')
const tpl = `
<xml>
    <ToUserName><![CDATA[<%= toUserName %>]]></ToUserName>
    <FromUserName><![CDATA[<%= fromUserName %>]]></FromUserName>
    <CreateTime><%= createTime %></CreateTime>
    <MsgType><![CDATA[text]]></MsgType>
    <Content><![CDATA[<%- content %>]]></Content>

    <MsgId><%= msgId %></MsgId>
</xml>`


const compiled = ejs.compile(tpl)


module.exports = compiled