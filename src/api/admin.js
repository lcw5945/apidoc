/**
 * Created by Cray on 2017/7/20.
 */
import * as ajax from '~lib/ajax';

export const getAdmins = ajax.fetchJSONGet('/api/getAdmins');
export const delAdmin = ajax.fetchJSONPost('/api/delAdmin');
export const register = ajax.fetchJSONPost('/api/register');
export const updateSuperAdmin = ajax.fetchJSONPost('/api/updateSuperAdmin');
export const updateAddAdmin = ajax.fetchJSONPost('/api/updateAddAdmin');