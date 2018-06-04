/**
 * Created by Cray on 2017/7/20.
 */

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Form, Icon, Input, Button, Row, Col } from "antd";
import * as userActions from "~actions/user";
import * as globalActions from "~actions/global";
import { paramsFormat } from "~common/http";
import { canvasAnt } from "~utils/canvasAnt";
import { AUTH_DOMAIN } from "~constants/const-config";
import Logo from "../../assets/images/logo.png";
import ReduxPersist from "~constants/persist-config";
import Local from "~utils/local";

class Login extends Component {
  constructor(props) {
    super(props);

    this.submit_handler = this.submit_handler.bind(this);
  }

  componentWillMount() {
    // this.props.fetchAutoLoginUser(paramsFormat({autlogin:true}));
  }

  componentDidMount() {
    canvasAnt("login");
    // window.location.href = AUTH_DOMAIN
  }

  /**
   * 提交登录
   * @param e
   */
  submit_handler(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.fetchLoginUser(values, data => {
          Local.setItem(ReduxPersist.cacheType.USERINFO, data);
          this.props.history.push("/home/pm/project");
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login" id="login">
        <div className="sy_top" />
        <div className="btmLogin">
          <div className="sy_bottom">
            {/*<h1 id="PerformName">HF_APIVIEW</h1>*/}
            <Row className="ul-wrap">
              <Col span={24}>
                <img className="logo" src={Logo} alt="" />
                <Form layout="vertical" onSubmit={this.submit_handler}>
                  <Form.Item hasFeedback>
                    {getFieldDecorator("username", {
                      rules: [{ required: true, message: "请输入用户名" }]
                    })(
                      <Input
                        addonBefore={<Icon type="user" />}
                        placeholder="请输入用户名"
                        type="text"
                      />
                    )}
                  </Form.Item>
                  <Form.Item hasFeedback>
                    {getFieldDecorator("password", {
                      rules: [{ required: true, message: "请输入密码" }]
                    })(
                      <Input
                        addonBefore={<Icon type="lock" />}
                        placeholder="请输入密码"
                        type="password"
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </div>
        </div>
        <div id="companyName" className="companyName">
          api.hefantv.com
        </div>
      </div>
    );
  }
}

export default connect(
  state => state,
  dispatch => bindActionCreators({ ...globalActions, ...userActions }, dispatch)
)(Form.create({})(Login));
