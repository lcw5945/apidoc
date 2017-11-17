/**
 * Created by Cray on 2017/5/25.
 */

export default {
    route(router, ApiControl) {
        router.get('/getDatabases', ApiControl.getDatabases);
        router.post('/delDatabase', ApiControl.delDatabase);
        router.post('/updateAddDatabase', ApiControl.updateAddDatabase);
    }
};