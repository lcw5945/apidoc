/**
 * Created by Cray on 2017/4/17.
 */
import _ from 'lodash'
import Log from 'hefan-debug-log-s'
import wss from '../lib/ws-server'

export default {
    resolve(action, params, data) {
        let sendData = {
            'action': action,
            'params': params,
            'data': Object.assign({}, data)
        }
        _send(sendData)
    }
}
/**
 * 发送数据
 * @param sendData
 * @private
 */
function _send(sendData) {
    sendData = JSON.stringify(sendData)
    Log.log(`socket send data ${sendData}`)
    wss.clients.forEach((client) => {
        client.send(sendData)
    })
}