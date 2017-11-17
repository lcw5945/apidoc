/**
 * Created by VULCAN on 2017/8/18.
 */
import React from 'react';
import {Table, Button, Modal, Select, Input, Popconfirm, Col, Icon, Switch, message, Progress} from 'antd';
import {Link} from 'react-router-dom';
import {paramsFormat} from '~common/http';
import ProjectSubnav from "~components/common/ProjectSubnav";
import EnvSelecter from '~components/project/EnvSelecter';
import Utils from '~utils';
import jsoneditor from 'jsoneditor';
import {API_HOST} from '~constants/api-host';
import Request from '~common/project/request';
import _ from 'lodash';
import * as ajax from '~lib/ajax';

export default class ApiPtestContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unaskedColumns: [
                {
                    title: '项目名称',
                    dataIndex: 'name',
                    render: (text, record, index) => (
                        <div className="featureName">
                            {record.featureName}
                        </div>
                    )
                }, {
                    title: '链接地址',
                    dataIndex: 'uri',
                    render: (text, record, index) => (
                        <div className="featureName">
                            {this.state.envStatus + '/' + record.URI}
                        </div>
                    )
                }
            ],
            requestColumns: [
                {
                    title: '项目名称',
                    dataIndex: 'name',
                    render: (text, record, index) => (
                        <div className="featureName">
                            {record.featureName}
                        </div>
                    )
                },
                {
                    title: '链接地址',
                    dataIndex: 'uri',
                    render: (text, record, index) => (
                        <div className="featureName">
                            {this.state.envStatus + '/' + record.URI}
                        </div>
                    )
                },
                {
                    title: '请求状态',
                    dataIndex: 'complete',
                    sorter: (a, b) => a.dataStatus - b.dataStatus,
                    render: (text, record, index) => {
                        if (record.data['status'] && record.data['status']['message']) {

                            return (
                                <div className="complete" style={{color: 'red'}}>
                                    {record.data['status']['message']}
                                </div>
                            )
                        } else {

                            return (
                                <div className="complete">
                                    {record.data['code']}
                                </div>
                            )
                        }

                    }
                }
            ],
            requestArr: [],
            queryData: '',
            request: 'http',
            envStatus: API_HOST.substring(7) + '/mock',
            requestNum: 0,
            interfacesAllItemsLength: 0,
            interfacesTotalLength: 0,
            percent: 0,
            progressUrl: '',
            interfacesPercent: 0,
            ModalVisible: 'false',
            jsonEditorFlag: false,
            jsoneditor: null,
            jsoneditorJson: '',
            editor: '',
            ajaxEnvStatus: ''
        }
    }

    // 跳转回api列表页
    backApiList() {
        this.props.history.push(`/project/api/list?projectId=${this.state.queryData.projectId}&groupId=-1`);
    }

    /*
     * 初始化 jsonEditor
     * */

    componentDidUpdate() {
        if (this.state.jsonEditorFlag && this.jsoneditor) {
            let options = {
                history: false,
                mode: 'tree',
                indentation: 3,
                keep_oneof_values: true,
                onError: (message) => {

                }
            };
            /*这里需要优化--------------------*/

            this.state.jsoneditor = new jsoneditor(this.jsoneditor, options, '');
            this.state.jsoneditor.set(this.state.editor);
            this.setState.jsonEditorFlag = false
            /*try {
             this.state.jsoneditor = new jsoneditor(this.jsoneditor, options, '');

             this.setState.jsonEditorFlag = false
             } catch (e) {

             }*/
        }
    }


    /**
     * 通过组件传值修改url
     **/
    handleReturnUrl(url, envStatus) {
        this.setState({envStatus});
    }

    /**
     * 给下拉框 绑定事件 赋值
     **/
    testSelect_changeHandler(val) {
        this.setState({
            request: val
        })
    }

    /**
     * 批量请求
     **/
    batchRequest(interfacesAjaxItems) {
        this.state.requestArr = [];
        this.state.percent = 0;
        this.state.interfacesPercent = 0;
        let number = this.state.requestNum = 10;
        this.state.interfacesTotalLength = interfacesAjaxItems.length;
        this.state.interfacesAllItemsLength = interfacesAjaxItems.length - number > 0 ?
            interfacesAjaxItems.length - number : 0;
        let _number = interfacesAjaxItems.length < number ? interfacesAjaxItems.length : number;
        for (let i = 0; i < _number; i++) {
            let item = interfacesAjaxItems[i];
            this.sendAjax(item, interfacesAjaxItems);
        }
    }

    /**
     * 再次批量请求
     **/
    againBatchRequest(interfacesAjaxItems) {
        if (this.state.interfacesAllItemsLength > 0) {
            let interfacesAllItemsLength = this.state.interfacesAllItemsLength - 1;
            this.setState({interfacesAllItemsLength});
            this.sendAjax(interfacesAjaxItems[this.state.requestNum], interfacesAjaxItems)
            this.state.requestNum++;
        }
    }

    /**
     * 发送AJAX请求
     **/
    sendAjax(item, interfacesAllItems) {
        let options = '';
        item.history.forEach((data, index) => {
            if (data.envStatus === this.state.envStatus) options = Utils.copy(data.options);
        })
        this.state.ajaxEnvStatus = this.state.envStatus;
        ajax.fetchTest(options).then((data) => {
            item.data = data;
            item.dataStatus = 1;
            this.AJAXComplete(item, interfacesAllItems);
        }).catch((e) => {
            item.data = e;
            item.dataStatus = 0
            this.AJAXComplete(item, interfacesAllItems);
        });
    }

    /**
     * AJAX完成后
     **/
    AJAXComplete(item, interfacesAjaxItems) {
        let requestArr = this.state.requestArr;
        let progressUrl = item.URI;
        requestArr.push(item);
        this.state.percent++;
        let interfacesPercent = parseInt((this.state.percent / this.state.interfacesTotalLength) * 100);

        this.setState({
            requestArr,
            progressUrl,
            interfacesPercent
        })
        this.againBatchRequest(interfacesAjaxItems);
    }


    /*点击每一条 弹出框*/
    showApiInfo_clickHandler(record, index, event) {
        this.setState({editor: record.data});
        this.apiInfo(true, record)
    }

    /**
     * 接口 详细 信息 弹出框
     **/
    apiInfo(ModalVisible, record) {
        let opt = '';
        record.history.forEach((data, index) => {
            if (data.envStatus === this.state.ajaxEnvStatus) opt = Utils.copy(data.options);
        })
        let requestHead = opt['header'];
        let enable = '';
        if (parseInt(record.enable) === 0) {
            enable = '弃用';
        } else if (parseInt(record.enable) === 1) {
            enable = '启用';
        } else if (parseInt(record.enable) === 2) {
            enable = '维护';
        }

        this.setState({
            jsoneditorJson: JSON.stringify(record.data),
            jsonEditorFlag: true
        })
        Modal.info({
            title: '接口详情',
            content: (
                <div className='apiDetail-modal'>
                    <ul>
                        <li>
                            <span className='apiDetail-name'>接口名称 ：</span>
                            <span className='apiDetail-data'>{record.featureName}</span>
                        </li>
                        <li>
                            <span className='apiDetail-name'>接口地址 ：</span>
                            <span className='apiDetail-data'>{record.URI}</span>
                        </li>
                        <li>
                            <span className='apiDetail-name'>接口状态 ：</span>
                            <span className='apiDetail-data'>{enable}</span>
                        </li>
                        <li>
                            <span className='apiDetail-name'>接口类型 ：</span>
                            <span className='apiDetail-data'>{opt['method']}</span>
                        </li>
                        <li>
                            <span className='apiDetail-name'>请求头 ：</span>
                            {
                                (() => {
                                    return (
                                        <div>
                                            <div key={Math.random()}>
                                                <span className='apiDetail-data'>{JSON.stringify(requestHead)}</span>
                                            </div>
                                        </div>
                                    )
                                })()
                            }
                        </li>
                        <li>
                            <span className='apiDetail-name'>请求参数 ：</span>
                            {
                                (() => {
                                    let paramsArr = opt['params'];
                                    return (
                                        <div>
                                            <div key={Math.random()}>
                                                <span className='apiDetail-data'>{JSON.stringify(paramsArr)}</span>
                                            </div>
                                        </div>
                                    )
                                })()
                            }

                        </li>
                        <li>
                            <span className='apiDetail-name'>返回结果 ：</span>
                            <div className='jsonTabEditCont' style={{'left': 0}}
                                 ref={jsoneditor => this.jsoneditor = jsoneditor}></div>
                        </li>
                    </ul>
                </div>
            ),
            visible: ModalVisible,
            onOk() {
            },
        });

    }


    render() {
        const {groupCmp} = this.props.global;
        const {interfaces} = this.props.entity;
        const queryData = this.state.queryData = Utils.parseUrlToData(this.props.location.search);
        const Option = Select.Option;
        let interfacesAllItems = [];
        let interfacesAjaxItems = [];
        let interfacesItems = [];
        let interfacesItemsPagination;
        if (this.state.jsoneditor) {
            this.state.jsoneditor.set(this.state.jsoneditorJson)
        }

        return (
            <div>
                <ProjectSubnav />
                {
                    interfaces && (() => {
                        if (interfaces.hasOwnProperty(queryData.projectId)) {
                            const {items} = interfaces[queryData.projectId];
                            if (this.state.envStatus) {
                                items.map((item, index) => {
                                    if (item.groupId !== -2) interfacesAllItems.push(item);
                                });
                                interfacesAllItems.map((item, index) => {
                                    if (item.history.length > 0) {
                                        let addItem = true;
                                        for (let i = 0; i < item.history.length; i++) {
                                            let history = item.history[i];
                                            if (history.envStatus === this.state.envStatus) {
                                                addItem = false;
                                                interfacesAjaxItems.push(item);
                                                break;
                                            }
                                        }
                                        if (addItem) interfacesItems.push(item);
                                    } else {
                                        interfacesItems.push(item);
                                    }
                                });
                            }
                            interfacesItemsPagination = {
                                total: interfacesItems.length,
                                pageSize: 5
                            }
                        }

                        return (<div className="apiTest" style={{'left': groupCmp.width}}>
                            <div className="buttons clearfix">
                                <Button icon="left"
                                        onClick={this.backApiList.bind(this)}>接口列表</Button>
                                <Button icon="rocket" type="primary"
                                        onClick={this.batchRequest.bind(this, interfacesAjaxItems)}>批量请求接口</Button>
                                <div className="request">
                                    <Select value={this.state.request}
                                            onChange={this.testSelect_changeHandler.bind(this)}>
                                        <Option value="http">http</Option>
                                        <Option value="https">https</Option>
                                    </Select>
                                </div>
                                <EnvSelecter onSubmitUrl={this.handleReturnUrl.bind(this)} {...this.props}/>
                            </div>
                            <div className="apiPtest-main">
                                <div className='apiPtest-progress'
                                     style={{display: this.state.interfacesPercent === 0 ? 'none' : 'block'}}>
                                    <h3 >当前进度 ：</h3>
                                    <Progress percent={this.state.interfacesPercent}/>
                                    <span
                                        className='progress-tips'>{this.state.interfacesPercent == 100 ? '已完成' : this.state.request + '://' + this.state.envStatus + '/' + this.state.progressUrl}</span>
                                </div>
                                <div className="apiPtest-request"
                                     style={{display: this.state.interfacesPercent === 0 ? 'none' : 'block'}}>
                                    <h3>测试结果</h3>
                                    <Table
                                        dataSource={ this.state.requestArr }
                                        columns={ this.state.requestColumns}
                                        bordered={true}
                                        onRowClick={this.showApiInfo_clickHandler.bind(this)}
                                    />
                                </div>
                                <div className="apiPtest-unasked">
                                    <h3>无测试记录</h3>
                                    <Table
                                        dataSource={ interfacesItems }
                                        columns={ this.state.unaskedColumns}
                                        bordered={true}
                                        pagination={interfacesItemsPagination}
                                        rowKey="_id"
                                    />
                                </div>
                            </div>
                        </div>)
                    })()
                }
            </div>
        );
    }
}
