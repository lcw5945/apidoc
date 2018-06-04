/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import Utils from '~utils/index';
import {paramsFormat} from '~common/http';
import Local from '~utils/local';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as groupActions from '~actions/group';
import * as globalActions from '~actions/global';
import Dialog from '~components/common/Dialog';
import {project_searchApi_key, project_searchCode_key} from '~constants/persist-config'
import {ProjectUserAuth} from '~components/project/ProjectUserAuthority';
import {Icon, Modal, Input, notification, Message, Select, Button} from 'antd';
const Option = Select.Option;

class ProjectSubnav extends React.Component {
    constructor(props) {
        super(props);
        this.searchTimer = null
        this.localkey = ''
        if(props.type === 'api'){
            this.localkey = project_searchApi_key
        }else if(props.type === 'statecode'){
            this.localkey = project_searchCode_key
        }

        this.state = {
            subNav_list: [],
            width: '240px',
            nav_info: '接口',
            titleWord: '分组',
            group_status: 'interface', // api code dataBase
            group_editBox_displayCount: -1,
            projectNavStatus: 'none', //block : 打开 ； none : 关闭
            pathName: '',
            NavBg: '',
            add_visible: false,
            addInputVal: '',
            modalTitle: '新增分组',
            queryData: Utils.parseUrlToData(window.location.search), //包含 databaseId projectId
            groupId: '',
            searchContentList: [] // 搜索内容列表
        }
    }

    /*
     * 从localstorage中得到搜索框缓存的内容
     */
    getLocalSearchContent() {
        let key = this.localkey;
        if(!key){
            return
        }
        this.setState({
            searchContentList: JSON.parse(Local.getItem(key)) || []
        })
    }

    /*
     * 设置localstorage中搜索框缓存的内容
     */
    setLocalSearchContent(searchConent) {
        let key = this.localkey;
        if(!searchConent || !key){
            return
        }

        let searchContentList = JSON.parse(Local.getItem(key)) || []
        let index = searchContentList.indexOf(searchConent)

        if (index > -1) {
            searchContentList.splice(index, 1)
        }
        searchContentList.unshift(searchConent)
        if(searchContentList.length > 10){
            searchContentList = searchContentList.slice(0,10)
        }
        this.setState({
            searchContentList
        })
        Local.setItem(key, JSON.stringify(searchContentList))

    }



    componentWillMount() {
        let databaseId = this.state.queryData.databaseId || '';
        let projectId = this.state.queryData.projectId || '';
        let items = [];
        let jurisdiction = false;
        let tempID = databaseId || projectId;

        this.getLocalSearchContent()

        if (!this.props.entity['groups'] || !this.props.entity['groups'][tempID] || this.props.entity['groups'][tempID].didInvalidate) {
            this.props.fetchGroupCheckList(paramsFormat({databaseId, projectId}));
        }

        const {projects, databases} = this.props.entity;

        // this.props.groupClear(); //清除下 初始状态

        let user = this.props.user.proUserAuth || {};
        if (user.authority > 0) {
            jurisdiction = true;
        }
        if (window.location.pathname.indexOf('api') > -1) {

            this.setState({
                nav_info: '接口',
                group_status: 'interface',
                titleWord: '分组',
                pathName: '/project/api/list?projectId=' + projectId + '&groupId=',
                jurisdiction
            })

        } else if (window.location.pathname.indexOf('code') > -1) {

            this.setState({
                nav_info: '状态码',
                group_status: 'scode',
                titleWord: '分组',
                pathName: '/project/code/list?projectId=' + projectId + '&groupId=',
                jurisdiction
            })
        } else if (window.location.pathname.indexOf('database') > -1) {

            this.setState({
                nav_info: '表',
                titleWord: '表',
                group_status: 'database',
                pathName: '/database/list?databaseId=' + databaseId + '&groupId=',
                jurisdiction
            })
        }

    }

    changeNavWidth() {

        let navWidth = '240px'
        let projectNavStatus = 'none'
        if (this.state.width === '240px') {
            navWidth = '40px'
            projectNavStatus = 'block'
        }
        this.setState({
            width: navWidth,
            projectNavStatus
        })
        this.props.groupResize(navWidth);
    }

