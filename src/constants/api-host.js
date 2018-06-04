/**
 * Created by Cray on 2017/7/20.
 */


export const API_HOST = (process.env.NODE_ENV === 'production')
    ? ('http://apidoc.hefantv.com')
    : (process.env.NODE_ENV === 'testing') ? 'http://testapidoc.hefantv.com' :  'http://localhost.hefantv.com:9013';

export const H5API_HOST = (process.env.NODE_ENV === 'production')
    ?  'http://h5api.hefantv.com'
    : (process.env.NODE_ENV === 'testing') ? 'http://testh5api.hefantv.com' : 'http://testh5api.hefantv.com';