/**
 * Created by Cray on 2017/5/25.
 */

export default {
    route(router, ApiControl) {
        router.get('/getFields', ApiControl.getFields);
        router.post('/delField', ApiControl.delField);
        router.post('/updateAddField', ApiControl.updateAddField);
    }
};