    search_changeHander(value) {
        this.props.groupSearch(value);
        clearTimeout(this.searchTimer)
        this.searchTimer = setTimeout(()=>{
            this.setLocalSearchContent(value)
        },2000)
    }

    changeNavBg_clickHandler(groupIdCount, e) {
        /*if (groupIdCount == -1) {
         this.props.groupSearch('');
         }*/
        this.setState({
            NavBg: groupIdCount
        })
    }

    /**
     *  错误 弹出框
     *  */
    showConfirm(data) {
        const confirm = Modal.confirm;
        const fetchDelGroup = this.props.fetchDelGroup;
        let _this = this;
        confirm({
            title: '删除' + this.state.titleWord,
            content: '确认删除？',
            onOk() {
                fetchDelGroup(paramsFormat({
                    id: data._id,
                    databaseId: data.databaseId,
                    projectId: data.projectId
                }), (data) => {
                });
            },
            onCancel() {
            }
        });
    }

    /**
     *  icon 鼠标点击 弹出修改删除
     *  */
    iconAlert_clickHandler(index) {
        this.setState({
            group_editBox_displayCount: index
        })
    }

    /**
     *  icon 鼠标移除 隐藏修改删除
     *  */
    group_editBoxHide_mouseLeaveHandler() {
        this.setState({
            group_editBox_displayCount: -1
        })
    }

    /**
     *  添加按钮 弹出框 出现
     *  */
    add_modalBoxShow_clickHandler(pageType, data) {

        let grounpId,
            name,
            databaseId = this.state.queryData.databaseId || '',
            projectId = this.state.queryData.projectId || '',
            type = this.state.group_status || 'interface';

        if (pageType == 'eidt') {
            grounpId = data._id;
            name = data.addInputVal;
        }

        this.refs.getDialog.confirm({
            title: (pageType == 'eidt' ? '修改' : '新增') + this.state.titleWord,
            content: <div>
                <span>{this.state.titleWord}名 ：</span>
                <Input maxLength="32" defalutValue={name} id="navInputVal"
                       placeholder="1 ~ 32 位字符串"
                       prefix={<Icon type="file" style={{fontSize: 13}}/>}
                       style={{fontSize: 13, marginTop: '10px'}}/>

            </div>,
            onOk: () => {

                let name = Utils.getValueById("navInputVal");

                if (!name || name.length < 1 || name.length > 32) {
                    Message.error("请输入1-32的" + this.state.titleWord + "名称");
                    return false;
                }

                let opt = {databaseId, projectId, name, type}
                if (grounpId) {
                    opt.id = grounpId
                }

                this.props.fetchUpdateAddGroup(paramsFormat(opt), (data) => {
                    Utils.setValueById("navInputVal", "");
                });

            },
            onCancel: () => {
                Utils.setValueById("navInputVal", "");
            }

        })


    }

    /**
     * 删除 组
     */
    delGroup_clickHandler(data) {
        this.showConfirm(data)
    }


    /**
     *  处理数据
     *  */
    dealData() {
        const queryData = this.state.queryData;
        const {groups} = this.props.entity;
        let data = [];
        try {
            if (groups[queryData.projectId] || groups[queryData.databaseId]) {
                let groupData = groups[queryData.projectId] || groups[queryData.databaseId];

                data = _.filter(groupData['items'], ['type', this.state.group_status]);
            }
        } catch (e) {

        }

        return data;
    }


