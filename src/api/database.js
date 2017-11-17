/**
 * Created by Cray on 2017/7/20.
 */
import * as ajax from '~lib/ajax';


/**
 * params= {}
 */
export const getDatabases = ajax.fetchJSONGet('/api/getDatabases');
/**
 * params= {id}
 */
export const delDatabase = ajax.fetchJSONPost('/api/delDatabase');
/**
 * params= {id ...}
 */
export const updateAddDatabase = ajax.fetchJSONPost('/api/updateAddDatabase');