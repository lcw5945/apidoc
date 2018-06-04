/**
 * Created by user on 2018/2/23.
 */
import express from 'express'
import Serrors from '../../utils/serror'

import { cors, auth, authority, overrideJson } from '../../middleware'
import commonApi from './api/common'
import databaseApi from './api/database'
import inerfaceApi from './api/inerface'
import userApi from './api/user'
import adminApi from './api/admin'
import fieldApi from './api/field'
import testenvApi from './api/testenv'
import groupApi from './api/group'
import projectApi from './api/project'
import statecodeApi from './api/statecode'
import itempleteApi from './api/itemplete'
var router = express.Router();


router.all('*', cors, auth, authority, overrideJson)

router.use((req, res, next) => {
    console.log('startTime: ', Date.now())
    next()
})

commonApi.route(router)
userApi.route(router)
adminApi.route(router)
databaseApi.route(router)
inerfaceApi.route(router)
groupApi.route(router)
projectApi.route(router)
statecodeApi.route(router)
fieldApi.route(router)
testenvApi.route(router)
itempleteApi.route(router)

export default router