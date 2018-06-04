/**
 * Created by VULCAN on 2017/8/18.
 */
import React from 'react';
import {Table, Button, Modal, Select, message, Progress, Collapse, Tag, Card, Row, Col} from 'antd';
import {Link} from 'react-router-dom';
import {paramsFormat} from '~common/http';
import ProjectSubnav from "~components/common/ProjectSubnav";
import EnvSelecter from '~components/project/EnvSelecter';
import Utils from '~utils';
import ArrayUtils from '~utils/arrayUtils';
import {API_HOST} from '~constants/api-host';
import {useCaseAlert} from '~components/project/useCaseAlert';
import Request from '~common/project/request';
import JsonEditorBox from "~components/project/JsonEditorBox";
import ApiTestLogin from "~components/project/ApiTestLogin/index";
import _ from 'lodash';
import * as ajax from '~lib/ajax';

class ApiPtestContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            useCaseColumns: [{
                title: '用例名称',
                dataIndex: 'name',
                render: (text, record, index) => (
                    <div>
                        {record.history[record.index].useCase.name}
                    </div>
                )
            },
                {
                    title: '接口名称',
                    dataIndex: 'featureName',
                    render: (text, record, index) => (
                        <div>
                            {record.featureName}
                        </div>
                    )
                },
                {
                    title: '接口地址',
                    dataIndex: 'url',
                    render: (text, record, index) => (
                        <div className="featureName">
                            {record.history[record.index].options.url}
                        </div>
                    )
                },
                {
                    title: '操作',
                    width: '330px',
                    render: (obj) => {
                        return (<div>
                            <Button onClick={this.props.changeUseCase.bind(this, obj, obj.index, this)}
                                    icon="edit" style={{marginLeft: '50px'}}>修改断言</Button>
                            <Button
                                onClick={this.props.addPtestCheck.bind(this, obj, obj.index, 0, this)}
                                icon="delete" type="danger" style={{marginLeft: '50px'}}>删除</Button>
                        </div>);
                    },
                }
            ],
            requestColumns: [{
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
            unit: 'all',
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

    /**
     *  初始化 jsonEditor
     **/
    componentDidUpdate() {
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
    testSelect_changeHandler(type, val) {
        if (type === 'http') {
            this.setState({request: val})
        } else {
            this.setState({unit: val})
        }
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
        let loginData = this.refs.apiTestLogin.getLoginData(); //登录信息数据
        item.history.forEach((data, index) => {
            if (data.envStatus === this.state.envStatus) options = Utils.copy(data.options);
        })
        this.state.ajaxEnvStatus = this.state.envStatus;

        if(!options.header) options.header={}
        if(!options.params) options.params={}

        Request.formateForRequestHead( options.header, loginData);
        Request.formateHFRequestParame(options.params, loginData);

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
        let progressUrl = item.URI;
        this.state.percent++;
        let interfacesPercent = parseInt((this.state.percent / this.state.interfacesTotalLength) * 100);
        this.setState({progressUrl, interfacesPercent})
        this.againBatchRequest(interfacesAjaxItems);
        this.isUseCaseSucccess(item, interfacesAjaxItems);
    }

    /**
     * 判断断言是否正确
     **/
    isUseCaseSucccess(item, interfacesAjaxItems) {
        let requestArr = this.state.requestArr;
        let useCases = item.history[item.index].useCase.useCases;
        item.error = [];
        useCases.forEach((data, index) => {
            let reparam = {};
            let param = data.param;
            let paramType = '';
            this.queryUseCase(item.data, param, reparam);
            let {value} = reparam;
            if (item.dataStatus === 0) item.error.push('接口访问失败');
            if (value === undefined ) {
                item.error.push('返回内容中没有找到'+ param);
            }else {
                switch (data.type) {
                    case 'int':
                    case 'long':
                        Utils.isNumber(value) ? paramType = 'number' : item.error.push(param + '不是数字类型');
                        break;
                    case 'string':
                        Utils.isString(value) ? paramType = 'string' : item.error.push(param + '不是字符串类型');
                        break;
                    case 'object':
                        Utils.isObject(value) ? paramType = 'object' : item.error.push(param + '不是对象类型');
                        break;
                    case 'array':
                        ArrayUtils.isArray(value) ? paramType = 'array' : item.error.push(param + '不是数组类型');
                        break;
                    default:
                        break;
                }
                switch (data.judge) {
                    case 'equal':
                        if (paramType === 'number' || paramType === 'string') {
                            if (value.toString() !== data.value.toString()) {
                                item.error.push(param + '不等于' + data.value);
                            }
                        } else if (paramType === 'object' || paramType === 'array') {
                            try {
                                if (!_.isEqual(value, JSON.parse(data.value))) {
                                    item.error.push(param + '不等于' + data.value);
                                }
                            } catch (e) {
                                item.error.push(param + '不等于' + data.value);
                            }
                        }
                        break;
                    case 'big':
                        if (paramType === 'number') {
                            if (value <= data.value) item.error.push(param + '不大于' + data.value);
                        } else {
                            item.error.push(param + '不大于' + data.value);
                        }
                        break;
                    case 'min':
                        if (paramType === 'number') {
                            if (value >= data.value) item.error.push(param + '不小于' + data.value);
                        } else {
                            item.error.push(param + '不大于' + data.value);
                        }
                        break;
                    case 'contain':
                        if (paramType === 'array' || paramType === 'object') {
                            if (JSON.stringify(value).indexOf(data.value) === -1) {
                                item.error.push(param + '不包含' + data.value);
                            }
                        } else if (paramType === 'string') {
                            if (value.indexOf(data.value) === -1) {
                                item.error.push(param + '不包含' + data.value);
                            }
                        } else {
                            item.error.push(param + '不包含' + data.value);
                        }
                        break;
                    default:
                        break;
                }
            }

        })

        if (item.error.length > 0) {
            requestArr.push(item);
            this.setState({requestArr});
        }
    }

    /**
     * 匹配断言字段
     **/
    queryUseCase(data, param, reparam) {
        _.forIn(data, (value, key) => {
            if (key === param) return reparam.value = value;
            if (Utils.isObject(value)) {
                this.downQueryUseCase(value, param, reparam);
            } else if (ArrayUtils.isArray(value)) {
                value.forEach((all, index) => {
                    if (Utils.isObject(all)) {
                        this.downQueryUseCase(value, param, reparam);
                    }
                    if (all === param) return reparam.value = value;
                })
            }
        })
    }

    /**
     * 向下循环queryUseCase
     **/
    downQueryUseCase(data, param, reparam) {
        this.queryUseCase(data, param, reparam);
    }


    render() {
        const {groupCmp} = this.props.global;
        const {interfaces} = this.props.entity;
        const Panel = Collapse.Panel;
        const queryData = this.state.queryData = Utils.parseUrlToData(this.props.location.search);
        const Option = Select.Option;
        let interfacesAllItems = [];
        let interfacesAjaxItems = [];
        let interfacesItemsPagination;
        let unitOption = [];
        if (this.state.jsoneditor) {
            this.state.jsoneditor.set(this.state.jsoneditorJson)
        }
        if (this.refs.json1) {
            this.refs.json1.setEditorSuc(this.state.requestArr[0].data)
        }
        return (
            <div>
                <ProjectSubnav {...this.props} />
                {
                    interfaces && (() => {
                        if (interfaces.hasOwnProperty(queryData.projectId)) {
                            const {items} = interfaces[queryData.projectId];
                            if (this.state.envStatus) {
                                items.map((item, index) => {
                                    if (item.groupId !== -2) interfacesAllItems.push(item);
                                });
                                interfacesAllItems.map((item, index) => {
                                    if (ArrayUtils.isArray(item.history) && item.history.length > 0) {
                                        item.history.forEach((history, i) => {
                                            if (history.envStatus === this.state.envStatus && history.addPtest) {
                                                let obj = Utils.copy(item);
                                                obj.key = new Date().getTime() + Math.random();
                                                obj.index = i;
                                                if (_.findIndex(unitOption, o => o.props.value === history.useCase.unit) === -1) {
                                                    unitOption.push(<Option value={history.useCase.unit}
                                                                            key={index + 1}>
                                                        {history.useCase.unit}
                                                    </Option>)
                                                }
                                                if (this.state.unit === 'all') {
                                                    interfacesAjaxItems.push(obj);
                                                } else if (this.state.unit === history.useCase.unit) {
                                                    interfacesAjaxItems.push(obj);
                                                }
                                            }
                                        })
                                    }
                                });
                            }
                            interfacesItemsPagination = {
                                total: interfacesAjaxItems.length,
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
                                            onChange={this.testSelect_changeHandler.bind(this, 'http')}>
                                        <Option value="http">http</Option>
                                        <Option value="https">https</Option>
                                    </Select>
                                </div>
                                <div className="unit">
                                    <Select value={this.state.unit}
                                            onChange={this.testSelect_changeHandler.bind(this, 'unit')}>
                                        <Option value="all" key='0'>全部</Option>
                                        {unitOption}
                                    </Select>
                                </div>
                                <EnvSelecter onSubmitUrl={this.handleReturnUrl.bind(this)} {...this.props}/>
                            </div>
                            <div className="apiPtest-main">
                                <ApiTestLogin ref="apiTestLogin" {...this.props}/>
                                <div className='apiPtest-progress'
                                     style={{display: this.state.interfacesPercent === 0 ? 'none' : 'block'}}>
                                    <h3 >当前进度 ：</h3>
                                    <Progress percent={this.state.interfacesPercent}/>
                                    <span
                                        className='progress-tips'>{this.state.interfacesPercent == 100 ? '已完成' : this.state.request + '://' + this.state.envStatus + '/' + this.state.progressUrl}</span>
                                </div>
                                <div className="apiPtest-useCase">
                                    <h3>需测试列表</h3>
                                    <Table
                                        dataSource={ interfacesAjaxItems }
                                        columns={ this.state.useCaseColumns}
                                        bordered={true}
                                        pagination={interfacesItemsPagination}
                                    />
                                </div>
                                <div style={{paddingBottom: '50px'}}>

                                    <Tag className='noPoint' color="green" style={{marginBottom: '20px'}}>返回结果</Tag>
                                    <Collapse defaultActiveKey={['1']}>{
                                        this.state.requestArr.length > 0 && (() => this.state.requestArr.map((val, index) => (
                                            <Panel header={val.history[val.index].useCase.name} key={"res" + index}>
                                                <Row>
                                                    <Col span={12}>
                                                        <div style={{borderRight: '1px dashed #1DA57A'}}>
                                                            <JsonEditorBox successResult={val.data}/>
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div style={{background: '#ECECEC'}}>
                                                            <Card title="测试未通过原因" bordered={false} noHovering={true}>
                                                                {(() => val.error.length > 0 && val.error.map((item, itemIndex) => (
                                                                    <p key={'item' + itemIndex}
                                                                       style={{'color': '#FA5555'}}>{(itemIndex + 1) + '. ' + item}</p>)))()}
                                                            </Card>
                                                        </div>
                                                    </Col>
                                                </Row>


                                            </Panel>
                                        )))()
                                    }
                                    </Collapse>
                                </div>
                            </div>
                        </div>)
                    })()
                }
            </div>
        );
    }
}

export default useCaseAlert()(ApiPtestContainer)