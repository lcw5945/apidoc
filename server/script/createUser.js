
import '../lib/mongdb'
import Utils from '../utils'
import Model from '../models'
import Entity from '../service/entity'

async function register(params) {
    let password = Utils.md5('@apidoc123'),
        regTime = Date.now(),
        loginTime = Date.now(),
        username = 'root';

    params = {
        username,
        authority: 3,
        password,
        regTime,
        loginTime,
        ssoUser: {}
    }
    let doc = await Entity.create(Model.user, params).catch((e) => {
        console.error(e)
    })

    return Promise.resolve(doc)
}

register().then(doc => {
    console.log(doc)
});