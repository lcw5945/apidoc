/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react'
import {Link} from 'react-router-dom'
import _ from 'lodash'
import {Table, Button, Modal, Input, Form, Select, message, Popconfirm, notification} from 'antd'
import {paramsFormat} from '~common/http'
import {wapper} from '../../WapperContainer';
import Utils from '~utils/index'
import {ProjectUserAuth} from '~components/project/ProjectUserAuthority';

class CodeContainer extends React.Component {
    constructor(props) {
        super(props);
        let that = this;
        this.state = {
            updateCode_dialog: false, //是否显示更新/添加对话框
            queryData: {},  //URL携带的参数
            UpdateCodeId: 0, //修改的ID
            stateCodeGroup: '',//状态码分组ID
            groupsList: [],//状态码分组
            dataToJSON: {},//存储json数据
            stateCodeContent: {
                scode: 0,
                description: '',
                groupId: '-1'
            },
            tableColumns: [
                {
                    title: '状态码',
                    dataIndex: 'scode',
                    key: 'scode',
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
                },
                {
                    title: '更新时间',
                    dataIndex: 'lastTime',
                    render: (value) => {
                        if (value) {
                            return Utils.formatDate(new Date(parseInt(value)))
                        }
                        return "";
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (data) => {

                        let user = that.props.user.proUserAuth||{};

                        if (user.authority > 0) { //0 mock权限 2接口权限 只有接口权限显示
                            return (
                                <div>
                                    <Button icon="copy"  onClick={this.setCopyDate.bind(this,data)}>拷贝</Button>
                                    <Button icon="edit" onClick={this.getUpdateDialog.bind(this, data)}>修改</Button>
                                    <Popconfirm title="确定删除此状态码吗？" okText="确定" cancelText="取消"
                                                onConfirm={this.codeDel.bind(this, data)}>
                                        <Button icon="delete" type="danger"
                                                onClick={this.deleteHandle.bind(this)}>删除</Button>
                                    </Popconfirm>
                                </div>
                            )
                        }


                        return (<div></div>);
                    },
                },
            ],
            codeId:'',
            adminId: '',//项目创建者ID
            userId: ''//当前用户的ID
        }
    }
    /**
     * 点击拷贝按钮
     * */
    setCopyDate(obj,event){
        event.stopPropagation();
        event.preventDefault();
        let dataList = Utils.copy(obj);
        this.setState({
            modalVisible:true
        });
        try {
            delete dataList._id;
            dataList.scode = dataList.scode + '[副本]';
            this.props.fetchUpdateAddStateCode(paramsFormat(dataList), (data) => {
                this.setState({
                    codeId:data._id,
                    disabled:false
                });
            });
        } catch (e) {
            console.log(e)
        }
    }
    /**
     * 弹窗点击事件
     * */
    modalClickHandle(type){
        if(type == 'ok'){
            this.props.history.push(`/project/code/edit?projectId=${ this.state.queryData.projectId}&groupId=-1&codeId=${this.state.codeId}`)
        }
        this.setState({
            modalVisible:false
        })
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

    /**
     * 进入状态吗详情页
     **/
    gostateCodeDetail(record, index, event) {
        this.props.history.push(`/project/code/details?projectId=${record.projectId}&groupId=${record.groupId}&codeId=${record._id}`)
    }

    /**
     * 修改状态码
     **/
    getUpdateDialog(data, event) {
        event.stopPropagation();
        event.preventDefault();
        this.props.history.push(`/project/code/edit?projectId=${data.projectId}&groupId=${data.groupId}&codeId=${data._id}`)
    }

    /**
     * 删除按钮点击阻止冒泡
     * */
    deleteHandle(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    /**
     * 删除状态码对话框的按钮事件
     * OK：删除
     * */
    codeDel(data) {
        this.props.fetchDelStateCode(paramsFormat({id: data._id, projectId: this.state.queryData.projectId}))
    }

    /**
     *  处理数据
     *  */
    getItemsData(queryData) {
        const {statecodes} = this.props.entity;

        let items = [];
        try {
            if (statecodes[queryData.projectId]) {
                let codeData = statecodes[queryData.projectId];
                items = codeData['items'];
            }
        } catch (e) {
        }
        return items;
    }

    render() {
        const queryData = this.state.queryData = Utils.parseUrlToData(this.props.location.search);
        let items = this.getItemsData(queryData);
        this.state.dataToJSON = this.props.entity;
        const {groupCmp} = this.props.global;
        const {projects} = this.props.entity;
        const cooperGroup = [];
        let groupListId = this.state.queryData.groupId;
        let searchConent = groupCmp.searchConent;
        this.state.userId = this.props.user.userId;
        if (projects) {
            this.state.adminId = (_.filter(projects['items'], ['_id', queryData.projectId]))[0].admin;
        }

        return (
            <div className="code-container">
                {
                    items && projects && (() => {

                        if (groupListId != "-1" && groupListId != "-2") {
                            items = _.filter(items, ['groupId', groupListId]);
                        }
                        const projectsItems = projects.items;
                        projectsItems.map((obj) => {
                            if (queryData.projectId === obj._id) {
                                cooperGroup.push(...obj.cooperGroup);
                            }
                        });
                        items = _.filter(items, function (_data) {
                            if (_data._id) {
                                return true;
                            }
                        });
                        if (searchConent) {
                            searchConent = searchConent.toLowerCase()
                            items = _.filter(items, function (_data) {
                                if (_data.scode.toLowerCase().indexOf(searchConent) > -1 || _data.description.toLowerCase().indexOf(searchConent) > -1) {
                                    return true;
                                }
                            });
                        }
                        items.map((obj) => {
                            obj.cooperGroup = cooperGroup;
                            obj.key = obj._id;
                        });

                        return (<Table dataSource={ items } columns={this.state.tableColumns}
                                       pagination={{pageSize: 10}}
                                       onRowClick={this.gostateCodeDetail.bind(this)}/>)
                    })()
                }

                <Modal
                    maskClosable={false}
                    visible={this.state.modalVisible}
                    title='提示'
                    width={400}
                    onCancel={this.modalClickHandle.bind(this,'cancel')}
                    footer={[
                        <Button key="back" size="large" onClick={this.modalClickHandle.bind(this,'cancel')}>取消</Button>,
                        <Button key="submit" type="primary" size="large" disabled={this.state.disabled} onClick={this.modalClickHandle.bind(this,'ok')}>
                            确定
                        </Button>,
                    ]}
                >
                    确定现在修改拷贝的状态码吗？
                </Modal>
            </div>
        )
    }
}

export default wapper('statecode')(ProjectUserAuth(CodeContainer))