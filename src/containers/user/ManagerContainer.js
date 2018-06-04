/**
 * Created by lichunwei on 2017/8/4.
 */

import React from 'react';
import {paramsFormat} from '~common/http';
import Utils from '~utils'
import {Button, Table, Card, Popconfirm, message, Input} from 'antd';


export default class ManagerContainer extends React.Component {
    constructor(props) {
        super(props);

        const rest_text = '确定重置这个用户吗?';
        const del_text = '确定删除这个用户吗?';

        this.state = {
            tableColumns: [
                {
                    title: '用户账号',
                    dataIndex: 'username',
                    sorter: (a, b) => a.userName.length - b.userName.length,
                },
                {
                    title: '注册时间',
                    dataIndex: 'regTime',
                    render: (value) => {
                        if (value) {
                            return Utils.formatDate(new Date(parseInt(value)))
                        }
                        return "";
                    }
                },
                {
                    title: '登陆时间',
                    dataIndex: 'loginTime',
                    render: (value) => {
                        if (value) {
                            return Utils.formatDate(new Date(parseInt(value)))
                        }
                        return "";
                    }
                },
                {
                    title: '操作',
                    render: (obj) => {
                        return <div>
                            <Popconfirm placement="topLeft" title={rest_text}
                                        onConfirm={this.confirm_handler.bind(this, "reset", obj._id)} okText="Yes"
                                        cancelText="No">
                                <Button icon="edit">重置密码</Button>
                            </Popconfirm>
                            <Popconfirm placement="topLeft" title={del_text}
                                        onConfirm={this.confirm_handler.bind(this, "delete", obj._id)} okText="Yes"
                                        cancelText="No">
                                <Button icon="delete" type="danger">删除</Button>
                            </Popconfirm>
                        </div>
                    },
                }
            ],//表格的数据结构
            search: ''
        }
    }

    /**
     * 删除、重置用户操作
     * @param operaType
     * @param userId
     */
    confirm_handler(operaType, userId) {
        if (operaType === 'reset') {
            this.props.fetchResetUser(paramsFormat({userId}));
        } else {
            this.props.fetchDelUser(paramsFormat({userId}), () => {
                message.success('删除成功!');
            });
        }
    }

    /**
     * 给搜索输入框 绑定事件 赋值
     **/
    InputSearch_changeHandler(event) {
        this.setState({search: event.target.value});
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {users} = this.props.entity;
        return (
            <div>
                <Card title="用户管理列表" className='userList'>
                    {
                        users && (() => {
                            let dataSource = null;
                            const {items} = users;
                            items.map((obj) => {
                                obj.key = obj._id;
                            });

                            if (!this.state.search) {
                                dataSource = items;
                            } else {
                                dataSource = [];
                                items.forEach((data, index) => {
                                    if (data.username.indexOf(this.state.search) > -1) {
                                        dataSource.push(data);
                                    }
                                })
                            }


                            return (<div className="user-c-admin-box">
                                    <div className="search">
                                        搜索用户：<Input value={this.state.search}
                                                    onChange={this.InputSearch_changeHandler.bind(this)}/>
                                    </div>
                                    <Table dataSource={ dataSource} columns={ this.state.tableColumns}
                                    />
                                </div>
                            )
                        })()
                    }
                </Card>
            </div>
        );
    }
}




