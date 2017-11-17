/**
 * Created by lichunwei on 2017/7/19.
 */
import * as ajax from '~lib/ajax';

/**
 * params= {projectId}
 */
export const getProjects = ajax.fetchJSONGet('/api/getProjects');
/**
 * params= {id}
 */
export const delProject = ajax.fetchJSONPost('/api/delProject');
/**
 * params= {id ...}
 */
export const updateAddProject = ajax.fetchJSONPost('/api/updateAddProject');


/**
 * params= {projectId, useId,  ...}
 */
export const addCooper = ajax.fetchJSONPost('/api/addCooper');
/**
 * params= {projectId, useId,  ...}
 */
export const delCooper = ajax.fetchJSONPost('/api/delCooper');

/**
 * params= {projects,  ...}
 */
export const importPjFromApiView = ajax.fetchJSONPost('/api/importPjFromApiView');

/**
 * params= {password, email,  ...}
 */
export const getPjFromApiView = ajax.fetchJSONPost('/api/getPjFromApiView');
