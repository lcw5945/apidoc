/**
 * Created by Cray on 2017/5/25.
 */

export default {
    route(router, ApiControl) {
        router.get('/getITempletes', ApiControl.getITempletes);
        router.post('/delITemplete', ApiControl.delITemplete);
        router.post('/updateAddITemplete', ApiControl.updateAddITemplete);
    }
};