export const AUTH_HOST = (process.env.NODE_ENV === 'production')
    ? "http://auth.hefantv.com"
    : (process.env.NODE_ENV === 'testing')
        ? "http://testerauth.hefantv.com" : "http://devauth.hefantv.com"