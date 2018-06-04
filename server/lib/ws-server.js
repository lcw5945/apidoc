/**
 * Created by Cray on 2017/4/17.
 */

// var url = require('url')
import config from '../conf/web'

const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({port: config.socket.port})

wss.on('connection', function (ws) {
  ws.on('message', function (data) {
    console.log('received: %s', data)
  })
  ws.on('error', function (event) {
    console.error('received: %s', event)
  })
})

export default wss
