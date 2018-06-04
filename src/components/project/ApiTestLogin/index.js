/**
 * Created by user on 2017/11/16.
 */
import gotem from 'gotem';
import React from 'react';
import ReactDom from 'react-dom';
import {Button, Icon, Input, Modal, Select, Switch, message, Radio, Form} from "antd";
import Utils from '~utils'
import _ from 'lodash';
import Login from './login';
import Tree from './tree';
import ApiLoginLocal from './local';
import {loginConfigWay} from '~constants/test-conf';



const Option = Select.Option;


export default class ApiTestLogin extends React.Component {
    constructor(props) {
        super(props);
        let queryData = Utils.parseUrlToData(this.props.location.search);
        this.state = {
            projectId: queryData["projectId"],
            loginData: {},
            isNeedLogin: true,
            userList: [],
            apiList: [],
            url: '',
            account: '',
            checkedKeys: [],
            contArr: [],
            configWay:'',//入参封装方式
            treeOk:false
        }
    }

    dealData() {
        let allTreeData = ApiLoginLocal.getJsonData({
                projectId: this.state.projectId,
            }) || {};
        this.setState({
            loginData: allTreeData,
            checkedKeys: allTreeData.checkedKeys || []
        });
        this.getTreeData(allTreeData.data, allTreeData.checkedKeys);
    }

    //打开登录弹窗
    login() {
        this.refs.login.open();
    }

    //打开重新选择窗口
    selectTree() {
        let param = {
            projectId: this.state.projectId,
            url: this.state.url,
            account: this.state.account,
        };
        this.refs.tree.open(param);
    }

    //获取树结构数据
    getTreeData(treeData, checkedKeys,treeOk) {
        let contArr = this.dealTreeData(treeData, checkedKeys);

        if(treeOk){
            this.setState({
                contArr,
                treeOk:true
            })
        }else {
            this.setState({
                contArr
            })
        }
    }

    //处理树结构数据
    dealTreeData(treeData, checkedKeys) {
        let arr = [];
        treeData.length>0&&checkedKeys.map((key) => {
            treeData.map((item) => {
                if (item.key == key) {
                    arr.push(item.title);
                } else if (item.hasOwnProperty('children') && item.children.length > 0) {
                    arr = _.union(this.dealTreeData(item.children, checkedKeys), arr);
                }
            })
        });

        return arr;
    }

    //登录开关
    change_switch(checked) {
        let isNeedLogin = checked ? true : false;
        this.setState({
            isNeedLogin: isNeedLogin
        })
    }

    //登录成功
    loginSuccess(param = {projectId: ''}) {
        this.dealData();
        this.refs.tree.open(param);
    }

    //选择url或者账号
     selectUrlOrUser(type, value) {
         let {projectId} = this.state;
         this.setState({
             configWay:value
         })
         ApiLoginLocal.addTimes({projectId,url:this.props.loginEnvStatus});
    }

    //添加copy方法
    componentDidUpdate() {
        const ctx = this;
        const dom = ReactDom.findDOMNode(ctx);
        let copyContainer = document.getElementById('copyContainer');
        let copyConts = copyContainer.getElementsByTagName('span');
        let idArr = []
        for (let i=0;i<copyConts.length;i++) {
            idArr.push(copyConts[i].id)
        }

        for (let i=0;i<idArr.length;i++){
            if (idArr[i].indexOf('apiCopy') != -1) {
                const nodes = {
                    trigger: dom.querySelector('#' + idArr[i]),
                    // targetName为DOM选择器，复制组件将会复制它的值
                    target: dom.querySelector('#' + idArr[i])
                };
                gotem(nodes.trigger, nodes.target, {
                    success: function () {
                        message.success('复制成功');
                    },
                    error: function () {
                        message.error('复制失败，请手动输入');
                    }
                });
            }
        }
    }

    //获取随机key
    getKey() {
        return new Date().getTime() + '' + Math.random() * 10000
    }

    //父组件得到子组件的状态数据
    getLoginData() {
        return {...this.state};
    }


    render() {
        let configWayOption = loginConfigWay.map((obj) => {
            return <Option value={obj.type} key={obj.type}>{obj.name}</Option>
        });
        return (
            <div className='apiTestLogin'>
                <div className='apiTestLoginTitle'>
                    <span>登录</span>
                    <Switch onChange={checked => {
                        this.change_switch(checked)
                    }}
                            defaultChecked={false}
                            checked={this.state.isNeedLogin}
                            checkedChildren="关闭"
                            unCheckedChildren="打开" className='apiLoginSwitch'/>
                </div>
                <div className='apiTestLoginCont' style={{display: this.state.isNeedLogin ? 'block' : 'none'}}>
                    <h3>登录的账号 <Button type="primary" onClick={this.login.bind(this)}>登录</Button></h3>
                    <label>
                        <span className='edit_name'>入参封装方式：</span>
                        <Select className='edit_method'
                                style={{minWidth: '370px'}}
                                value={this.state.configWay}
                                onChange={this.selectUrlOrUser.bind(this, 'configWay')}>
                            {configWayOption}
                        </Select>
                    </label>
                    <div className="loginUserData"
                         style={{display: (this.state.contArr.length > 0 || this.state.treeOk) ? 'block' : 'none'}}>
                        <h3>当前账号数据展示 <span>(点击字段内容可复制)</span><Button onClick={this.selectTree.bind(this)}>重新选择</Button>
                        </h3>
                        <p id='copyContainer'>
                            {
                                this.state.contArr.length > 0 && this.state.contArr.map((cont, num) => {
                                    let index = cont.indexOf(":");
                                    return (
                                        <label key={this.getKey()}>
                                            <span id={'apiCopyTitle' + num}
                                                  style={{fontWeight: '700'}}>{cont.substring(0, index)}</span>:<span
                                            id={'apiCopy' + num}>{cont.substring(index + 1)}</span>
                                        </label>
                                    );
                                })
                            }
                        </p>
                    </div>
                </div>

                <Login ref="login" {...this.props} loginSuccess={this.loginSuccess.bind(this)}/>
                <Tree ref="tree" {...this.props} getTreeData={this.getTreeData.bind(this)}/>
            </div>
        )
    }

}