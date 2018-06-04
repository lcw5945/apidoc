/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {Table, Button, Modal, Input, Message, Popconfirm, Tag} from 'antd';
import {paramsFormat} from '~common/http';
import Utils from '~utils';
import  Dialog  from '~components/common/Dialog';

export default class DatabaseContainer extends React.Component {

    constructor() {
        super();
        let that = this;
        this.state = {
            columns: [
                {
                    title: '数据库名称',
                    dataIndex: 'name',
                    key: 'name',
                }, {
                    title: '版本号',
                    dataIndex: 'version',
                    key: 'version',
                    render: (text) => {
                        return <Tag className='noPoint' color="#82d886">{text}</Tag>
                    }
                }, {
                    title: '数据库最后修改时间',
                    dataIndex: 'lastTime',
                    key: 'lastTime',
                    sorter: (a, b) => Number(b) - Number(a),
                    sortOrder: true,
                    render: (text, record) => {
                        return Utils.formatDate(new Date(parseInt(record.lastTime)));
                    }
                }, {
                    title: '操作',
                    dataIndex: 'action',
                    key: 'action',
                    render: (text, record) => {
                        let hfApiUserInfo = that.props.user;
                        if (record.admin === hfApiUserInfo.userId || hfApiUserInfo.authority > 2) {
                            return (
                                <div>
                                    <Button size="small" icon="edit"
                                            onClick={this.editHandle.bind(this, record, 'edit')}>修改</Button>
                                    <Popconfirm title='确定删除' okText="Yes" cancelText="No" placement="rightTop"
                                                onConfirm={this.deletePopconfirmHandle.bind(this, record)}>
                                        <Button size="small" icon="delete"
                                                onClick={this.deleteHandle.bind(this, record)}>删除</Button>
                                    </Popconfirm>
                                </div>
                            )
                        } else {
                            return;
                        }

                    }
                }
            ],
            addDataSource: {
                name: '示例',
                version: '1.0',
            },
        }
    }

    // 修改项目
    editHandle(dataSource, pageType, event) {

        event.stopPropagation();
        event.preventDefault();
        let _this = this;

        this.refs.getDialog.confirm({
            title: pageType == 'add' ? '增加数据库' : '修改数据库',
            content: <div>
                <p>数据库名称：</p>
                <Input defaultValue={dataSource.name} id="dataSourceName"/>
                <p>版本号：</p>
                <Input defaultValue={dataSource.version} id="dataSourceHv"/>
            </div>,
            onOk() {
                dataSource.name = document.getElementById('dataSourceName').value;
                dataSource.version = document.getElementById('dataSourceHv').value;

                if (!dataSource.name) {
                    Message.error("请输入数据库名称");
                    return false;
                }
                if (!dataSource.version) {
                    Message.error("请输入版本号");
                    return false;
                }

                let hf_api_userInfo = _this.props.user;

                let params = {
                    name: dataSource.name,
                    version: dataSource.version,
                    type: dataSource.type,
                };

                if (dataSource.key) {
                    params.id = dataSource.key
                }

                _this.props.fetchUpdateAddDatabase(paramsFormat(params));
            },
            onCancel() {
            },
        });
    }

    // 删除项目提示框
    deleteHandle(data, event) {
        event.stopPropagation();
        event.preventDefault();
    }

    // 删除项目
    deletePopconfirmHandle(data, event) {
        event.stopPropagation();
        event.preventDefault();
        this.props.fetchDatabase(paramsFormat({id: data.key}))
    }

    // 跳转api列表页
    goApiList(record, index, event) {
        let _id = record._id;
        this.props.history.push("/database/list?databaseId=" + _id + "&groupId=-1");
    }

    render() {

        const {databases} = this.props.entity;
        let pagination = {};
        if (databases) {
            pagination = {
                total: databases.items.length,
                pageSize: 5
            }
        }

        return (
            <div>
                <div className="ProjectList">
                    <Dialog ref="getDialog"/>
                    <div className="buttons">
                        <Button type="primary" icon="plus"
                                onClick={this.editHandle.bind(this, this.state.addDataSource, 'add')}>新增数据库</Button>
                    </div>
                    {
                        databases && (() => {
                            const {items} = databases;
                            items.map((obj) => {
                                return obj.key = obj._id
                            });

                            return (<Table dataSource={items} columns={this.state.columns}
                                           onRowClick={this.goApiList.bind(this)} pagination={pagination}/>)
                        })()
                    }

                </div>
            </div>
        );

    }

}