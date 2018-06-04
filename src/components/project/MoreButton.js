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
            str = `/project/code/${position}?projectId=${projectId}&groupId=${this.state.queryData.groupId}`;
            str = position === 'list' ? str : str + `&codeId=${this.state.queryData.codeId}`;
        } else {
            str = `/project/api/${position}?projectId=${projectId}&groupId=${this.state.queryData.groupId}`;
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
            let ary = _.filter(projects['items'], ['_id', queryData.projectId])
            if(ary.length>0)
            this.state.adminId = ary[0].admin;
        }
        let more = '';

        return (
            <div>
                {
                    projects && (() => {

                        let user = that.props.user.proUserAuth||{};

                        console.log("MoreButton------------------->",that.props);


                        //如果父组件是状态码，并且权限是接口权限， 显示按钮  如果如果父组件是接口，mock权限和接口权限 均显示，
                        if ((this.props.compType == 'code' && user.authority > 0)  ||(this.props.compType != 'code' && user.authority >= 0)  ) {
                            that.state.moreShow = true;
                        }


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
                                    <Popconfirm placement="rightTop" title='确定将此接口移入回收站吗？'
                                                onConfirm={this.deleteApi.bind(this, item)}
                                                okText="Yes" cancelText="No">
                                        <Button icon="delete"
                                                style={{display: user.authority ? 'inline-block' : "none"}}
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
};