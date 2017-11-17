/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import jsoneditor from 'jsoneditor'
import {Table, Button, Select, Popconfirm, Tag} from 'antd';
import {paramsFormat} from '~common/http';
import Utils from '~utils'
import _ from 'lodash'
import  ProjectSubnav  from '~components/common/ProjectSubnav';
import MoreButton from "~components/project/MoreButton";
import JsonEditorBox from "~components/project/JsonEditorBox";


export default class CodeDetailContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queryData: {},  //URL携带的参数
            tableColumns: [
                {
                    title: '状态码',
                    dataIndex: 'stateCode',
                    render: (text, record, index) => (
                        <div className="stateCode">
                            {record.scode}
                        </div>
                    )
                },
                {
                    title: '类型',
                    dataIndex: 'type',
                    key: 'type',
                },
                {
                    title: '描述',
                    dataIndex: 'description',
                    key: 'description',
                    className: 'description'
                },
                {
                    title: '分组',
                    dataIndex: 'groupId',
                    key: 'groupId',
                    render: (data) => {
                        let groupsList = this.getGroupList();
                        const groupName = _.filter(groupsList, ['_id', data]);
                        return groupName[0] ? groupName[0].name : '无';
                    },
                }
            ],
            successResult: {},
            paramListColumns: [
                {
                    title: '字段名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '字段类型',
                    dataIndex: 'type',
                    key: 'type',
                },
                {
                    title: '字段说明',
                    dataIndex: 'des',
                    key: 'des',
                    className: 'description'
                },
            ],
            remarkHtml: ''
        }
    }

    componentDidUpdate() {
        if (this.remarks) this.remarks.innerHTML = this.state.remarkHtml;
    }

    // 跳转回api列表页
    backApiList() {
        this.props.history.push(`/project/code/list?projectId=${this.state.queryData.projectId}&groupId=-1`);
    }

    /**
     * 获取状态码组的列表
     * */
    getGroupList() {
        const queryData = this.state.queryData = Utils.parseUrlToData(this.props.location.search);
        const {groups} = this.props.entity;
        let groupsList = [];
        try {
            const {items} = groups[queryData.projectId] || [];
            groupsList = _.filter(items, ['type', 'scode']);
        } catch (e) {
        }
        return groupsList;
    }

    render() {
        const {groupCmp} = this.props.global;
        const {statecodes} = this.props.entity;
        const queryData = this.state.queryData = Utils.parseUrlToData(this.props.location.search);
        let item = {};
        let dataSource = [];
        let lastTime = '';

        return (
            <div>
                <ProjectSubnav />
                {
                    statecodes && (() => {
                        if (statecodes.hasOwnProperty(queryData.projectId)) {
                            const {items} = statecodes[queryData.projectId];
                            // 查找本页面的数据
                            items.map((obj) => {
                                if (obj._id === queryData.codeId) {
                                    item = Utils.copy(obj);
                                    return;
                                }
                            });
                            if (item.lastTime) {
                                lastTime = <div
                                    className="last-time">{Utils.formatDate(new Date(parseInt(item.lastTime)))}</div>
                            }
                            // 为Table组件添加key值
                            if (item.json) {
                                this.state.successResult = item.json;
                            }
                            if (item.paramList) {
                                item.paramList.forEach((param, index) => {
                                    param['forKey'] = index;
                                })
                            }
                            if (item.remark) {
                                this.state.remarkHtml = item.remark;
                            }
                            dataSource.push(item);
                            dataSource.forEach((param, index) => {
                                param['forKey'] = index;
                            })
                        }
                        return (
                            <div className="codeDetail" style={{'marginLeft': groupCmp.width}}>
                                <div className="buttons clearfix">
                                    <Button icon="left"
                                            onClick={this.backApiList.bind(this)}>状态码列表</Button>
                                    <Button type="primary" icon="info-circle">详情</Button>
                                    <MoreButton {...this.props} item={item} delete={true}/>
                                    {lastTime}
                                </div>
                                <div className="codeDetail-main">
                                    <div className="requestTable">
                                        <Table dataSource={dataSource} columns={this.state.tableColumns}
                                               size="small" pagination={false} rowKey="forKey"/>
                                    </div>
                                    <JsonEditorBox title='代码样例' successResult={this.state.successResult}/>
                                    <div className="requestTable">
                                        <Table dataSource={item.paramList} columns={this.state.paramListColumns}
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



