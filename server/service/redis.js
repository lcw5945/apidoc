import Redis from "ioredis"
import config from '../conf/web'

const conf = process.env.NODE_ENV == "development" ? config.redis.TEST :
    (process.env.NODE_ENV == 'testing' ? config.redis.TEST : config.redis.PRO);

let redis = null
if (!redis) {
    redis = new Redis(
        {
            port: conf.port,          // Redis port
            host: conf.host,   // Redis host
            family: 4,           // 4 (IPv4) or 6 (IPv6)
            password: conf.password,
            db: 0
          }
    )
}

export default {
    async get(key) {
        let data = await redis.get(`APIDOC_S:${key}`);
        try {
            data = JSON.parse(data)
        } catch (e) {
            data = null
        }      
        return Promise.resolve(data)
    },

    async set(key, value) {
        let res = null
        try {
            res = await redis.set(`APIDOC_S:${key}`, JSON.stringify(value))
        } catch (e) {
            res = null
        }

        return Promise.resolve(res)
    },

    async setex(key, number, value) {
        let res = null
        try {
            res = await redis.setex(`APIDOC_S:${key}`, number, JSON.stringify(value))
        } catch (e) {
            res = null
        }

        return Promise.resolve(res)
    },

    async destroy(key, ctx) {
        await redis.del(`APIDOC_S:${key}`)
        return Promise.resolve(key)
    }
}