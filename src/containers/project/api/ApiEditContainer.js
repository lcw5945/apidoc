/**
 * Created by Cray on 2017/7/20.
 */
import React from "react";
import mockReact from "react";
import jsoneditor from 'jsoneditor'
import {Link} from "react-router-dom";
import {Button, Icon, Input, Modal, Select, Switch, message, notification} from "antd";
import {paramsFormat} from "~common/http";
import ApiEditBase from "~components/project/ApiEditBase";
import ProjectSubnav from "~components/common/ProjectSubnav";
import RequestParam from "~components/project/RequestParam/index";
import ReturnParam from "~components/project/ReturnParam";
import JsonEditorBox from "~components/project/JsonEditorBox";
import JsonMockBox from "~components/project/JsonMockBox";
import TemplateSelect from "~components/project/TemplateSelect";
import {quill} from "~constants/param-type";
import Utils from '~utils'
import _ from 'lodash';
import ReactQuill from 'react-quill';
import {ProjectUserAuth} from '~components/project/ProjectUserAuthority';


class ApiEditContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            templeteId: "0",
            loading: false,
            dataResult: {},
            apiJson: {},
            parameter_list: [],
            returnData_list: [],
            quillText: '',    //富文本的内容
            apiEditStatus: 0, // 0 是新增页面 1是编辑页面
            queryData: Utils.parseUrlToData(this.props.location.search),
            hasEmptyReturnData: false,
            successResult: {},
            errorResult: {},
            mockResult: {},
            userAuthority: this.getUserAuthority(),
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
     * 富文本 监听 事件
     * */
    quillText_changeHandler(val) {
        this.setState({
            quillText: val
        })
    }

    /*
     * 处理 数据
     * */
    dealData() {
        let queryData = this.state.queryData;
        let interfacesData = null;
        let apiId = queryData.apiId || '-1';
        let dataResult = null;
        let dataResultCopy = null;
        if (String(apiId) !== '-1') {
            try {
                this.props.fetchInterfaceCheckList(paramsFormat({projectId: queryData.projectId}), data => {
                    dataResultCopy = Object.assign({}, _.filter(data['details'], ['_id', apiId])[0]);
                    dataResult = Utils.copy(dataResultCopy);
                    this.initState(dataResult)
                });

                /* interfacesData = this.props['entity']['interfaces'][queryData['projectId']];
                 console.log(interfacesData, 2222);
                 dataResultCopy = Object.assign({}, _.filter(interfacesData['items'], ['_id', apiId])[0]);
                 dataResult = Utils.copy(dataResultCopy);*/


            } catch (e) {
                console.log(e)
            }
        }
    }

    /**
     * 根据api数据初始化state
     * */
    initState(dataResult) {
        let successResult = {},
            errorResult = {},
            mockResult = {},
            returnData_list = [],
            parameter_list = [];


        if (dataResult.apiJson && dataResult.apiJson.successResult) {
            successResult = dataResult.apiJson.successResult;
        }
        if (dataResult.apiJson && dataResult.apiJson.errorResult) {
            errorResult = dataResult.apiJson.errorResult;
        }
        if (dataResult.apiJson && dataResult.apiJson.mockResult) {
            mockResult = dataResult.apiJson.mockResult;
        }

        if (dataResult['params'] && _.isArray(dataResult['params'])) {
            dataResult.params.forEach((paramsVal, paramsIndex) => {
                paramsVal['keyIndex'] = paramsIndex;
                paramsVal.value.forEach((val, index) => {
                    val['valIndex'] = index
                })
            });
            parameter_list.push(...dataResult.params)
        }
        this.forAddSubParams(parameter_list);
        if (dataResult['returnData'] && _.isArray(dataResult['returnData'])) {
            dataResult.returnData.forEach((returnDataVal, returnDataIndex) => {
                returnDataVal['keyIndex'] = returnDataIndex;
                returnDataVal.value.forEach((val, index) => {
                    val['valIndex'] = index
                })
            });
            returnData_list.push(...dataResult.returnData)
        }
        this.setState({
            dataResult,
            parameter_list,
            returnData_list,
            apiEditStatus: this.state.queryData.apiId != '-1' ? 1 : 0,
            quillText: dataResult.remark || '',
            successResult,
            errorResult,
            mockResult
        })

        this.refs.jsonEditorBox.setEditorSuc(successResult);
        this.refs.jsonEditorBox.setEditorErr(errorResult);
        this.refs.jsonMockBox.setEditorMock(mockResult);
        this.refs.requestParam.fromFatherData(parameter_list);
        this.refs.returnParam.fromFatherData(returnData_list);
        this.refs.ApiEditBase.setData(dataResult)
    }

    /**
     * 为没有subParams字段的数据添加subParams字段
     * */
    forAddSubParams(params) {
        params.forEach((param, index) => {
            if (!param.hasOwnProperty("subParams")) {
                param.subParams = [];
            } else if (!param.hasOwnProperty("type")) {
                param.type = 'string';
                this.forAddSubParams(param.subParams);
            } else {
                this.forAddSubParams(param.subParams);
            }
        })
    }

    /**
     * 判断返回说明内容是否为空
     * */
    forReturnParamsEmpty(params) {
        params.forEach((param, index) => {
            if (!param.returnDataKey) {
                this.state.hasEmptyReturnData = true;
            } else {
                if (param.value.length != 0) {
                    param.value.forEach((val, num) => {
                        if (!val.valueCont) {
                            this.state.hasEmptyReturnData = true;
                        }
                    });
                }
            }
        });
    }

    /*
     * 保存
     * */
    saveData_clickHandler(isContinue) {
        this.setState({
            loading: true,
        });
        // this.state.hasEmptyReturnData = false;
        let {queryData} = this.state;
        let id = queryData.apiId || '',
            projectId = queryData.projectId || '',
            apiEditbase = this.refs.ApiEditBase.getData(), //基本信息，包括url,名称，线上地址，method，接口状态，接口状态，代理域名，分组
            paramResult = this.refs.requestParam.getParamData(), //请求参数
            returnData = this.refs.returnParam.getParamData(), //返回说明
            successResult = {}, //成功结果
            errorResult = {}, //失败结果
            mockResult = {}, // mock结果
            canClick = true;
        //验证数据
        // this.forReturnParamsEmpty(returnData);
        if (!paramResult.isVerify || !returnData.isVerify || !apiEditbase.isVerify) {
            canClick = false;
            this.setState({
                loading: false,
            });
            message.error('您还有空的内容未填写！');
            return false;
        }


        try {
            successResult = this.refs.jsonEditorBox.getEditorSuc();
        } catch (e) {
            message.error('成功结果 json 格式有错误 请检查后重试');
            canClick = false
        }
        try {
            errorResult = this.refs.jsonEditorBox.getEditorErr();
        } catch (e) {
            message.error('失败结果 json 格式有错误 请检查后重试');
            canClick = false
        }
        try {
            mockResult = this.refs.jsonMockBox.getEditorMock()
        } catch (e) {
            message.error('mock结果 json 格式有错误 请检查后重试');
            canClick = false
        }
        if (!canClick) {
            this.setState({
                loading: false,
            });
        }
        //封装数据并提交
        if (canClick) {
            let opt = apiEditbase.data;
            opt.projectId = projectId;
            opt.remark = this.state.quillText;
            opt.params = paramResult.data;
            opt.returnData = returnData.data;
            opt.apiJson = {
                successResult,
                errorResult,
                mockResult
            };
            if (this.state.apiEditStatus) {
                opt.id = id;
            }

            this.props.fetchUpdateAddInterface(paramsFormat(opt), (data) => {
                let apiId = String(this.state.queryData.apiId) || '';
                //初始化参数
                this.setState({
                    loading: false,
                    parameter_list: [],
                    returnData_list: [],
                    dataResult: {},
                    quillText: '',
                    apiEditStatus: 0,
                    successResult: {},
                    errorResult: {},
                    mockResult: {},
                })
                this.refs.jsonEditorBox.setEditorSuc({});
                this.refs.jsonEditorBox.setEditorErr({});
                this.refs.jsonMockBox.setEditorMock({});
                this.refs.requestParam.fromFatherData([]);
                this.refs.returnParam.fromFatherData([]);
                this.refs.ApiEditBase.clearData()
                //提示
                notification.success({
                    message: '操作成功'
                });

                if (apiId.length < 10) {
                    apiId = data._id
                }

                if (isContinue === true) {
                    this.props.history.push(`/project/api/edit?projectId=${this.state.queryData.projectId}&groupId=-1&apiId=-1`);
                } else {
                    this.props.history.push(`/project/api/details?projectId=${this.state.queryData.projectId}&groupId=${this.state.queryData.groupId}&apiId=${apiId}`);
                }

            }, error => {
                this.setState({
                    loading: false,
                });
            });


        }
    }

    /*
     * 用户权限
     * */
    getUserAuthority() {
        let userAuthority = this.props.user.proUserAuth || {};
        return userAuthority.authority;
    }

    /*
     * 选择模板组件
     * 根据模板Id更新页面
     * */
    refreshPageByITemplete(itempleteId) {
        try {
            let itempleteEntity = this.props['entity']['itemplete']["default"],
                itemplateObjCopy = Object.assign({}, _.filter(itempleteEntity['items'], ['_id', itempleteId])[0]),
                itemplateObj = Utils.copy(itemplateObjCopy),
                itemplateData = itemplateObj.data;
            this.setState({
                templeteId: itemplateObj._id
            })

            this.initState(itemplateData || {})
        } catch (e) {
            console.log("refreshPageByITemplete 出现异常")
        }
    }

    componentDidUpdate() {
        if (this.remarks) this.remarks.innerHTML = this.state.quillText;
    }

    render() {
        const {groupCmp} = this.props.global;
        const {queryData, apiEditStatus, dataResult, templeteId, userAuthority} = this.state; //userAuthority
        // let userAuthority = 2;

        let groupId = queryData.groupId || '-1';
        let key = templeteId;
        let template = '';
        if (userAuthority > 0) {
            template = <TemplateSelect alt="选择模板"
                                       {...this.props}
                                       type="eidtApi"
                                       refreshPage={this.refreshPageByITemplete.bind(this)}/>
        }


        return (
            <div>
                <ProjectSubnav {...this.props}/>
                <div className="apiEdit" style={{'left': groupCmp.width}}>

                    {template}

                    <header className='apiEditBtnBox'>
                        {
                            apiEditStatus == 0
                                ? <Link
                                    to={"/project/api/list?projectId=" + queryData.projectId + "&groupId=" + groupId + ""}>
                                    <Button className='edit_backList'> &lt; 接口列表</Button>
                                </Link>
                                : <Link
                                    to={"/project/api/details?projectId=" + queryData.projectId + "&groupId=" + groupId + "&apiId=" + queryData.apiId + ""}>
                                    <Button className='edit_backList'> &lt; 接口详情</Button>
                                </Link>
                        }
                        <Button onClick={this.saveData_clickHandler.bind(this)} className='edit_saveList'
                                type="primary" loading={this.state.loading}>保存</Button>
                        <Button onClick={this.saveData_clickHandler.bind(this, true)} className='edit_saveList'
                                type="primary" loading={this.state.loading}>保存并继续添加</Button>
                    </header>
                    <ApiEditBase alt="基本信息" key={"ApiEditBase" + key}
                                 ref="ApiEditBase"
                                 {...this.props}
                                 option={dataResult}
                                 verify={true}
                                 userAuthority={userAuthority}
                    />
                    {
                        dataResult && (() => {
                            return (
                                <div>
                                    {/*----------------------- 请求参数----------------------------*/}
                                    <h4 className='edit_parameter_box'>请求参数：</h4>
                                    <RequestParam key={"RequestParam" + key}
                                                  ref='requestParam'
                                                  { ...this.props }
                                                  requestParame={this.state.parameter_list}
                                                  userAuthority={userAuthority}
                                    />
                                    {/*----------------------- 返回说明----------------------------*/}
                                    <h4 className='edit_parameter_box'>返回说明：</h4>
                                    {/*<ReturnParam key={"ReturnParam" + key}
                                     ref='returnParam'
                                     returnParame={this.state.returnData_list}
                                     { ...this.props }
                                     userAuthority={userAuthority}
                                     />*/}
                                    <RequestParam key={"ReturnParam" + key}
                                                  ref='returnParam'
                                                  { ...this.props }
                                                  returnParame={this.state.returnData_list}
                                                  userAuthority={userAuthority}
                                    />
                                    {/*----------------------- 返回结果----------------------------*/}
                                    <section>
                                        <JsonEditorBox ref='jsonEditorBox'
                                                       successResult={this.state.successResult}
                                                       errorResult={this.state.errorResult}
                                                       userAuthority={userAuthority}
                                                       mode="eidt"
                                                       options={{
                                                           history: false,
                                                           mode: 'code',
                                                           indentation: 3,
                                                           onError: (message) => {
                                                               this.modalError(message)
                                                           }
                                                       }}
                                        />
                                    </section>
                                    {/*----------------------- mock结果----------------------------*/}
                                    <section>
                                        <JsonMockBox ref='jsonMockBox'
                                                     mockResult={this.state.mockResult}
                                                     userAuthority={userAuthority}
                                                     mode="eidt"
                                                     options={{
                                                         history: false,
                                                         mode: 'code',
                                                         indentation: 3,
                                                         onError: (message) => {
                                                             this.modalError(message)
                                                         }
                                                     }}
                                        />
                                    </section>
                                    <section className='quillBox'>
                                        <h4 className='quillBox_title'>备注：</h4>
                                        <div style={{display: userAuthority ? 'block' : 'none'}}>
                                            <ReactQuill theme="snow"
                                                        modules={quill.modules}
                                                        formats={quill.formats}
                                                        defaultValue={ this.state.quillText }
                                                        value={ this.state.quillText || '' }
                                                        onChange={this.quillText_changeHandler.bind(this)}/>
                                        </div>


                                        <div className="ql-container ql-snow"
                                             style={{display: userAuthority ? 'none' : 'block'}}>
                                            <div className="remarks-content ql-editor"
                                                 ref={remarks => this.remarks = remarks}>
                                            </div>
                                        </div>


                                    </section>

                                    <Button onClick={this.saveData_clickHandler.bind(this)}
                                            className='edit_saveList' type="primary"
                                            style={{marginRight: '20px'}}
                                            loading={this.state.loading}>保存</Button>

                                    <Button onClick={this.saveData_clickHandler.bind(this, true)}
                                            className='edit_saveList' type="primary"
                                            loading={this.state.loading}>保存并继续添加</Button>
                                </div>
                            )
                        })()
                    }
                </div>
            </div>
        );
    }
}

export default ProjectUserAuth(ApiEditContainer)