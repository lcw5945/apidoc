/**
 * Created by user on 2017/8/11.
 */
/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {Table, Button, Modal, Select, Input, Popconfirm, Col, Icon, Switch, message} from 'antd';
import {Link} from 'react-router-dom';
import {paramsFormat} from '~common/http';
import ProjectSubnav from "~components/common/ProjectSubnav";
import Utils from '~utils'
import * as ajax from '~lib/ajax';
import Request from '~common/project/request';
import jsoneditor from 'jsoneditor';
import EnvSelecter from '~components/project/EnvSelecter';
import RequestParam from "~components/project/RequestParam/index";
import RequestHead from "~components/project/requestHead";
import MoreButton from "~components/project/MoreButton";
import JsonEditorBox from "~components/project/JsonEditorBox";
import {API_HOST} from '~constants/api-host';

export default class ApiTestContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queryData: {},
            request: 'http',
            dataType: '',
            url: '',
            envStatus: API_HOST.substring(7) + '/mock',
            requestHead: [],
            requestParame: [],       // 请求参数
            getDataPropsStatus: true, // 是否需要得到父组件的值
        }
    }

    // 跳转回api列表页
    backApiList() {
        this.props.history.push(`/project/api/list?projectId=${this.state.queryData.projectId}&groupId=${this.state.queryData.groupId}`);
    }

    /**
     * 跳转详情页
     **/
    goToDetails() {
        this.props.history.push(`/project/api/details?projectId=${this.state.queryData.projectId}&groupId=${this.state.queryData.groupId}&apiId=${this.state.queryData.apiId}`);
    }

    /**
     * 给下拉框 绑定事件 赋值
     **/
    testSelect_changeHandler(selectType, val) {
        switch (selectType) {
            case 'request':
                this.setState({request: val})
                break;
            case 'dataType':
                this.setState({dataType: val})
                break;
            default:
                break;
        }
    }

    /**
     *  给URL输入框 绑定事件 赋值
     **/
    testInputUrl_changeHandler(event) {
        this.setState({url: event.target.value})
    }

    /**
     * 接收环境选择组件传过来的数据并赋值  通过组件传值修改url
     * url：url输入框中的地址，例如：api.hefantv.com/updatePassWord
     * envStatus：该地址的域名，例如：api.hefantv.com
     **/
    handleReturnUrl(url, envStatus) {
        this.setState({url, envStatus})
    }

    /**
     * 接收请求头组件传来的数据并赋值
     * */
    fromSubRequestHeadData(requestHead) {
        this.setState({requestHead})
    }

    /**
     * 发送AJAX请求
     **/
    sendAjax(item) {
        let url = this.state.url;
        let host = this.state.request + '://';
        let method = this.state.dataType || item.dataType; // 请求方式
        let requestHead = this.state.requestHead; // 请求头的数组
        let requestParame = ''; // 请求参数的数组
        let header = {} // 请求头部
        let params = {} // 请求参数
        let options = '';
        let paramResult = this.refs.requestParam.getParamData();
        // 有空值
        if (!paramResult.isVerify) {
            return false;
        }
        requestParame = paramResult.data;
        Request.forRequestHead(requestHead, header);
        Request.forRequestParame(requestParame, params);
        options = {
            url,
            host,
            method,
            params,
            header
        };
        ajax.fetchTest(options).then((data) => {
            this.refs.jsonEditorBox.setEditorSuc(data);
            message.success('接口访问成功');
            this.HistoryRecord(item, data, options);
        }).catch((e) => {
            Modal.error({
                title: 'This is a notification message',
                content: e.status + '',
            });
        });
    }

    /**
     *  添加历史记录
     **/
    HistoryRecord(item, data, options) {
        let history = item.history;
        let obj = {
            data,
            options,
            key: new Date().getTime() + Math.random() * 1000,
            requestHead: this.state.requestHead,
            requestParame: this.state.requestParame,
            envStatus: this.state.envStatus,
            date: new Date().getTime(),
            username: this.props.user.username
        }

        let historyFlag;
        history.length > 0 ? historyFlag = false : historyFlag = true;
        history.forEach((obj1) => {
            let objOptions = Object.assign({header: {}}, obj1.options)
            if (Utils.isObjectValueEqual(objOptions, obj.options)) {
                historyFlag = false
            } else {
                historyFlag = true;
            }
        })

        if (historyFlag) {
            history.push(obj);
            this.props.fetchUpdateAddInterface(paramsFormat({
                id: item._id,
                projectId: item.projectId,
                history
            }));
        }
    }

    /**
     * 移除历史记录
     **/
    removeHistoryRecord(index, item, e) {
        e.preventDefault();
        let history = item.history;
        history.splice(index, 1);
        this.props.fetchUpdateAddInterface(paramsFormat({
            id: item._id,
            projectId: item.projectId,
            history
        }));
    }

    /**
     *  再现历史记录
     **/
    CheckHistoryRecord(data) {
        const {options} = data;
        const request = options.host.slice(0, -3);
        this.setState({
            request,
            url: options.url,
            dataType: options.method,
            requestHead: data.requestHead,
            requestParame: data.requestParame,
            getDataPropsStatus: false,
        })
        this.refs.jsonEditorBox.setEditorSuc(data);
        this.refs.requestParam.fromFatherData(data.requestParame);
    }


    render() {
        const {groupCmp} = this.props.global;
        const {interfaces} = this.props.entity;
        const {projects} = this.props.entity;
        const queryData = this.state.queryData = Utils.parseUrlToData(this.props.location.search);
        const Option = Select.Option;
        let item = {};

        return (
            <div>
                <ProjectSubnav />
                {
                    interfaces && projects && (() => {
                        if (interfaces.hasOwnProperty(queryData.projectId)) {
                            const {items} = interfaces[queryData.projectId];
                            // 查找本页面的数据
                            items.map((obj) => {
                                if (obj._id === queryData.apiId) {
                                    item = Utils.copy(obj);
                                    return;
                                }
                            });
                            if (item.params && this.state.getDataPropsStatus) {
                                this.state.requestParame = Utils.copy(item.params);
                            }

                            if (!this.state.url) this.state.url = Utils.foramtUrl(API_HOST + '/mock', item.URI);
                        }

                        return (<div className="apiTest" style={{'left': groupCmp.width}}>
                            <div className="buttons clearfix">
                                <Button icon="left"
                                        onClick={this.backApiList.bind(this)}>接口列表</Button>
                                <Button icon="info-circle"
                                        onClick={this.goToDetails.bind(this)}>详情</Button>
                                <Button icon="caret-right" type="primary">测试</Button>
                                <MoreButton {...this.props} item={item}/>

                                <EnvSelecter onSubmitUrl={this.handleReturnUrl.bind(this)} item={item} {...this.props}/>
                            </div>
                            <div className="apiTest-main">
                                <div className="address clearfix">
                                    <div className="request">
                                        <Select value={this.state.request}
                                                onChange={this.testSelect_changeHandler.bind(this, 'request')}>
                                            <Option value="http">http</Option>
                                            <Option value="https">https</Option>
                                        </Select>
                                    </div>
                                    <div className="colon">:</div>
                                    <div className="url">
                                        <Input value={this.state.url}
                                               onChange={this.testInputUrl_changeHandler.bind(this)}/>
                                    </div>
                                    <div className="api-status">
                                        <Select value={this.state.dataType || item.dataType}
                                                onChange={this.testSelect_changeHandler.bind(this, 'dataType')}>
                                            <Option value="GET">GET</Option>
                                            <Option value="POST">POST</Option>
                                            <Option value="PUT">PUT</Option>
                                            <Option value="DELETE">DELETE</Option>
                                            <Option value="HEAD">HEAD</Option>
                                            <Option value="PATCH">PATCH</Option>
                                            <Option value="OPTIONS">OPTIONS</Option>
                                        </Select>
                                    </div>
                                    <div className="send">
                                        <Button icon="rocket" type="primary"
                                                onClick={this.sendAjax.bind(this, item)}>发送</Button>
                                    </div>
                                </div>
                                <div className="request-head">
                                    <div className="request-head-top">请求头部</div>
                                    <RequestHead requestHead={this.state.requestHead}
                                                 OnfromSubRequestHeadData={this.fromSubRequestHeadData.bind(this)}/>
                                </div>
                                <div className="request-parame">
                                    <div className="request-parame-top">请求参数</div>
                                    <RequestParam ref='requestParam' {...this.props}
                                                  requestParame={this.state.requestParame}/>
                                </div>
                                <JsonEditorBox ref='jsonEditorBox'/>
                                <div className="history">
                                    <div className="history-top">请求历史</div>
                                    <div className="history-list">
                                        <ul>
                                            {
                                                item.history && item.history.map((data, index) => {
                                                    let date = <span className="list-span"></span>;
                                                    if (data.date) {
                                                        date = <span className="list-span">
                                                                    {Utils.formatDate(new Date(parseInt(data.date)))}
                                                                </span>
                                                    }
                                                    return (
                                                        <li key={'history-list' + data.key}>
                                                            <div className="list_row">
                                                                <span className='list_count'>{index + 1}</span>
                                                                <b onClick={this.removeHistoryRecord.bind(this, index, item)}>
                                                                    <Icon
                                                                        type="minus-square"
                                                                        style={{fontSize: '27px', color: '#43a074'}}
                                                                        className='close_list'/>
                                                                </b>
                                                                <div className="list_name"
                                                                     onClick={this.CheckHistoryRecord.bind(this, data)}>
                                                                    <span className="list-span">
                                                                        {data.options.method}
                                                                    </span>
                                                                    <span className="list-span">
                                                                        {data.options.host + data.options.url}
                                                                    </span>
                                                                    <span className="list-span">
                                                                        {data.username}
                                                                    </span>
                                                                    {date}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>)
                    })()
                }
            </div>
        );
    }
}




