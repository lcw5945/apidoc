/**
 * Created by Cray on 2017/5/25.
 */

export default {
    route(router, ApiControl) {
        router.post('/delRegistUser', ApiControl.delRegistUser);
        router.get('/searchRegistUsers', ApiControl.searchRegistUsers);
        router.get('/getRegistUsers', ApiControl.getRegistUsers);
        router.post('/resetRegistUser', ApiControl.resetRegistUser);
        router.post('/updateUser', ApiControl.updateUser);
        router.get('/getMulUser', ApiControl.getMulUser);
        router.post('/login', ApiControl.login);
        router.post('/logout', ApiControl.logout);
        router.post('/register', ApiControl.register);
        /**
         * 删除管理员
         */
        router.get('/delAdmin', ApiControl.delAdmin);
        /**
         * 获取管理员
         */
        router.get('/getAdmins', ApiControl.getAdmins);
        /**
         * 编辑超级管理员
         */
        router.post('/updateSuperAdmin', ApiControl.updateSuperAdmin);
        /**
         * 编辑普通管理员
         */
        router.post('/updateAddAdmin', ApiControl.updateAddAdmin);
    }
};