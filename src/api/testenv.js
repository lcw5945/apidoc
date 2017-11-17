/**
 * Created by Cray on 2017/7/20.
 */
import * as ajax from '~lib/ajax';

/**
 * params = {}
 */
export const getTestEnvs = ajax.fetchJSONGet('/api/getTestEnvs');
/**
 * params = { id }
 */
export const delTestEnv = ajax.fetchJSONPost('/api/delTestEnv');
/**
 * params = { id, ...}
 */
export const updateAddTestEnv = ajax.fetchJSONPost('/api/updateAddTestEnv');