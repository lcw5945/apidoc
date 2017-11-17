/**
 * Created by Cray on 2017/5/25.
 */

export default {
    route(router, ApiControl) {
        /**
         * 添加协作管理
         */
        router.post('/addCooper', ApiControl.addCooper);
        /**
         * 删除协作管理
         */
        router.post('/delCooper', ApiControl.delCooper);
        /**
         * 获得项目列表
         */
        router.get('/getProjects', ApiControl.getProjects);
        /**
         * 删除
         */
        router.post('/delProject', ApiControl.delProject);
        /**
         * 创建更新
         */
        router.post('/updateAddProject', ApiControl.updateAddProject);

        /**
         * 导入项目
         */
        router.post('/importPjFromApiView', ApiControl.importPjFromApiView);
        /**
         * 获得apiveiw项目
         */
        router.post('/getPjFromApiView', ApiControl.getPjFromApiView);
    }
};
