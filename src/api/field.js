/**
 * Created by Cray on 2017/7/28.
 */
import * as ajax from '~lib/ajax';

/**
 * params = {}
 */
export const getFields = ajax.fetchJSONGet('/api/getFields');
/**
 * params = {id, databaseId}
 */
export const delField = ajax.fetchJSONPost('/api/delField');
/**
 * params = {id, databaseId, ...}
 */
export const updateAddField = ajax.fetchJSONPost('/api/updateAddField');