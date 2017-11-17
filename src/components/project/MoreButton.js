/**
 * Created by VULCAN on 2017/11/9.
 */
import React from 'react';
import {Button, Popconfirm} from 'antd';
import {paramsFormat} from '~common/http';
import Utils from '~utils';
import _ from 'lodash';

export default class MoreButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            moreShow: false,
            queryData: '',
            adminId: '',
            userId: ''
        }
    }

    // 跳转回api列表页
    backApiList() {
        this.props.history.push(this.pathAddress('list'));
    }

    /**
     * 跳转修改页
     **/
    goToEdit() {
        this.props.history.push(this.pathAddress('edit'));
    }

    /**
     * 跳转路径地址
     **/
    pathAddress(position) {
        const projectId = this.state.queryData.projectId;
        let str = '';
        if (this.props.delete) {
            str = `/project/code/${position}?projectId=${projectId}&groupId=-1`;
            str = position === 'list' ? str : str + `&codeId=${this.state.queryData.codeId}`;
        } else {
            str = `/project/api/${position}?projectId=${projectId}&groupId=-1`;
            str = position === 'list' ? str : str + `&apiId=${this.state.queryData.apiId}`;
        }
        return str;
    }

    /**
     * 更多下面的按钮显示
     **/
    moreShow() {
        this.moreHideDiv.style.display = 'block';
    }

    /**
     * 更多下面的按钮隐藏
     **/
    moreHide() {
        this.moreHideDiv.style.display = 'none';
    }

    /**
     * 删除此条api信息
     **/
    deleteApi(item) {
        if (item.groupId === -2) {
            this.props.fetchDelInterface(paramsFormat({
                id: item._id,
                projectId: this.state.queryData.projectId
            }))
        } else {
            if (this.props.delete) {
                this.props.fetchDelInterface(paramsFormat({
                    id: item._id,
                    projectId: this.state.queryData.projectId
                }))
            } else {
                this.props.fetchUpdateAddInterface(paramsFormat({
                    id: item._id,
                    projectId: this.state.queryData.projectId,
                    groupId: -2
                }));
            }
        }
        this.backApiList();
    }

    /**
     * 恢复按钮
     **/
    recovery(item) {
        this.props.fetchUpdateAddInterface(paramsFormat({
            id: item._id,
            projectId: this.state.queryData.projectId,
            groupId: -1,
            enable: item.enable,
            dataType: item.dataType,
            host: item.host || '',
            URI: item.URI,
            featureName: item.featureName,
            params: item.params,
            returnData: item.returnData,
            remark: item.remark
        }));
        this.backApiList();
    }

    /**
     * 判断是否显示彻底删除按钮
     **/
    deleteBtnShow() {
        return (this.state.adminId && this.state.userId && this.state.adminId === this.state.userId);
    }

    render() {
        const {projects} = this.props.entity;
        const queryData = this.state.queryData = Utils.parseUrlToData(this.props.location.search);
        const item = this.props.item;
        const that = this;
        this.state.userId = this.props.user.userId;
        if (projects) {
            this.state.adminId = (_.filter(projects['items'], ['_id', queryData.projectId]))[0].admin;
        }
        let more = '';

        return (
            <div>
                {
                    projects && (() => {
                        const projectsItems = projects.items;
                        projectsItems.map((obj) => {
                            if (queryData.projectId === obj._id) {
                                let hfApiUserInfo = that.props.user;
                                for (let i = 0; i < obj.cooperGroup.length; i++) {
                                    let cooperGroup = obj.cooperGroup[i];
                                    if (cooperGroup === hfApiUserInfo.userId) {
                                        that.state.moreShow = true;
                                        break;
                                    }
                                }
                            }
                        });
                        if (parseInt(item.groupId) === -2) {
                            more = (<div className="more" onMouseEnter={this.moreShow.bind(this)}
                                         onMouseLeave={this.moreHide.bind(this)}
                                         ref={more => this.more = more}>
                                <Button icon="bars">更多</Button>
                                <div className="more-hide" ref={moreHideDiv => this.moreHideDiv = moreHideDiv}>
                                    <Button icon="reload"
                                            onClick={this.recovery.bind(this, item)}>恢复</Button>
                                    <Popconfirm placement="rightTop" title='确认删除'
                                                onConfirm={this.deleteApi.bind(this, item)}
                                                okText="Yes" cancelText="No">
                                        <Button icon="delete"
                                                style={{display: this.deleteBtnShow()? 'inline-block' : "none"}}
                                        >彻底删除</Button>
                                    </Popconfirm>

                                </div>
                            </div>);
                        } else {
                            more = (<div className="more" onMouseEnter={this.moreShow.bind(this)}
                                         onMouseLeave={this.moreHide.bind(this)}
                                         ref={more => this.more = more}>
                                <Button icon="bars">更多</Button>
                                <div className="more-hide" ref={moreHideDiv => this.moreHideDiv = moreHideDiv}>
                                    <Button icon="edit"
                                            onClick={this.goToEdit.bind(this)}>修改</Button>
                                    <Popconfirm placement="rightTop" title='确认删除'
                                                onConfirm={this.deleteApi.bind(this, item)}
                                                okText="Yes" cancelText="No">
                                        <Button icon="delete"
                                                style={{display: (!this.props.delete || (this.deleteBtnShow())) ? 'inline-block' : "none"}}
                                        >删除</Button>
                                    </Popconfirm>

                                </div>
                            </div>);
                        }
                    })()
                }
                {this.state.moreShow ? more : ''}
            </div>
        )

    }
}