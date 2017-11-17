/**
 * Created by Cray on 2017/8/9.
 */
import React from 'react';
import {Table, Button, Modal, Input ,Form,Icon,Popconfirm,Popover,message,notification} from 'antd';
import {Link} from 'react-router-dom';
import {paramsFormat} from '~common/http';
import Utils from '~utils';
import * as Api from '~api/user';
import _ from 'lodash';
import  ProjectSubnav  from '~components/common/ProjectSubnav';

function onSelect(value) {
    console.log('onSelect', value);
}

function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
}

@Form.create({})
export const wapper = (type) => (WrappedComponent) => class HOContainer extends React.Component {
    static displayName = `HOContainer(${getDisplayName(WrappedComponent)})`

    constructor(props) {
        super(props);
        this.state = {
            popVisible:false,//下拉列表显隐
            cooperationVisible:false,//协作弹窗显隐
            options:[],//下拉列表数据
            queryData:{},//地址参数
            cooperationArr:[],//协作成员列表数据
            adminId:'',//创建者ID
            adminName:'',//创建者昵称
            isAdmin:false,//是否是创建者
            jurisdiction:false,//是否有权限
            projectData:{},//project数据
            searchData:{},//搜索到的用户数据
            inputValue:'',//搜索框value
        }
    }

    /**
     * 导出state的entity为json文件
     * */
    getDataToJson(name){
        // 创建隐藏的可下载链接
        let eleLink = document.createElement('a');
        eleLink.download = name + '.json';
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        let blob;
        if(name==='api'){
            blob = new Blob([JSON.stringify(this.refs.apiCpm.state.dataToJSON)]);
        }else {
            blob = new Blob([JSON.stringify(this.refs.codeCmp.state.dataToJSON)]);
        }

        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    }

    /**
     * 添加状态码
     * @param data
     * @param event
     */
    getUpdateDialog(data,event){
        this.refs.codeCmp.getUpdateDialog(data,event);
    }

    /**
     * 显示协作管理窗口
     * */
    cooperationManage(){
        let _this = this;
        let items  = this.state.projectData;
        if(items.length > 0){
           Api.getMulUser(paramsFormat({ids:_.toString(items[0]['cooperGroup'])})).then(function (data) {
                let _data = data;
                let adminObj = _.filter(_data,['_id',items[0].admin]);
                _this.setState({
                    cooperationArr:_.pullAllBy(_data,[{'_id': items[0].admin}],'_id' ),
                    adminName:adminObj[0].username,
                });
            });
        }
        this.setState({
            cooperationVisible:true
        });
        setTimeout(function () {
            if(document.getElementById('searchInput')){
                document.getElementById('searchInput').setAttribute("autocomplete","off");
            }
        },1000)

    }

    /**
     * 隐藏协作管理窗口
     * **/
    hideCooperation(){
        this.setState({
            cooperationVisible:false,
            popVisible:false,
            inputValue:''
        });
    }

    /**
     * 搜索用户
     * */
    handleSearch(e){
        e.stopPropagation();
        e.preventDefault();
        let value = this.state.inputValue;
        let options;
        let _this = this;

        if(value && value.indexOf(" ")==-1){
            Api.searchRegistUsers(paramsFormat({username:value})).then(function (data) {
                if(data.length > 0){
                    options = data.map((obj) => {
                        return <span className='optionList' key={obj._id}>{obj.username}<Button className='addCooperation' onClick={_this.addCooperation.bind(_this,obj._id)}>添加</Button></span>;
                    });
                }else {
                    options = <span className='optionList'><b>未搜索到任何用户</b></span>
                }

                _this.setState({
                    options,
                    popVisible:true,
                    searchData:data,
                });
            });
        }else {
            _this.setState({
                popVisible:false,
            });
        }
    }

    /**
     * 搜索框无内容隐藏下拉框
     * **/
    inputChange(e){
        let value = e.target.value;
        if(value === ''){
            this.setState({
                popVisible:false,
            });
        }
        this.setState({
            inputValue:e.target.value
        });
    }
    /**
     * 添加协作者
     * */
    addCooperation(data){
        let _this = this;
        if(data !== this.state.adminId){
            this.props.fetchAddCooper(paramsFormat({projectId:this.state.queryData.projectId,useId:data}),function (_data) {
                document.getElementById('searchInput').value = "";
                let newData = _this.state.cooperationArr;
                newData.push((_.filter(_this.state.searchData, ['_id', data]))[0]);
                _this.setState({
                    popVisible:false,
                    cooperationArr:newData,
                });
            });
        }else {
            message.error('不能添加自己为协作者');
        }
    }

    /**
     * 删除协作者
     * **/
    delCooperation(data){
        let _this = this;
        this.props.fetchDelCooper(paramsFormat({projectId:this.state.queryData.projectId,useId:data}),function (_data) {
            let newData = _.pullAllBy(_this.state.cooperationArr,[{'_id': data}],'_id');
            _this.setState({
                cooperationArr:newData,
            });
        });
    }

    /**
     *  处理数据
     *  */
    getItemsData() {
        const queryData =  Utils.parseUrlToData(this.props.location.search);
        const {projects} = this.props.entity;
        let items = [];
        try{
            items = _.filter(projects['items'],['_id', queryData.projectId]);
        }catch (e){}

        return items;
    }


    /**
     * 渲染Dom
     * @returns {XML}
     */
    render() {
        const items = this.state.projectData = this.getItemsData();
        const queryData = this.state.queryData =  Utils.parseUrlToData(this.props.location.search);
        const { groupCmp } = this.props.global;
        const {getFieldDecorator} = this.props.form;
        const FormItem = Form.Item;

        if(items.length>0){
            this.state.jurisdiction = _.includes(items[0]['cooperGroup'], this.props.user.userId) ? true : false;
            if(this.props.user.userId === items[0].admin){
                this.state.isAdmin = true;
                this.state.adminId = items[0].admin;
            }
        }

        let bodyHtml = '';
        if (type === 'api') {
            bodyHtml = <div className="apiList" style={{'marginLeft': groupCmp.width}}>
                <div className="buttons">
                    <Link to={"/project/api/edit?projectId=" + queryData.projectId + "&groupId=-1&apiId=-1"} style={{'display':this.state.jurisdiction ? 'inline-block':'none'}}>
                        <Button type="primary" icon="plus">添加接口</Button></Link>
                    <Button type="primary" icon="team" onClick={this.cooperationManage.bind(this)}>协作管理</Button>
                    <Button type="primary" icon="export" onClick={this.getDataToJson.bind(this,'api')}>导出项目</Button>
                    <Link to={"/project/api/ptest?projectId=" + queryData.projectId + ""} ><Button
                        type="primary" icon="rocket">接口批量测试</Button></Link>
                </div>
                <WrappedComponent ref="apiCpm" {...this.props}/>
            </div>
        } else if (type === 'statecode') {
            bodyHtml = <div className="codeList" style={{'marginLeft': groupCmp.width}}>
                <div className="buttons">
                    <Link to={"/project/code/edit?projectId=" + queryData.projectId + "&groupId=-1&codeId=-1"} style={{'display':this.state.jurisdiction ? 'inline-block':'none'}}>
                        <Button type="primary" icon="plus">添加状态码</Button></Link>
                    {/*<Button style={{'display':this.state.jurisdiction ? 'inline-block':'none'}} type="primary" icon="plus" onClick={this.getUpdateDialog.bind(this,null)}>添加状态码</Button>*/}
                    <Button type="primary" icon="team" onClick={this.cooperationManage.bind(this)}>协作管理</Button>
                    <Button type="primary" icon="cloud-download-o" onClick={this.getDataToJson.bind(this,'statecode')}>导出项目</Button>
                </div>
                <WrappedComponent ref="codeCmp" {...this.props}/>
            </div>
        }
        return <div>
            <ProjectSubnav/>
            <Modal
                className='cooperationDialog'
                maskClosable={false}
                visible={this.state.cooperationVisible}
                title='协作成员'
                onCancel={this.hideCooperation.bind(this)}
            >
                <Form style={{display:this.state.isAdmin ? 'block':'none'}}>
                    <FormItem>
                        {getFieldDecorator('searchUser', {
                            rules: [{
                                whitespace:true,
                            }],
                        })(
                            <Popover placement="bottomLeft" content={this.state.options} visible={this.state.popVisible}>
                                <Input
                                    ref='searchInput'
                                    className='searchInput'
                                    id='searchInput'
                                    placeholder="请输入协作者用户名"
                                    style={{ width: 268 }}
                                    value={this.state.inputValue}
                                    suffix={<Icon className='searchBtn' type="search" onClick={this.handleSearch.bind(this)}/>}
                                    onPressEnter={this.handleSearch.bind(this)}
                                    onChange={this.inputChange.bind(this)}
                                />
                            </Popover>
                        )}
                    </FormItem>
                </Form>

                <ul className='cooperationList'>
                    <span className='adminName'>{this.state.adminName}</span>
                    {
                        this.state.cooperationArr && this.state.cooperationArr.map((obj)=>{
                            return <li key={obj._id}><span>{obj.username}</span><Popconfirm title="确定删除此协作者吗？" okText="确定" cancelText="取消" onConfirm={this.delCooperation.bind(this,obj._id)}><Icon className='delCooperation' type="delete"  style={{display:this.state.isAdmin ? 'block':'none'}} /></Popconfirm></li>
                        })
                    }
                </ul>
            </Modal>
            { bodyHtml }
        </div>
    }
};