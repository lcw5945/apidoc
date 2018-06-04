/**
 * Created by Cray on 2017/7/19.
 */
import { catchError, catchAction } from '../common/http';

export const createAsynAction = (api, requestAction, receiveAction) => (params, resolve, reject) =>
    (dispatch) => {
        requestAction && dispatch(requestAction({ req: params }));
        api(params)
            .then(function (data) {
                receiveAction && dispatch(receiveAction({ req: params, res: data, receivedAt: Date.now() }));
                resolve && resolve(data);
                catchAction(receiveAction, data);
            }, function (error) {
                reject && reject(error);
                catchError(error);
            })
    }





