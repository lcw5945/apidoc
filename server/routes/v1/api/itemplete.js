import Params from '../../../utils/params'
import Serrors from '../../../utils/serror'
import _ from "lodash"
import ItempleteCtrl from '../../../controls/api/itemplete'
import InterfacesCtrl from "../../../controls/api/inerface";


export default {
    route(router){
        router.get('/getITempletes', async(req, res) => {
            let params = Params.queryValidate(req, res) || {}, resJson
            resJson = await ItempleteCtrl.getITempletes(params.projectId)
            res.json(resJson)
        })


        // 删除
        router.post('/delITemplete', async(req, res) => {
            let params = Params.bodyValidate(req, res) || {}, resJson

            if (_.isPlainObject(params) && Params.isObejctId(params.id)) {
                resJson = await ItempleteCtrl.delITemplete(params.id)
            } else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })


        // 修改 新增
        router.post('/updateAddITemplete', async(req, res) => {
            let params = Params.bodyValidate(req, res) || {}, resJson

            if (_.isPlainObject(params)) {
                delete params.token;
                resJson = await ItempleteCtrl.updateAddITemplete(params)
            } else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })

    }


}




