/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import jsoneditor from 'jsoneditor'
import {Table, Button, Select, Popconfirm, Tag} from 'antd';
import {paramsFormat} from '~common/http';
import Utils from '~utils'
import  ProjectSubnav  from '~components/common/ProjectSubnav';
import MoreButton from "~components/project/MoreButton";
import JsonEditorBox from "~components/project/JsonEditorBox";
import JsonMockBox from "~components/project/JsonMockBox";
import {ProjectUserAuth} from '~components/project/ProjectUserAuthority';

class ApiDetailContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SubnavWidth: '240px',   //左边菜单栏的宽度
            queryData: {},  //URL携带的参数
            successResult: {},
            errorResult: {},
            mockResult:{},
            remarkHtml: '',
            paramsColumns: [
                {
                    title: '请求',
                    dataIndex: 'request',
                    render: (text, record, index) => (
                        <div className="request">
                            <div className="request-index">{index + 1}</div>
                            {
                                record.require.toString() === "0" ? <div className="request-value gray">选填</div> :
                                    <Tag className='noPoint' color="green">
                                        <div className="request-value">必填</div>
                                    </Tag>
                            }
                        </div>
                    )
                },
                {
                    title: '参数',
                    dataIndex: 'parameter',
                    render: (text, record) => (
                        <div className="parameter" style={{textIndent: record.i * 10 + 'px'}}>
                            <div className="parameter-key">{record.key}</div>
                            <div className="parameter-dec">{record.des}</div>
                        </div>
                    )
                },
                {
                    title: '参数类型',
                    dataIndex: 'parameType',
                    render: (text, record) => (
                        <div className="parameType">
                            <div className="parameType-value">{record.type}</div>
                        </div>
                    )
                },
                {
                    title: '值可能性',
                    dataIndex: 'key',
                    className: 'requestTable-key',
                    render: (text, record) => (
                        <div className="key">
                            {
                                record.value.map((valueCont, index) =>
                                    (<div key={index} className="key-index">
                                        <span>{index + 1}</span>
                                        {valueCont.valueCont}
                                    </div>)
                                )
                            }
                        </div>
                    )
                },
                {
                    title: '值说明',
                    dataIndex: 'explain',
                    render: (text, record) => (
                        <div className="explain">
                            {
                                record.value.map((valueCont, index) =>
                                    (<div key={index} className="explain-index">
                                        {valueCont.valueDes}
                                    </div>)
                                )
                            }
                        </div>
                    )
                },
            ],
            returnDataColumns: [
                {
                    title: '返回',
                    dataIndex: 'include',
                    render: (text, record, index) => {
                        if (!record.require) record.require = record.include
                        return (<div className="request">
                            <div className="request-index">{index + 1}</div>
                            {
                                record.require.toString() === "0" ? <div className="request-value gray">非必含</div> :
                                    <Tag className='noPoint' color="green">
                                        <div className="request-value">必含</div>
                                    </Tag>
                            }
                        </div>)
                    }
                },
                {
                    title: '字段',
                    dataIndex: 'parameter',
                    render: (text, record) => {
                        if (!record.key) record.key = record.returnDataKey
                        if (!record.des) record.des = record.returnDataDes
                        return (<div className="parameter" style={{textIndent: record.i * 10 + 'px'}}>
                                <div className="parameter-key">{record.key}</div>
                                <div className="parameter-dec">{record.des}</div>
                            </div>)
                    }
                },
                {
                    title: '字段类型',
                    dataIndex: 'parameType',
                    render: (text, record) => {
                        if(!record.type) record.type = 'string'
                        return (<div className="parameType">
                                <div className="parameType-value">{record.type}</div>
                            </div>)
                    }
                },
                {
                    title: '值可能性',
                    dataIndex: 'key',
                    className: 'requestTable-key',
                    render: (text, record) => {
                        if (!record.value)  record.value = []
                        return (<div className="key">
                            {
                                record.value.map((valueCont, index) =>
                                    (<div key={index} className="key-index">
                                        <span>{index + 1}</span>
                                        {valueCont.valueCont}
                                    </div>)
                                )
                            }
                        </div>)
                    }
                },
                {
                    title: '值说明',
                    dataIndex: 'explain',
                    render: (text, record) => {
                        if (!record.value)  record.value = []
                        return (<div className="explain">
                            {
                                record.value.map((valueCont, index) =>
                                    (<div key={index} className="explain-index">
                                        {valueCont.valueDes}
                                    </div>)
                                )
                            }
                        </div>)
                    }
                },
            ],
        }
    }
    /*
    * websoct 时，动态改变数据
    * */
    componentDidUpdate() {
        if (this.remarks) this.remarks.innerHTML = this.state.remarkHtml;
    }
    /*
     * 页面渲染完毕，改变数据
     * */
    componentDidMount() {
        if (this.remarks) this.remarks.innerHTML = this.state.remarkHtml;
    }

    // 跳转回api列表页
    backApiList() {
       this.props.history.push(`/project/api/list?projectId=${this.state.queryData.projectId}&groupId=${this.state.queryData.groupId}&from=idetail`);
    }

    // 跳转测试页
    goToTest() {
        this.props.history.push(`/project/api/test?projectId=${this.state.queryData.projectId}&groupId=${this.state.queryData.groupId}&apiId=${this.state.queryData.apiId}`);
    }

    /**
     * 复制数组
     **/
    cloneArr(params) {
        let i = 0;
        let dataSource = [];
        this.forParams(params, dataSource, i);
        return dataSource;
    }

    /**
     * 遍历params
     **/
    forParams(params, dataSource, i) {
        params.forEach((param, index) => {
            dataSource.push(Object.assign({}, param, {i}));
            if (param.subParams && param.subParams.length > 0) {
                this.forArr(param.subParams, dataSource, i);
            }
        })
    }

    /**
     * 遍历subParams
     **/
    forArr(params, dataSource, i) {
        i++;
        this.forParams(params, dataSource, i);
    }


    render() {

        const {groupCmp} = this.props.global;
        const {interfaces} = this.props.entity;
        const queryData = this.state.queryData = Utils.parseUrlToData(this.props.location.search);
        const Option = Select.Option;
        let item = {};
        let enable = '';
        let active = '';
        let dataSource = [];
        let returnDataSource = [];


        return (
            <div>
                <ProjectSubnav {...this.props} />
                {
                    interfaces && (() => {
                        if (interfaces.hasOwnProperty(queryData.projectId)) {
                            const {items} = interfaces[queryData.projectId];

                            // 查找本页面的数据
                            items.map((obj) => {
                                if (obj._id === queryData.apiId) {
                                    item = Utils.copy(obj);
                                    return;
                                }
                            });
                            // 为Table组件添加key值
                            if (item.params) {
                                dataSource = this.cloneArr(item.params);
                                dataSource.forEach((param, index) => {
                                    param['forKey'] = index;
                                })
                            }
                            if (item.returnData) {
                                returnDataSource = this.cloneArr(item.returnData);
                                returnDataSource.forEach((param, index) => {
                                    param['forKey'] = index;
                                })
                            }
                            if (item.apiJson) {
                                this.state.successResult = item.apiJson.successResult
                                this.state.errorResult = item.apiJson.errorResult
                                this.state.mockResult = item.apiJson.mockResult
                            }
                            if (item.remark) {
                                this.state.remarkHtml = item.remark;
                            }

                            if (parseInt(item.enable) === 0) {
                                enable = '弃用';
                            } else if (parseInt(item.enable) === 1) {
                                enable = '启用';
                            } else if (parseInt(item.enable) === 2) {
                                enable = '维护';
                            }
                            if (parseInt(item.active) === 0) {
                                active = '未激活';
                            } else if (parseInt(item.active) === 1) {
                                active = '激活';
                            } else {
                                active = '激活';
                            }
                        }
                        return (
                            <div className="apiDetail" style={{'marginLeft': groupCmp.width}}>
                                <div className="buttons clearfix">
                                    <Button icon="left"
                                            onClick={this.backApiList.bind(this)}>接口列表</Button>
                                    <Button type="primary" icon="info-circle">详情</Button>
                                    <Button icon="caret-right" onClick={this.goToTest.bind(this)}>测试</Button>

                                    <MoreButton {...this.props} item={item}/>

                                </div>
                                <div className="apiDetail-main">
                                    <div className="top-show clearfix">
                                        <div className="top-show-state">{ enable }</div>
                                        <div className="top-show-state">{ active }</div>
                                        <div className="top-show-small">
                                            <div className="top-show-protocol">HTTP</div>
                                            <div className="top-show-dataType">{  item.dataType }</div>
                                        </div>
                                        <ul className="top-show-ul">
                                            <li className="top-show-ul-li">{ (item.host || "") + item.URI }</li>
                                            <li>{ item.featureName }</li>
                                        </ul>
                                        <ul className="right-ul">
                                            <li className="top-show-ul-li" >{ Utils.formatDate(new Date(parseInt(item.update))) }</li>
                                            <li >
                                                {item.manager}
                                            </li>
                                        </ul>

                                    </div>
                                    <div className="requestTable">
                                        <Table dataSource={dataSource} columns={this.state.paramsColumns}
                                               size="small" pagination={false} rowKey="forKey"/>
                                    </div>
                                    <JsonEditorBox successResult={this.state.successResult}
                                                   errorResult={this.state.errorResult}
                                                   mode="show"
                                    />

                                    <JsonMockBox mockResult={this.state.mockResult}
                                                 mode="show"
                                                />

                                    <div className="requestTable">
                                        <Table dataSource={returnDataSource} columns={this.state.returnDataColumns}
                                               size="small" pagination={false} rowKey="forKey"/>
                                    </div>
                                    <div className="remarks quill">
                                        <div className="remarks-title">备注</div>
                                        <div className="ql-container ql-snow">
                                            <div className="remarks-content ql-editor"
                                                 ref={remarks => this.remarks = remarks}>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })()
                }
            </div>
        );
    }

}

export default ProjectUserAuth(ApiDetailContainer)



