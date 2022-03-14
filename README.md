
```typescript
import AMQP from "@ctsy/amqp"

//发送到队列
AMQP.send_amqp("amqp://username:password@host:port/vhost?channel=channelname", '', { Data:1})
AMQP.send_amqp("amqp://username:password@host:port/vhost", 'channelname', { Data:1})
//消费队列
AMQP.consume("amqp://username:password@host:port/vhost?channel=channelname",(msg,chan)=>{
    console.log(msg.toString())
    chan.ack(msg)
},{})

```