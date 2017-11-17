/**
 * Created by Cray on 2017/8/1.
 */
import * as ajax from '~lib/ajax';


/**
 * params= {}
 */
export const getGroups = ajax.fetchJSONGet('/api/getGroups');
/**
 * params= { id, databaseId, projectId, ... }
 */
export const delGroup = ajax.fetchJSONPost('/api/delGroup');
/**
 * params= { id, databaseId, projectId, ... }
 */
export const updateAddGroup = ajax.fetchJSONPost('/api/updateAddGroup');