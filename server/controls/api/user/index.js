/**
 * Created by Cray on 2017/7/3.
 */
import _ from "lodash";
import Model from "../../../models/index";
import Entity from "../../../service/entity";
import Serrors from "../../../utils/serror";
import Utils from "../../../utils/index";
import Domain from "../../../conf/domain";
import constant from "../../../conf/constant";

import adminCtrl from "./admin";
import registerUserCtrl from "./registerUser";

var jwt = require("jsonwebtoken");

export default Object.assign({}, adminCtrl, registerUserCtrl, {
  /**
   * 登录
   * @param {String} username  用户名称
   */
  async login(params) {
    let res,
      doc,
      userData,
      password = Utils.md5(params.password),
      loginTime = Date.now(),
      { username } = params;
    userData = await Entity.find(Model.user, { username }).catch(e => {
      res = Serrors.findError();
    });

    if (userData && userData[0]) {
      let data = userData[0];
      if (password !== data["password"]) {
        res = Serrors.operateError("密码错误");
      } else {
        let _data = {
          username: data.username,
          userId: data._id,
          authority: data.authority
        };
        let token = jwt.sign(
          {
            // exp: Math.floor(Date.now() / 1000) + (5*60*60),
            data: _data
          },
          constant.secret,
          { expiresIn: "1720h" }
        ); //, {expiresIn: '720h'}

        doc = Object.assign(
          {},
          {
            username: data.username,
            userId: data._id,
            auth: data.authority,
            token
          }
        );
        await Entity.update(Model.user, data["_id"], { loginTime }).catch(e => {
          res = Serrors.updateError(`用户id:${data._id}更新失败`);
        });
      }
    } else {
      res = Serrors.operateError("账号不存在");
    }

    if (!res) {
      res = {
        code: 200,
        data: doc,
        msg: "登录成功"
      };
    }
    return new Promise(resolve => {
      resolve(res);
    });
  },

  /**
   * 登出
   */
  async logout(req, res) {
    if (req.session.userid) {
      req.session.userid = "";
      req.session.username = "";
    }

    res.json({
      data: null,
      code: "200",
      msg: "退出成功"
    });
  },
  /**
   * 自动登录
   */
  async autologin() {
    let res,
      doc,
      userData,
      loginTime = Date.now();

    userData = await Entity.find(Model.user, {
      username: Domain.username
    }).catch(e => {
      res = Serrors.findError();
    });

    if (userData && userData[0]) {
      let data = userData[0];

      let _data = {
        username: data.username,
        userId: data._id,
        authority: data.authority
      };
      let token = jwt.sign(
        {
          data: _data
        },
        constant.secret,
        { expiresIn: "1720h" }
      );

      doc = Object.assign(
        {},
        {
          username: data.username,
          userId: data._id,
          auth: data.authority,
          token
        }
      );
      await Entity.update(Model.user, data["_id"], { loginTime }).catch(e => {
        res = Serrors.updateError(`用户id:${data._id}更新失败`);
      });
    } else {
      res = Serrors.operateError("账号不存在");
    }

    if (!res) {
      res = {
        code: 200,
        data: doc,
        msg: "登录成功"
      };
    }
    return new Promise(resolve => {
      resolve(res);
    });
  }
});