    render() {
        let groupData = this.dealData();
        const queryData = this.state.queryData;
        const {groupCmp} = this.props.global;
        let searchConent = groupCmp.searchConent;
        let recycle_dataBtn_display = this.state.group_status === 'interface' ? 'block' : 'none';
        let SubnavClass = this.state.group_status === 'database' ? 'dabaseClass ProjectSubnav' : 'ProjectSubnav';
        let asideTitle = this.state.titleWord;
        let NavBg = this.state.NavBg || queryData.groupId
        if (groupData[0] && this.state.group_status === 'database') {
            NavBg = groupData[0]['_id']
        }

        const options = !searchConent?this.state.searchContentList.map(d => <Option key={d}>{d}</Option>):''

        return (
            <div className={SubnavClass} style={{'width': this.state.width}}>

                <header onClick={this.changeNavWidth.bind(this)}>●●●</header>

                <div className="closeMb" style={{'display': this.state.projectNavStatus}}></div>
                <div className="searchBox">

                    <Select
                        mode="combobox"
                        value={searchConent}
                        placeholder={this.props.type === 'api'?'搜索接口名称、uri、tag、负责人':"请输入搜索内容"}
                        style={{width: 220}}
                        defaultActiveFirstOption={false}
                        allowClear={true}
                        showArrow={false}
                        filterOption={false}
                        onChange={this.search_changeHander.bind(this)}
                    >
                        {options}
                    </Select>
                </div>
                <aside>
                    <div className='asideTitleBox'>
                        <span className='asideTitle'>{asideTitle}</span>
                        <span className='aside_addBtn' style={{'display': this.state.jurisdiction ? 'block' : 'none'}}
                              onClick={this.add_modalBoxShow_clickHandler.bind(this, 'add')}>
                            <Icon type="plus" className='addIcon'/>
                            添加
                        </span>
                    </div>
                    <div className="asideBox">
                        <div className="asideCont">
                            <Link to={this.state.pathName + '-1'}
                                  style={{display: this.state.group_status === 'database' ? 'none' : 'block'}}>
                                <div className="all_dataBtn"
                                     onClick={this.changeNavBg_clickHandler.bind(this, '-1')}
                                     style={{'background': NavBg === '-1' ? '#f7f7f7' : ''}}>
                                    <Icon type="bars"/>
                                    <span>所有{this.state.nav_info}</span>
                                </div>
                            </Link>
                            <Link to={this.state.pathName + '-2'}>
                                <div className="recycle_dataBtn"
                                     onClick={this.changeNavBg_clickHandler.bind(this, '-2')}
                                     style={{
                                         display: recycle_dataBtn_display,
                                         'background': NavBg === '-2' ? '#f7f7f7' : ''
                                     }}>
                                    <Icon type="delete"/>
                                    <span>接口回收站</span>
                                </div>
                            </Link>
                            <div className='api_group'>
                                {
                                    groupData && (() => {
                                        return (
                                            groupData.map((data, index) => {
                                                return (
                                                    <Link key={'ProjectSubnav-' + data._id}
                                                          to={this.state.pathName + data._id}>
                                                        <div className="group_name"
                                                             onClick={this.changeNavBg_clickHandler.bind(this, data._id)}
                                                             style={{'background': NavBg === data._id ? '#f7f7f7' : ''}}>
                                                            <span className='group_name_title'
                                                                  title={data.name}>{data.name}</span>
                                                            <Icon type="bars" className='group_icon'
                                                                  style={{'display': this.state.jurisdiction ? 'block' : 'none'}}
                                                                  onClick={this.iconAlert_clickHandler.bind(this, index)}/>
                                                            <div className='group_editBox'
                                                                 onMouseLeave={this.group_editBoxHide_mouseLeaveHandler.bind(this)}
                                                                 style={{'display': this.state.group_editBox_displayCount === index && this.state.jurisdiction ? 'block' : 'none'}}>
                                                                <div className='group_editBtn group_btn'
                                                                     onClick={this.add_modalBoxShow_clickHandler.bind(this, 'eidt', data)}>
                                                                    修改
                                                                </div>
                                                                <div className='group_delBtn group_btn'
                                                                     onClick={this.delGroup_clickHandler.bind(this, data)}>
                                                                    删除
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>

                                                )
                                            })
                                        )
                                    })()
                                }
                            </div>
                        </div>
                    </div>
                </aside>

                <Dialog ref="getDialog"></Dialog>

            </div>
        )
    }
}
ProjectSubnav.propTypes = {
    // fetchDelInterface:PropTypes.any.isRequired
};

export default connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...groupActions}, dispatch)
)(ProjectUserAuth(ProjectSubnav))