export const AUTH_DOMAIN =
  process.env.NODE_ENV === "production"
    ? "http://auth.hefantv.com/passport/login.do"
    : process.env.NODE_ENV === "testing"
      ? "http://testerauth.hefantv.com/passport/login.do"
      : "http://devauth.hefantv.com/passport/login.do";
