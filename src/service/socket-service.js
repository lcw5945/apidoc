import ActionType from '../constants/action-type'
import { recevieDelProject, updateAddProject, addCooper, delCooper } from '../actions/project'
import { delInterface, updateAddInterface} from '../actions/interface'
import { recevieDelGroup, updateAddGroup} from '../actions/group'
import { delStateCode, updateAddStateCode} from '../actions/statecode'

export default (store) => {
    let socHost = process.env.NODE_ENV == 'development' ?
        'ws://localhost.hefantv.com:9014' : (process.env.NODE_ENV == 'testing' ? 'ws://10.45.138.16:9014'
         : 'ws://47.93.89.11:9014')
        
    let ws = new WebSocket(socHost)
    // 打开Socket
    ws.onopen = function (e) {
        Log.log(`Connection to server opened ws is ${socHost}`)
    }

    // 监听消息
    ws.onmessage = function (event) {
        let data = JSON.parse(event.data)
        let value = { req: data.params, res: data.data, receivedAt: Date.now() }
        console.log('socket receive data', value)
        let actionObj = null
        switch(data.action){
            case ActionType.PJ_RC_DEL : 
            {
                actionObj = recevieDelProject(value)
                break
            }
            case ActionType.PJ_UPDATE_ADD : 
            {
                actionObj = updateAddProject(value)
                break
            }
            case ActionType.PJ_ADD_COOPER : 
            {
                actionObj = addCooper(value)
                break
            }
            case ActionType.PJ_DEL_COOPER : 
            {
                actionObj = delCooper(value)
                break
            }
            case ActionType.IF_DEL : 
            {
                actionObj = delInterface(value)
                break
            }
            case ActionType.IF_UPDATE_ADD : 
            {
                actionObj = updateAddInterface(value)
                break
            }
            case ActionType.GROUP_RC_DEL : 
            {
                actionObj = recevieDelGroup(value)
                break
            }
            case ActionType.GROUP_UPDATE_ADD : 
            {
                actionObj = updateAddGroup(value)
                break
            }
            case ActionType.SC_DEL : 
            {
                actionObj = delStateCode(value)
                break
            }
            case ActionType.SC_UPDATE_ADD : 
            {
                actionObj = updateAddStateCode(value)
                break
            }
            default:{
                break
            }
        }
        if(actionObj){store.dispatch(actionObj)}
    }
    // 监听Socket的关闭
    ws.onclose = function (event) {
        Log.warn('Client notified socket has closed', event)
    }

    //错误监听
    ws.onerror = function (event) {
        console.log('socket error', event)
    };
}
