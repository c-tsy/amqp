import * as amqp from 'amqplib'
import * as url from 'url'
import * as q from 'querystring'
import { ConsumeMessage, Options } from 'amqplib';
// import stomp from 'stompjs'

namespace AMQP {

    const amqps: {
        [index: string]: {
            conn: amqp.Connection,
            channel: amqp.Channel
        }
    } = {}
    /**
     * 获得amqp链接地址
     * @param uri 
     */
    export async function get_amqp(uri: string): Promise<amqp.Channel> {
        if (!amqps[uri]) {
            try {
                let conn = await amqp.connect(uri);
                amqps[uri] = {
                    conn,
                    channel: await conn.createChannel()
                }
            } catch (error) {
                console.error(error)
            }
        }
        return amqps[uri].channel;
    }
    /**
     * 消费
     * @param uri 
     * @param cb 
     * @param options 
     */
    export async function consume(uri: string, cb: (msg: ConsumeMessage | null) => void, options?: Options.Consume) {
        let u = url.parse(uri)
        let n = q.parse(u.query)
        //@ts-ignore
        channel = n.channel;
        uri = u.protocol + '//' + u.auth + '@' + u.host + u.pathname
        let chan = await get_amqp(uri)
        //@ts-ignore
        chan.consume(channel, cb, options)
    }
    /**
     * 发送amqp消息
     * @param uri 
     * @param channel 
     * @param data 
     */
    export async function send_amqp(uri: string, channel: string, data: any, ctx?: any) {
        if (!channel) {
            let u = url.parse(uri)
            let n = q.parse(u.query)
            //@ts-ignore
            channel = n.channel;
            uri = u.protocol + '//' + u.auth + '@' + u.host + u.pathname
        }
        let chan = await get_amqp(uri)
        try {
            // console.log(uri, channel, data)
            return await chan.sendToQueue(channel, Buffer.from('object' == typeof data ? JSON.stringify(data) : data));
        } catch (error) {
            debugger
        }
    }
}

export default AMQP;