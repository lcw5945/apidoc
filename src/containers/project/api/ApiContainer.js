/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {Table, Button, Modal, Input, Tag, Popconfirm, notification} from 'antd';
import {Link} from 'react-router-dom';
import {paramsFormat} from '~common/http';
import Utils from '~utils';
import _ from 'lodash';
import {wapper} from '~containers/WapperContainer';
import {ProjectUserAuth} from '~components/project/ProjectUserAuthority';


class ApiContainer extends React.Component {
    constructor(props) {
        super(props);
        let that = this;

        this.state = {
            tableColumns: [
                {
                    title: '接口名称',
                    dataIndex: 'featureName',
                    sorter: (a, b) => a.featureName.length - b.featureName.length,
                },
                {
                    title: '接口URI',
                    render: (obj) => {
                        return <div>
                            <Tag className='noPoint' style={{background: '#4caf50', color: '#fff'}}>{obj.dataType}</Tag>
                            {obj.URI}
                        </div>
                    }
                },
                {
                    title: 'Tag名称',
                    align:'center',
                    render: (obj) => {
                        if(obj.tag){
                            return obj.tag
                        }else {
                            return '无'
                        }
                    }
                },
                {
                    title: '激活状态',
                    align:'center',
                    render: (obj) => {
                        if(obj.active == 1){
                            return <Tag className='noPoint' style={{background: '#11a86f', color: '#fff'}}>激活</Tag>
                        }else {
                            return <Tag className='noPoint' style={{background: '#a8a7a0', color: '#fff'}}>未激活</Tag>
                        }
                    }
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
                    dataIndex: 'update',
                    sorter: (a, b) => a.update - b.update,
                    render: (value) => {
                        if (value) {
                            return Utils.formatDate(new Date(parseInt(value)))
                        }
                        return "";
                    }
                },
                {
                    title: '负责人',
                    align:'center',
                    render: (obj) => {
                        if(obj.manager){
                            return obj.manager
                        }else {
                            return '无'
                        }
                    }
                },
                {
                    title: '操作',
                    render: (obj) => {
                        let user = that.props.user.proUserAuth || {};
                        // Log.debug('------------>');
                        // Log.debug(that.props.user);
                        if (user.authority > 0) { //0 mock权限 2接口权限 只有接口权限显示
                            return (
                                <div>
                                    <div style={{display: String(obj.groupId) !== '-2' ? 'block' : 'none'}}>
                                        <Button icon="copy"
                                                onClick={this.setCopyDate.bind(this, obj)}
                                                style={{display: user.authority ? 'inline' : 'none'}}>拷贝</Button>
                                        <Button icon="edit"
                                                onClick={this.getUpdateDialog.bind(this, obj.projectId, obj._id, 'edit')}>修改</Button>
                                        <Popconfirm title="确定将此接口移入回收站吗？" okText="确定" cancelText="取消"
                                                    onConfirm={this.dialog_deleteApi.bind(this, obj.key, 'recyle')}>
                                            <Button icon="delete" type="danger"
                                                    style={{display: user.authority ? 'inline' : 'none'}}
                                                    onClick={this.deleteHandle.bind(this)}>删除</Button>
                                        </Popconfirm>
                                    </div>

                                    <div style={{display: String(obj.groupId) === '-2' ? 'block' : 'none'}}>
                                        <Button icon="reload"
                                                onClick={this.getUpdateDialog.bind(this, obj.projectId, obj._id, '')}>恢复</Button>
                                        <Popconfirm title="确定彻底删除此接口吗？" okText="确定" cancelText="取消"
                                                    onConfirm={this.dialog_deleteApi.bind(this, obj.key, 'del')}>
                                            <Button icon="delete" type="danger"
                                                    style={{display: (this.state.adminId && this.state.userId && this.state.adminId === this.state.userId) ? 'inline-block' : "none"}}
                                                    onClick={this.deleteHandle.bind(this)}>彻底删除</Button>
                                        </Popconfirm>
                                    </div>
                                </div>
                            )
                        }
                        return (<div></div>);
                    },
                }
            ],//表格的数据结构
            // dialog_delete_visible: false,   //是否显示删除对话框
            dialog_managerEvn_visible: false,
            // deleteId: 0, //删除的接口Id
            queryData: {},  //URL携带的参数
            dataToJSON: {},//存储json数据
            apiId: '',
            adminId: '',//项目创建者ID
            userId: '',//当前用户的ID
            modalVisible: false,
            disabled: true,
            current: this.setTableCurrent(),
        }

    }

    /**
     * 设置当前的页数
     * */
    setTableCurrent() {
        let qd = Utils.parseUrlToData(this.props.location.search);
        if (qd.from == 'idetail') {
            let pageStatus = this.props.global.interfaceCmp.pageStatus[qd.projectId] || {};
            if (pageStatus.pageNo) {
                return pageStatus.pageNo;
            }
        }
        return 1;
    }

    /**
     * 获取状态码组的列表
     * */
    getGroupList() {
        const queryData = this.state.queryData = Utils.parseUrlToData(this.props.location.search);
        const {groups} = this.props.entity;
        const {items} = groups[queryData.projectId] || [];
        const groupsList = _.filter(items, ['type', 'interface']);

        return groupsList;
    }

