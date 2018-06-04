import Redis from "ioredis"
import Store from "../lib/session"
import config from '../conf/web'

const conf = process.env.NODE_ENV == "development" ? config.redis.TEST :
        (process.env.NODE_ENV == 'testing' ? config.redis.TEST : config.redis.PRO);
const redis = new Redis(conf.port, conf.host);

class RedisStore extends Store {
    constructor() {
        super();
        this.redis = new Redis(6379, '10.51.121.143');
    }

    async get(sid, ctx) {
        let data = await this.redis.get(`SESSION:${sid}`);
        return JSON.parse(data);
    }

    async set(session, { sid =  this.getID(24), maxAge = 1000000 } = {}, ctx) {
        try {
            // Use redis set EX to automatically drop expired sessions
            await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000);
        } catch (e) {}
        return sid;
    }

    async destroy(sid, ctx) {
        return await this.redis.del(`SESSION:${sid}`);
    }
}

export default RedisStore;