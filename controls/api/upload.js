/**
 * Created by Cray on 2017/5/25.
 */
import _ from 'lodash';
import Step from '../../lib/step';
import images from 'images';
import Operate from './operate';
const uuidV1 = require('uuid/v1');
import Params from './params';
import Serror from './serror';
import Utils from './utils';
import * as Model from '../../models';

let fs = require('fs');
let formidable = require('formidable');
/** 上传缓存目录 **/
let cacheFolder = 'public/img/uploadcache/';
/** 公共访问路径 **/
let publicPath = '/img/uploadcache/';

const MIME_TYPES = {
    '.txt': 'text/plain',
    '.md': 'text/plain',
    '': 'text/plain',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif'
};

export default {
    /**
     * 影视中国上传接口
     * @param model
     * @param req
     * @param res
     */
    uploadMovieFile(model, req, res) {
        let currentUser = req.session.user || {id: "devtest"};
        let userDirPath = cacheFolder + currentUser.id;

        if (!fs.existsSync(userDirPath)) {
            fs.mkdirSync(userDirPath);
        }

        let form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = userDirPath;
        form.keepExtensions = true;
        form.maxFieldsSize = 2 * 1024 * 1024;
        form.type = true;
        let coverImage = "";
        let bannerImage = "";
        let swiperImage = "";
        let imgKey = "";
        form.parse(req, function (err, fields, files) {
            if (err) {
                res.json({
                    code: 206,
                    data: "",
                    msg: '上传失败'
                });
                return;
            }
            let ext = '';
            let flag = true;
            _.forOwn(files, function (file, key) {
                switch (file.type) {
                    case 'image/pjpeg':
                        ext = 'jpg';
                        break;
                    case 'image/jpeg':
                        ext = 'jpg';
                        break;
                    case 'image/png':
                        ext = 'png';
                        break;
                    case 'image/x-png':
                        ext = 'png';
                        break;
                }

                if (ext.length === 0) {
                    flag = false;
                    return false;
                } else {

                    let fileName = '/' + uuidV1() + '.' + ext;
                    let newPath = form.uploadDir + fileName;
                    let imgUrl = publicPath + currentUser.id + fileName;
                    // let imgUrl = req.protocol + '://' + req.hostname + publicPath + currentUser.id + fileName;
                    if (key == "coverImage") {
                        coverImage = imgUrl;
                    } else if (key == "bannerImage") {
                        bannerImage = imgUrl;
                    } else {
                        swiperImage = swiperImage == "" ? (imgUrl) : (imgUrl + ',' + swiperImage);
                    }

                    fs.renameSync(file.path, newPath);
                }
            });

            if (!flag) {
                res.json({
                    code: 206,
                    data: "",
                    msg: '只支持png和jpg格式图片'
                });
                return false;
            }

            console.log("fields", fields);
            console.log("files", files);

            //更新参数是否合法
            let enableUpdate = true;
            //保存数据库
            // let params = _.merge({}, fields);
            let params = _.pick(fields, ['id', 'name', 'location', 'summary', 'index', 'publishTime']);
            if (params.id && Object.keys(params).length < 3) {
            } else {
                params["details"] = {};
                params["details"]["vrUrl"] = fields["vrUrl"];
                params["details"]["content"] = fields["content"];

                //是否存在封面
                if (coverImage) {
                    params["coverImage"] = coverImage; //是否更新了图片
                }

                //是否存在banner
                if (bannerImage) {
                    params["bannerImage"] = bannerImage; //是否更新了图片
                }

                //全景列表
                params["details"]["swiperImage"] = fields["swiperImage"] ? fields["swiperImage"] : "";

                if (swiperImage) {
                    params["details"]["swiperImage"] = params["details"]["swiperImage"] ? (params["details"]["swiperImage"] + ',' + swiperImage) : swiperImage; //是否更新了图片
                }

                if (!params.id) {
                    enableUpdate = params.hasOwnProperty("name") &&
                        params.hasOwnProperty("location") &&
                        params.hasOwnProperty("publishTime") &&
                        params.hasOwnProperty("summary") &&
                        params.hasOwnProperty("coverImage") &&
                        params.hasOwnProperty("index");
                }
            }

            if (enableUpdate) {
                Operate.updateAdd(model, req, res, params);
            } else {
                res.json({
                    code: 208,
                    data: "",
                    msg: '参数格式或者必选参数不能为空'
                });
            }
        });
    },

    /**
     * 保存上传文件
     * @param model
     * @param req
     * @param res
     */
    uploadOneFile(model, req, res) {

        let currentUser = req.session.user || {id: "devtest"};
        console.log('----currentUser-----',currentUser);

        let userDirPath = cacheFolder + currentUser.id;
        console.log('----userDirPath-----',userDirPath);
        if (!fs.existsSync(userDirPath)) {
            fs.mkdirSync(userDirPath);
        }
        let imgUrl = "";
        let imgKey = "";
        let form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = userDirPath;
        form.keepExtensions = true;
        form.maxFieldsSize = 2 * 1024 * 1024;
        form.type = true;

        form.parse(req, function (err, fields, files) {
            if (err) {
                res.json({
                    code: 206,
                    data: "",
                    msg: '上传失败'
                });
                return;
            }
            let flag = true;
            let ext = '';
            _.forOwn(files, function (file, key) {
                switch (file.type) {
                    case 'image/pjpeg':
                        ext = 'jpg';
                        break;
                    case 'image/jpeg':
                        ext = 'jpg';
                        break;
                    case 'image/png':
                        ext = 'png';
                        break;
                    case 'image/x-png':
                        ext = 'png';
                        break;
                }
                if (ext.length === 0) {
                    flag = false;
                    return false;
                } else {

                    let fileName = '/' + uuidV1() + '.' + ext;
                    let newPath = form.uploadDir + fileName;
                    // imgUrl = req.protocol + '://' + req.hostname + publicPath + currentUser.id + fileName;
                    imgUrl = publicPath + currentUser.id + fileName;
                    imgKey = key;
                    fs.renameSync(file.path, newPath);
                }
            });

            if (!flag) {
                res.json({
                    code: 206,
                    data: "",
                    msg: '只支持png和jpg格式图片'
                });
                return false;
            }

            console.log("fields", fields);
            console.log("files", files);

            //保存数据库
            let params = _.merge({}, fields);
            if (imgKey) {
                params[imgKey] = imgUrl; //是否更新了图片
            }

            //更新参数是否合法
            let enableUpdate = true;
            if (params && params.id) {
            } else {
                if (model == Model.homebanner) {
                    enableUpdate = params.hasOwnProperty("title") &&
                        params.hasOwnProperty("hrefUrl") &&
                        params.hasOwnProperty("publishTime") &&
                        params.hasOwnProperty("coverImage") &&
                        params.hasOwnProperty("index");

                } else if (model == Model.famousferson) {
                    enableUpdate = params.hasOwnProperty("cnName") &&
                        params.hasOwnProperty("enName") &&
                        params.hasOwnProperty("position") &&
                        params.hasOwnProperty("headImage") &&
                        params.hasOwnProperty("summary");
                } else if (model == Model.news || model == Model.activity || model == Model.mediafouce) {
                    enableUpdate = params.hasOwnProperty("title") &&
                        params.hasOwnProperty("newsType") &&
                        params.hasOwnProperty("subTitle") &&
                        params.hasOwnProperty("content") &&
                        params.hasOwnProperty("coverImage") &&
                        params.hasOwnProperty("publishTime");
                }
            }

            if (enableUpdate) {
                Operate.updateAdd(model, req, res, params);
            } else {
                res.json({
                    code: 208,
                    data: "",
                    msg: '参数格式不正确，请检查参数key是否符合要求'
                });
            }
        });
    },

    /**
     * 图片上传
     * @param req
     * @param res
     */
    uploadImage(req, res, params)
    {
        let currentUser = req.session.user || {id: "devtest"};
        let userDirPath = cacheFolder + currentUser.id;

        if (!fs.existsSync(userDirPath)) {
            fs.mkdirSync(userDirPath);
        }
        let imgUrl = "";
        let imgKey = "";
        let form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = userDirPath;
        form.keepExtensions = true;
        form.maxFieldsSize = 2 * 1024 * 1024;
        form.type = true;

        form.parse(req, function (err, fields, files) {
            if (err) {
                res.json({
                    code: 206,
                    data: "",
                    msg: '上传失败'
                });
                return;
            }
            let ext = '';
            let file = files['upload'];

            if (file.size > 396750) {
                res.json({
                    code: 207,
                    data: "",
                    msg: '上传图片尺寸过大, 请上传小于300kb图片'
                });
                return false;
            }


            switch (file.type) {
                case 'image/pjpeg':
                    ext = 'jpg';
                    break;
                case 'image/jpeg':
                    ext = 'jpg';
                    break;
                case 'image/png':
                    ext = 'png';
                    break;
                case 'image/x-png':
                    ext = 'png';
                    break;
            }

            if (ext.length === 0) {
                res.json({
                    code: 206,
                    data: "",
                    msg: '只支持png和jpg格式图片'
                });
                return false;
            } else {

                let fileName = '/' + uuidV1() + '.' + ext;
                let newPath = form.uploadDir + fileName;
                // imgUrl = req.protocol + '://' + req.hostname + publicPath + currentUser.id + fileName;
                imgUrl = publicPath + currentUser.id + fileName;
                // imgKey = key;
                fs.renameSync(file.path, newPath);

                res.type('html');
                res.send(`<script type="text/javascript"> 
                            window.parent.CKEDITOR.tools.callFunction(${params.CKEditorFuncNum}, "${imgUrl}", "");
                            </script>`);
            }

            console.log("fields", fields);
            console.log("files", files);
        });
    },

    /**
     * 图片输出
     * @param req
     * @param res
     * @param params
     */

    outputImg(req, res, params)
    {
        console.debug('outputImg', params);
        params = Utils.formatParams(params);
        let pathname = 'public/img/' + params.file;
        let that = this;

        Step(function () {

                console.log('请求 url :' + params.file + ', path : ' + pathname);
                fs.exists(pathname, this);
            },
            function (e) {
                if (e) {
                    fs.readFile(pathname, this)
                } else {
                    Serror.serverError(res, "文件不存在", 404);
                }
            },
            function (err, results) {
                console.debug('results', results, err);
                if (err) {
                    Serror.serverError(res, "服务器出错");
                    return;
                }
                that.compressImage(req, res, params, new Buffer(results));
            });
    }
    ,

    /**
     * 图片压缩
     * @param req
     * @param res
     * @param params
     * @param imageData
     */
    compressImage(req, res, params, imageData)
    {
        let newImage, quality = 80;
        console.debug('params', params);
        console.debug('imageData', imageData);
        try {
            if (params.w && params.h) {
                newImage = images(imageData).resize(Number(params.w), Number(params.h)).encode("jpg", {quality: quality});
            } else if (params.w) {
                newImage = images(imageData).resize(Number(params.w)).encode("jpg", {quality: quality});
            } else if (params.h) {
                newImage = images(imageData).resize(null, Number(params.h)).encode("jpg", {quality: quality});
            } else {
                newImage = imageData; // 原图

            }

            console.debug(newImage);

            res.set('Content-Type', MIME_TYPES['.jpg']);
            // // res.send(newImage);
            res.status(200).end(newImage);
        } catch (e) {
            let msg = params.url + ' ' + e.toString();
            console.log(msg);
            Serror.serverError(res, msg);
        }
    }
}