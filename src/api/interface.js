/**
 * Created by Cray on 2017/7/20.
 */
import * as ajax from '~lib/ajax';


export const getInterfaces = ajax.fetchJSONGet('/api/getInterfaces');
/**
 * params = {id, projectId}
 */
export const delInterfaces = ajax.fetchJSONPost('/api/delInterfaces');
/**
 * params = {id, projectId, ...}
 */
export const updateAddInterfaces = ajax.fetchJSONPost('/api/updateAddInterfaces');