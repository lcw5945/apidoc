/**
 * Created by Cray on 2017/5/25.
 */

export default {
    route(router, ApiControl) {
        router.get('/getInterfaces', ApiControl.getInterfaces);
        router.post('/delInterfaces', ApiControl.delInterfaces);
        router.post('/updateAddInterfaces', ApiControl.updateAddInterfaces);
    }
};