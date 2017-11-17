/**
 * Created by Cray on 2017/5/25.
 */

export default {
    route(router, ApiControl) {
        router.get('/getTestEnvs', ApiControl.getTestEnvs);
        router.post('/delTestEnv', ApiControl.delTestEnv);
        router.post('/updateAddTestEnv', ApiControl.updateAddTestEnv);
    }
};