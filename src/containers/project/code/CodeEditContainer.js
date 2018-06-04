/**
 * Created by Cray on 2017/7/20.
 */
import React from "react";
import jsoneditor from 'jsoneditor'
import { Link } from "react-router-dom";
import { Button, Input, Modal, Select, message } from "antd";
import { paramsFormat } from "~common/http";
import ProjectSubnav from "~components/common/ProjectSubnav";
import RequestParam from "~components/project/RequestParam/index";
import JsonEditorBox from "~components/project/JsonEditorBox";
import Utils from '~utils'
import _ from 'lodash';
import Quill from '~components/common/Quill';
import SearchParam from '~components/project/SearchParam'
import {ProjectUserAuth} from '~components/project/ProjectUserAuthority';

class CodeEditContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            scodeData: null,
            errorClickStatus: false,
            queryData: Utils.parseUrlToData(this.props.location.search),
            paramList: []
        }
    }

    componentWillMount() {
        this.dealData();
    }
    /**
     *  错误 弹出框
     *  */
    modalError(message) {
        Modal.error({
            title: '错误提示',
            content: message,
        });
    }
    /*
     * 处理 数据
     * */
    dealData() {
        let queryData = this.state.queryData,
            codeData = null,
            codeId = queryData.codeId || '-1',
            groupId = queryData.groupId || '-1',
            codeDataCopy = {
                description: "",
                groupId: "-1",
                remark: "",
                scode: "",
                type: "",
                paramList: [],
                json: {},
                projectId: queryData['projectId'],
                groupId: queryData['groupId'],
                id: queryData['codeId'] == -1 ? '' : queryData['codeId']
            },
            dataResult;
        if (String(codeId) !== '-1') {
            try {
                this.props.fetchStateCodeCheckList(paramsFormat({projectId: queryData.projectId}), data => {
                    Object.assign(codeDataCopy, _.filter(data['details'], ['_id', codeId])[0]);
                    dataResult = Utils.copy(codeDataCopy);
                    this.initState(dataResult)
                });
            } catch (e) {
                console.log(e)
            }
        }else{
            this.initState(codeDataCopy)
        }
    }

    initState(dataResult) {
        let {paramList} = dataResult
        this.setState({
            scodeData: dataResult,
            paramList
        })
        console.log('initState--------------------->', dataResult)
        if(this.refs['returnParam']){
            this.refs.returnParam.fromFatherData(paramList);
        }
    }

    /*
     * 保存
     * */
    saveData_clickHandler() {
        const queryData = this.state.queryData,
            id = queryData.apiId || '';
        let remark = this.refs.remarkRef.getVal(),
            canClick = true,
            codeJson = '',
            returnData = this.refs.returnParam.getParamData()



        try {
            codeJson = this.refs.jsonEditorBox.getEditorSuc();
        } catch (e) {
            message.error('成功结果 json 格式有错误 请检查后重试');
            canClick = false
        }


        if (canClick && returnData.isVerify && this.state.scodeData.description && this.state.scodeData.scode) {
            let opt = this.state.scodeData;
            canClick = false
            opt.json = codeJson;
            opt.remark = remark;
            opt.paramList = returnData.data;
            this.setState({
                loading: true
            });
            this.props.fetchUpdateAddStateCode(paramsFormat(opt), (data) => {
                this.props.history.push(`/project/code/list?projectId=${queryData['projectId']}&groupId=-1`);
            });
        } else {
            this.setState({
                errorClickStatus: true
            })
        }

    }
    inputValHandler(stateProps, stateVal, e) {
        stateProps[stateVal] = e.target.value;
        this.setState({
            scodeData: stateProps
        })
    }
    scodeParamHandler(val) {
        let scodeData = this.state.scodeData;
        scodeData.paramList = val
        this.setState({
            scodeData
        })
    }
    selectValHandler(stateProps, stateVal, val) {
        stateProps[stateVal] = val;
        this.setState({
            scodeData: stateProps
        })
    }
    render() {
        const { groupCmp } = this.props.global, Option = Select.Option, queryData = this.state.queryData;
        let groupList = [],
            groupId = queryData.groupId || '-1';
        try {
            groupList = _.filter(this.props['entity']['groups'][queryData['projectId']]['items'], ['type', "scode"]);
        } catch (e) {}
        return (
            <div>
                <ProjectSubnav {...this.props} />
                <div className="apiEdit" style={{'left': groupCmp.width}}>
                    <header className='apiEditBtnBox'>
                        <Link to={"/project/code/list?projectId=" + queryData.projectId + "&groupId=" + groupId + ""}>
                                <Button className='edit_backList'> &lt;状态码列表</Button>
                        </Link>
                        <Button onClick={this.saveData_clickHandler.bind(this)} className='edit_saveList' type="primary" loading={this.state.loading}>保存</Button>
                    </header>
                    {
                        this.state.scodeData && (() => {
                            return (
                                <div>
                                    <section>
                                        <label><span className='edit_name'><em>*</em>状态码：</span><Input
                                        className={!this.state.scodeData.scode && this.state.errorClickStatus ? "edit_input g-errorTip" : "edit_input"}
                                        defaultValue={this.state.scodeData.scode}
                                        value={this.state.scodeData.scode}
                                        onChange={this.inputValHandler.bind(this, this.state.scodeData,'scode')}
                                        placeholder="请输入状态码"/></label>
                                        <label><span className='edit_name'><em>*</em>描 述：</span><Input
                                        className={!this.state.scodeData.description && this.state.errorClickStatus ? "edit_input g-errorTip" : "edit_input"}
                                        defaultValue={this.state.scodeData.description || ''}
                                        value={this.state.scodeData.description}
                                        onChange={this.inputValHandler.bind(this, this.state.scodeData,'description')}
                                        placeholder="请输入描述"/></label>
                                        <label><span className='edit_name'>类 型：</span><Input
                                            className={"edit_input"}
                                            defaultValue={this.state.scodeData.type}
                                            value={this.state.scodeData.type}
                                            onChange={this.inputValHandler.bind(this, this.state.scodeData,'type')}
                                            placeholder="请输入类型"/></label>
                                        {
                                        <label  id='paramGroup'>
                                            <span className='edit_name'>分  组：</span>
                                            <Select onChange={this.selectValHandler.bind(this,this.state.scodeData, 'groupId')}
                                            defaultValue={String(this.state.scodeData.groupId)}
                                            value={String(this.state.scodeData.groupId)}
                                            className='edit_method'
                                            getPopupContainer={() => document.getElementById('paramGroup')}
                                            >
                                                <Option key={'-1'} value='-1'>无分组</Option>
                                                { groupList && groupList.map((groupDtat) => {
                                                        return (
                                                            <Option key={groupDtat._id}
                                                            value={groupDtat._id}>{groupDtat.name}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </label>
                                    }
                                    </section>
                                          {/*----------------------- 返回说明----------------------------*/}
                                    <section> 
                                        <h4 className='edit_parameter_box'>字段说明：</h4>
                                        {/*<SearchParam ref='searchParam'
                                            searchParam={this.state.paramList}
                                            paramList={this.state.scodeData.paramList}
                                            paramHandler={this.scodeParamHandler.bind(this)}
                                            { ...this.props }/>*/}
                                        <RequestParam ref='returnParam'
                                                      { ...this.props }
                                                      returnParame={this.state.scodeData.paramList}
                                                      userAuthority={this.props.user.proUserAuth.authority}
                                        />
                                        </section>
                                 
                                   <section>
                                        <JsonEditorBox 
                                        ref='jsonEditorBox'
                                        successResult={this.state.scodeData.json}
                                        title='代码样例'
                                        options={{
                                           history: false,
                                           mode: 'code',
                                           indentation: 3,
                                           onError: (message) => {
                                               this.modalError(message)
                                           }
                                        }}/>
                                    </section>
                                    { /*----------------------- 备注 ----------------------------*/ }
                                    <section className='quillBox'>
                                        <h4 className='quillBox_title'>备注：</h4>
                                        <Quill
                                        ref='remarkRef'
                                        defaultValue={ this.state.scodeData.remark }
                                        value={ this.state.scodeData.remark }/>
                                        <Button onClick={this.saveData_clickHandler.bind(this)}
                                        className='edit_saveList' type="primary" loading={this.state.loading}>保存</Button>
                                    </section>

                                </div>
                            )
                        })()
                    }
                </div>

            </div>
        );
    }

}

export default ProjectUserAuth(CodeEditContainer)