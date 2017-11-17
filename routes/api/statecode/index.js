/**
 * Created by Cray on 2017/5/25.
 */

export default {
    route(router, ApiControl) {
        router.get('/getStateCodes', ApiControl.getStateCodes);
        router.post('/delStateCode', ApiControl.delStateCode);
        router.post('/updateAddStateCode', ApiControl.updateAddStateCode);
    }
};