/**
 * Created by Cray on 2017/7/20.
 */
import * as ajax from '~lib/ajax';

export const getRegistUsers = ajax.fetchJSONGet('/api/getRegistUsers');
export const delRegistUser = ajax.fetchJSONPost('/api/delRegistUser');
export const searchRegistUsers = ajax.fetchJSONGet('/api/searchRegistUsers');

/**
 * params= {userId, ...'}
 */
export const resetRegistUser = ajax.fetchJSONPost('/api/resetRegistUser');
/**
 * params= {password, ...'}
 */
export const updateUser = ajax.fetchJSONPost('/api/updateUser');
export const register = ajax.fetchJSONPost('/api/register');
export const login = ajax.fetchJSONPost('/api/login');
export const logout = ajax.fetchJSONPost('/api/logout');
/**
 * params= {ids:'id1,id2,id3, ...'}
 */
export const getMulUser = ajax.fetchJSONGet('/api/getMulUser');