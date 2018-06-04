import domain from "../conf/domain";
import Model from "../models/index";
import Entity from "../service/entity";
import Constant from "../conf/constant";
import Serrors from "../utils/serror";
import Params from "../utils/params";
import Socket from "../service/socket";
import WebConf from "../conf/web";
import Utils from "../utils";
import Log from "hefan-debug-log-s";
import _ from "lodash";
import axios from "axios";
import ActionType from "../../src/constants/action-type";

const jwt = require("jsonwebtoken");

const AUTH_HOST =
  process.env.NODE_ENV === "production"
    ? WebConf.ssoAuth.host.dev
    : process.env.NODE_ENV === "testing"
      ? WebConf.ssoAuth.host.test
      : WebConf.ssoAuth.host.pro;
/**
 * 跨域
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const cors = function(req, res, next) {
  console.log("执行了", req);

  let allowDomain = [
    "http://39.106.118.58",
    "http://39.106.118.58",
    "http://localhost:3100"
  ];
  let originDomain = req.headers.origin;
  if (allowDomain.includes(originDomain)) {
    res.header("Access-Control-Allow-Origin", originDomain);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, authinfo"
    );
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", " 3.2.1");
    res.header("Content-Type", "application/json;charset=utf-8");
  }

  if (req.method == "OPTIONS") res.sendStatus(200);
  /*让options请求快速返回*/ else next();
};
/**
 * token 认证
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const auth = async function(req, res, next) {
  let params = Params.tokenValidate(req),
    url_arr = ["/api/login", "/api/loginTest"],
    ssoUser,
    SSO_TOKEN,
    resJson;

  if (WebConf.ssoAuth.auth) {
    Log.debug(`cookie--> ssotoken ${req.cookies[WebConf.ssoAuth.tokenKey]}`);
    SSO_TOKEN = req.cookies[WebConf.ssoAuth.tokenKey];
  }

  if (!url_arr.includes(req.baseUrl + req.path)) {
    if (!_.isPlainObject(params)) {
      resJson = Serrors.paramsError();
    } else {
      if (!params["token"]) {
        resJson = Serrors.Unauthorized("token不存在");
      } else {
        let { token } = params,
          decoded = null;
        try {
          decoded = jwt.verify(token, Constant.secret);
          _.forOwn(decoded.data, (value, key) => {
            domain[key] = value;
          });
        } catch (err) {
          resJson = Serrors.Unauthorized("token 失效");
        }
        if (!(decoded != null && Math.floor(Date.now() / 1000) < decoded.exp)) {
          resJson = Serrors.Unauthorized("token 失效");
        }
      }
      //自动登录
      if (req.baseUrl + req.path == "/api/autologin" && SSO_TOKEN) {
        try {
          //认证系统获得用户数据
          ssoUser = await axios.get(AUTH_HOST + WebConf.ssoAuth.uri, {
            params: { token: SSO_TOKEN }
          });
          ssoUser = ssoUser.data || {};
          Log.debug(`获得用户信息 ${JSON.stringify(ssoUser)}`);
        } catch (error) {
          console.error(error);
        }

        if (ssoUser.id) {
          //查询存在ssouser字段的用户
          let userdos = await Entity.find(Model.user, {
            ssoUser: { $exists: true }
          }).catch(e => {
            resJson = Serrors.findError();
          });

          let token, _data, doc;

          //循环匹配id
          if (userdos && userdos.length > 0) {
            _.forEach(userdos, (value, index) => {
              if (value.id == ssoUser.id) {
                _data = {
                  username: value.username,
                  userId: value._id,
                  authority: value.authority
                };
                return false;
              }
            });
          }

          if (!_data) {
            //是否能关联用户
            let userdos = await Entity.find(Model.user, {
              username: ssoUser.username
            }).catch(e => {
              resJson = Serrors.findError();
            });

            if (userdos && userdos.username) {
              let opt = _.omit(userdos, ["_id"]);
              opt.ssoUser = ssoUser;
              //关联用户
              await Entity.update(Model.user, userdos._id, opt).catch(e => {
                Log.log("更新失败");
              });

              _data = {
                username: userdos.username,
                userId: userdos._id,
                authority: userdos.authority
              };
            } else {
              //创建用户
              let newUser = {
                username: ssoUser.username,
                authority: 0,
                password: Utils.md5("Hefantv123"),
                regTime: Date.now(),
                ssoUser: ssoUser
              };
              _data = await Entity.create(Model.user, newUser).catch(e => {
                Log.log("创建用户失败");
              });
              if (_data.password) delete _data.password;
            }
          }

          if (_data) {
            //生成token
            token = jwt.sign(
              {
                // exp: Math.floor(Date.now() / 1000) + (5*60*60),
                data: _data
              },
              Constant.secret,
              { expiresIn: "1720h" }
            ); //, {expiresIn: '720h'}

            //合并用户数据
            doc = Object.assign(
              {},
              {
                ..._data,
                token
              }
            );

            resJson = {
              code: 200,
              data: doc,
              msg: "登录成功"
            };
          } else {
            resJson = Serrors.operateError();
          }
        } else {
          resJson = Serrors.Unauthorized("token 失效");
        }
      }
    }

    if (resJson) {
      res.json(resJson);
    } else {
      next();
    }
  } else {
    next();
  }
};

/**
 * 权限验证
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const authority = async function(req, res, next) {
  let params = Params.tokenValidate(req),
    url_arr = [
      "/api/delInterfaces",
      "/api/updateAddInterfaces",
      "/api/delStateCode",
      "/api/getStateCodes"
    ],
    resJson,
    projectDoc,
    isCooperGroup = -1;

  if (url_arr.includes(req.baseUrl + req.path)) {
    if (params && params.projectId) {
      projectDoc = await Entity.findById(Model.project, params.projectId).catch(
        e => {
          resJson = Serrors.findError("project 查询失败");
        }
      );

      if (projectDoc && projectDoc.cooperGroup.length > 0) {
        isCooperGroup = projectDoc.cooperGroup.findIndex(
          (item, index) => item.userId === domain.userId
        );
      }

      if (!(isCooperGroup > -1 || parseInt(domain.authority) > 2)) {
        resJson = Serrors.Unauthorized("没有权限");
      }
    } else {
      resJson = Serrors.paramsError();
    }
    if (resJson) {
      res.json(resJson);
    } else {
      next();
    }
  } else {
    next();
  }
};

/**
 * 重载res.json
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const overrideJson = (req, res, next) => {
  let resJson = res.json;
  let params = Params.tokenValidate(req);
  let socketCode = {
    "/delInterfaces": ActionType.IF_DEL,
    "/updateAddInterfaces": ActionType.IF_UPDATE_ADD,
    "/delStateCode": ActionType.SC_DEL,
    "/updateAddStateCode": ActionType.SC_UPDATE_ADD,
    "/delProject": ActionType.PJ_RC_DEL,
    "/updateAddProject": ActionType.PJ_UPDATE_ADD,
    "/addCooper": ActionType.PJ_ADD_COOPER,
    "/delCooper": ActionType.PJ_DEL_COOPER,
    "/delGroup": ActionType.GROUP_RC_DEL,
    "/updateAddGroup": ActionType.GROUP_UPDATE_ADD
  };

  res.json = function(data) {
    //check code & send error log
    let error = Serrors.postError(req, res, data);
    //send socket
    if (!error && Object.keys(socketCode).includes(req.path)) {
      let action = socketCode[req.path];
      Socket.resolve(action, params, data.data);
    }
    //send data
    resJson.call(res, data);
  };
  next();
};