    /**
     * 点击拷贝按钮
     * */
    setCopyDate(obj, event) {
        event.stopPropagation();
        event.preventDefault();
        let dataList = Utils.copy(obj);
        this.setState({
            modalVisible: true
        });
        try {
            delete dataList._id;
            dataList.featureName = dataList.featureName + '[副本]';
            this.props.fetchUpdateAddInterface(paramsFormat(dataList), (data) => {
                this.setState({
                    apiId: data._id,
                    disabled: false
                });
            });
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * 弹窗点击事件
     * */
    modalClickHandle(type) {
        if (type == 'ok') {
            this.props.history.push(`/project/api/edit?projectId=${ this.state.queryData.projectId}&groupId=-1&apiId=${this.state.apiId}`)
        }
        this.setState({
            modalVisible: false
        })
    }

    /**
     * 进入接口的详情页
     * */
    goInterfaceDetail(record, index, event) {
        this.props.interfaceDetail(record)

        let pageStatus = this.props.global.interfaceCmp.pageStatus || {};
        let groupId = this.state.queryData["groupId"];
        pageStatus[record.projectId] = {
            groupId,
            pageNo: this.state.current
        }

        this.props.projectPageStatus(pageStatus);

        this.props.history.push(`/project/api/details?projectId=${record.projectId}&groupId=${groupId}&apiId=${record._id}`)
    }

    /**
     * 进入接口的修改页
     * */
    getUpdateDialog(projectId, apiId, type, event) {
        event.stopPropagation();
        event.preventDefault();
        if (type === 'edit') {
            let groupId = this.state.queryData["groupId"]||-1;
            this.props.history.push(`/project/api/edit?projectId=${projectId}&groupId=${groupId}&apiId=${apiId}`)
        } else {
            let opt = {
                id: apiId,
                groupId: -1,
                projectId: this.state.queryData.projectId
            };
            this.props.fetchUpdateAddInterface(paramsFormat(opt), (data) => {
                notification.success({
                    message: '恢复成功'
                });
            });
        }

    }

    /**
     * 删除按钮点击阻止冒泡
     * */
    deleteHandle(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    /**
     * dialog - 删除接口对话框的按钮事件
     * OK：删除接口
     * */
    dialog_deleteApi(result, type) {
        if (type == 'del') {
            this.props.fetchDelInterface(paramsFormat({
                id: result,
                projectId: this.state.queryData.projectId
            }), () => {
                // this.openNotificationWithIcon('success','已加入回收站！');
            });
        } else {
            let opt = {
                id: result,
                groupId: -2,
                projectId: this.state.queryData.projectId
            };
            this.props.fetchUpdateAddInterface(paramsFormat(opt), (data) => {
                notification.success({
                    message: '删除成功'
                });
            });
        }


    }

    changeTable(pagination, filters, sorter) {

        this.setState({
            current: pagination.current
        })

    }


    render() {
        const queryData = this.state.queryData = Utils.parseUrlToData(this.props.location.search);
        const {interfaces} = this.props.entity;
        const {projects} = this.props.entity;
        const {groupCmp} = this.props.global;
        let groupId = this.state.queryData.groupId;
        let searchConent = groupCmp.searchConent;
        const cooperGroup = [];
        this.state.dataToJSON = this.props.entity;
        this.state.userId = this.props.user.userId;
        if (projects) {
            this.state.adminId = (_.filter(projects['items'], ['_id', queryData.projectId]))[0].admin;
        }

        return (
            <div className='api-container'>
                {
                    interfaces && projects && (() => {
                        let dataSource = [];
                        let {items} = projects;


                        items.map((obj) => {
                            if (obj._id  && queryData.projectId === obj._id) {
                                cooperGroup.push(...obj.cooperGroup);
                            }
                        });




                        if (interfaces.hasOwnProperty(queryData.projectId)) {
                            let items = interfaces[queryData.projectId]['items'] || [];

                            items = _.filter(items, function (_data) {
                                if ( _data.URI && _data._id) {
                                    return true;
                                }
                            });

                            let itemList = [];

                            if (groupId === '-1') {
                                items.forEach((item) => {
                                    if (String(item.groupId) !== '-2') {
                                        itemList.push(item)
                                    }
                                })
                            } else {
                                items.forEach((item) => {
                                    if (String(item.groupId) == groupId) {
                                        itemList.push(item)
                                    }
                                })
                            }
                            if (searchConent) {
                                {/*不区分大小写查询*/}
                                searchConent = searchConent.toLowerCase()
                                itemList = _.filter(itemList, function (_data) {
                                    if (_data.featureName.toLowerCase().indexOf(searchConent) > -1
                                        || _data.URI.toLowerCase().indexOf(searchConent) > -1
                                        || _data.tag&&_data.tag.toLowerCase().indexOf(searchConent) > -1
                                        || _data.manager&&_data.manager.toLowerCase().indexOf(searchConent) > -1) {
                                        return true;
                                    }
                                });
                            }
                            itemList.map((obj) => {
                                obj.key = obj._id;
                                obj.cooperGroup = cooperGroup;
                            });
                            dataSource = itemList;

                        }

                        return (<Table dataSource={ dataSource}
                                       columns={ this.state.tableColumns}
                                       pagination={{pageSize: 10, current: this.state.current}}
                                       onRowClick={this.goInterfaceDetail.bind(this)}
                                       onChange={this.changeTable.bind(this)}
                        />)
                    })()
                }

                <Modal
                    maskClosable={false}
                    visible={this.state.modalVisible}
                    title='提示'
                    width={400}
                    onCancel={this.modalClickHandle.bind(this, 'cancel')}
                    footer={[
                        <Button key="back" size="large"
                                onClick={this.modalClickHandle.bind(this, 'cancel')}>取消</Button>,
                        <Button key="submit" type="primary" size="large" disabled={this.state.disabled}
                                onClick={this.modalClickHandle.bind(this, 'ok')}>
                            确定
                        </Button>,
                    ]}
                >
                    确定现在修改拷贝的接口吗？
                </Modal>
            </div>
        );
    }

    componentWillUnmount(){
    }

}

export default wapper('api')(ProjectUserAuth(ApiContainer))




