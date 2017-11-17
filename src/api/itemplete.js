/**
 * Created by Cray on 2017/7/20.
 */
import * as ajax from '~lib/ajax';

/**
 * params = {}
 */
export const getITempletes = ajax.fetchJSONGet('/api/getITempletes');
/**
 * params = { id }
 */
export const delITemplete = ajax.fetchJSONPost('/api/delITemplete');
/**
 * params = { id, ...}
 */
export const updateAddITemplete = ajax.fetchJSONPost('/api/updateAddITemplete');