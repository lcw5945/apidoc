
import _ from 'lodash';

import inerfaceApi from './api/inerface';
import projectApi from './api/project';
import importPjApi from './api/project/import';
import statecodeApi from './api/statecode';
import database from './api/database';
import testenvApi from './api/testenv';
import field from './api/field';
import group from './api/group';
import userApi from './api/user';
import itempleteApi from './api/itemplete';

export default _.merge({}
    , inerfaceApi
    , projectApi
    , importPjApi
    , statecodeApi
    , database
    , field
    , group
    , testenvApi
    , itempleteApi
    , userApi);