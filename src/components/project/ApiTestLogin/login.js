/**
 * Created by user on 2017/11/16.
 */
import React from 'react';
import {Button, Icon, Input, Modal, Select, Switch, Message, Radio, Form, notification, Tooltip} from "antd";
import Utils from '~utils'
import Local from '~utils/local';
import _ from 'lodash';
import {paramsFormat} from '~common/http';
import ApiLoginLocal from './local';
import * as ajax from '~lib/ajax';
const Option = Select.Option;
const {TextArea} = Input;


export default class ApiTestLoginModal extends React.Component {
    constructor(props) {
        super(props);
        let queryData = Utils.parseUrlToData(this.props.location.search);
        this.state = {
            projectId: queryData["projectId"],
            url: "",
            visible: false,
            requestParam: "",
            method: "",
            account: "",
            username: "",
            password: "",
            loginPath: "",
            errorStatus: false,
        }

    }


    input_changehandler(name, e) {

        let state = this.state,
            ele = e.target;
        state[name] = ele.value;

        this.setState({...state})

    }

    select_changehandler(val) {
        this.setState({method: val})
    }

    open() {
        let allTreeData = ApiLoginLocal.getJsonData({
                projectId: this.state.projectId,
            }) || {};
        let loginOptions = {}
        if(!_.isEmpty(allTreeData) && !_.isEmpty(allTreeData.options) ) {
            loginOptions = allTreeData.options
            this.setState({
                visible:true,
                username: loginOptions.username,
                password: loginOptions.password,
                method: loginOptions.method,
                loginPath: loginOptions.loginPath,
                errorStatus:false,
            })
        }else {
            this.setState({
                visible: true,
                requestParam: "",
                username: '',
                password: '',
                method: 'GET',
                loginPath: '',
                errorStatus: false,
            })
        }
    }


    async handleOk_clickHandler() {
        let state = this.state,
            loginJson,
            json;

        if (!state.method || !state.username || !state.password || !state.loginPath) {
            this.setState({
                errorStatus: true
            })
            return;
        }

        let options = {
            projectId: state.projectId,
            username: state.username,
            password: state.password,
            method: state.method,
            loginPath: state.loginPath,
            loginHost: this.props.loginEnvStatus
        }

        // let options = {
        //     projectId: '599e76c218dca00d1cf2b1f1',
        //     username: '18001278867',
        //     password: '1234',
        //     method: 'GET',
        //     loginPath: '/v2/login/userLogin',
        //     loginHost: 'https://testerpassport.hefantv.com'
        // }

        await ajax.fetchTest({url:'/api/loginTest', method: 'POST', params: options,}).then((data)=>{
            loginJson = data
            json = data.data;
        }).catch((err)=>{
            Message.error(err);
        });

        if (loginJson.code!=200 || !json) {
            Message.error(loginJson.msg);
            return;
        }

        let data = {
            projectId: state.projectId,
            accountObj: {
                data: ApiLoginLocal.addKey(json),
                json:json,
                checkedKeys: []
            }
        }

        ApiLoginLocal.save(data,options)

        this.props.loginSuccess({...state});

        this.setState({
            visible: false
        })
    }


    handleCancel_clickHandler() {

        this.setState({
            visible: false
        })
    }


    ajax(url, params, method) {

        let options = {
            url: '',
            host: url,
            method,
            params
        }

        return new Promise((resolve, reject) => {
            ajax.fetchTest(options).then((data) => {
                resolve(data);
            }).catch((e) => {

                notification['error']({
                    message: '提示',
                    description: e.status.message,
                });

                reject(e);

            });
        });
    }


    render() {
        let that = this,
            state = this.state;


        return (
            <div>

                <Modal ref="loginDialog"
                       title="登录"
                       maskClosable={false}
                       visible={this.state.visible}
                       onOk={this.handleOk_clickHandler.bind(this)}
                       onCancel={this.handleCancel_clickHandler.bind(this)}>

                    <section className="loginDialog">
                        <div>
                            <span className='edit_name'><em>*</em>Host：</span>
                            <Input value={this.props.loginEnvStatus} disabled/>
                        </div>
                        <div>
                            <span className='edit_name'><em>*</em>Url：</span>
                            <Tooltip title="登录接口地址，如：/v2/login/userLogin">
                            <TextArea value={state.loginPath} placeholder="请输入登录接口地址" autosize
                                      className={!state.loginPath && state.errorStatus ? 'g-errorTip' : ''}
                                      onChange={that.input_changehandler.bind(that, 'loginPath')}/>
                            </Tooltip>
                        </div>
                        <div>
                            <span className='edit_name'><em>*</em>Method：</span>
                            <Select value={state.method} allowClear placeholder="请选择Method" id="loginDialog_method"
                                    onChange={that.select_changehandler.bind(that)}>
                                <Option value="GET">GET</Option>
                                <Option value="POST">POST</Option>
                            </Select>
                        </div>
                        <div>
                            <span className='edit_name'><em>*</em>登录账号：</span>
                            <Input value={state.username} placeholder="请输入登录账号"
                                      className={!state.username && state.errorStatus ? 'g-errorTip' : ''}
                                      onChange={that.input_changehandler.bind(that, 'username')}/>

                        </div>
                        <div>
                            <span className='edit_name'><em>*</em>登录密码：</span>
                            <Input value={state.password} placeholder="请输入登录密码"
                                   type='password'
                                      className={!state.password && state.errorStatus ? 'g-errorTip' : ''}
                                      onChange={that.input_changehandler.bind(that, 'password')}/>
                        </div>
                    </section>


                </Modal>
            </div>
        )
    }

}