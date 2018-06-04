
export default {
    db: {
        //mongodb 配置
        DB_DEV: {
            url: 'mongodb://admin:hefan.123@10.26.240.153:28017/apidoc-dev',
            options: {
            }
        },
        DB_TEST: {
            url: 'mongodb://admin:hefan.123@10.26.240.153:28017/apidoc-test',
            options: {
            }
        },
        DB_PRO: {
            url: 'mongodb://admin:hefantv.123@47.93.89.11:28017/apidoc',
            options: {
            }
        }
    },
    server: {
        port: 9013,
        host: "127.0.0.1",
    },
    socket: {
        port: 9014
    },
    redis: {
        TEST: {
            port: 6379,
            password: "3ARmCPD1HM48",
            host: '10.51.121.143'
        },
        PRO: {
            port: 6379,
            password: "3ARmCPD1HM48",
            host: '10.27.82.5'
        }
    }
};

