/**
 * Created by Cray on 2017/7/20.
 */
export const API_HOST = (process.env.NODE_ENV === 'production')
    ? 'http://apidoc.hefantv.com'
    : (process.env.NODE_ENV === 'testing') ? 'http://testapidoc.hefantv.com' : 'http://localhost:9013';