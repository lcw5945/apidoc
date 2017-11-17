/**
 * Created by Cray on 2017/8/1.
 */
export default {
    route(router, ApiControl) {
        router.get('/getGroups', ApiControl.getGroups);
        router.post('/delGroup', ApiControl.delGroup);
        router.post('/updateAddGroup', ApiControl.updateAddGroup);
    }
};