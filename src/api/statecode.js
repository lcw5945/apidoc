/**
 * Created by Cray on 2017/7/20.
 */
import * as ajax from '~lib/ajax';

/**
 * params= {projectId}
 */
export const getStateCodes = ajax.fetchJSONGet('/api/getStateCodes');
/**
 * params = {id, projectId}
 */
export const delStateCode = ajax.fetchJSONPost('/api/delStateCode');
/**
 * params = {id, projectId, ...}
 */
export const updateAddStateCode = ajax.fetchJSONPost('/api/updateAddStateCode');