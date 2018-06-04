/**
 * Created by Cray on 2017/7/20.
 */

export const API_HOST =
  process.env.NODE_ENV === "production"
    ? "http://39.106.118.58:9013"
    : process.env.NODE_ENV === "testing"
      ? "http://39.106.118.58:9013"
      : "http://localhost:9013";

// export const H5API_HOST =
//   process.env.NODE_ENV === "production"
//     ? "http://h5api.hefantv.com"
//     : process.env.NODE_ENV === "testing"
//       ? "http://testh5api.hefantv.com"
//       : "http://testh5api.hefantv.com";
