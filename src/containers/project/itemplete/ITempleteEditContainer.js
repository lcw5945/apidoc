/**
 * Created by Cray on 2017/7/20.
 */
import React from "react";
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
import Utils from '~utils'
import _ from 'lodash';
import ReactQuill from 'react-quill';
import {quill} from "~constants/param-type";
import {ProjectUserAuth} from '~components/project/ProjectUserAuthority';

const Option = Select.Option;

class ApiEditContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemplateObj:{name:""}, //模板Obj
            itempleteId:"0",
            dataResult: {}, //jiekou
            loading: false,
            queryData : Utils.parseUrlToData(this.props.location.search),
            apiJson: {},
            parameter_list: [],
            returnData_list: [],
            quillText: '',    //富文本的内容
            apiEditStatus: 0, // 0 是新增页面 1是编辑页面
            hasEmptyReturnData: false,
            successResult:{},
            errorResult:{},
            mockResult:{},
            errorClickStatus:false,
            userAuthority:this.getUserAuthority(),
        }
    }

    componentWillMount() {
        this.dealData();
    }


    /*
     * 处理 数据
     * */
    dealData(itemId) {
        let queryData = Utils.parseUrlToData(this.props.location.search),
            itemplateObj={},
            itemplateObjCopy = null,
            itempleteEntity = null,
            itempleteId = itemId||queryData.itempleteId,
            dataResult = null,
            parameter_list = [],
            returnData_list = [],
            successResult = {},
            mockResult = {},
            errorResult = {};


        if (String(itempleteId) != "0") {
            try {

                itempleteEntity = this.props['entity']['itemplete']["default"];
                itemplateObjCopy = Object.assign({}, _.filter(itempleteEntity['items'], ['_id', itempleteId])[0]);
                itemplateObj = Utils.copy(itemplateObjCopy);

                dataResult = itemplateObj.data||{};

                if(dataResult){
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
                            // paramsVal['display'] = 'none';
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
                            // returnDataVal['display'] = 'none';
                            returnDataVal.value.forEach((val, index) => {
                                val['valIndex'] = index
                            })

                        });

                        returnData_list.push(...dataResult.returnData)
                    }


                }

                this.setState({
                    apiEditStatus:1,
                    queryData,
                    itempleteId,
                    itemplateObj,
                    dataResult,
                    parameter_list,
                    returnData_list,
                    quillText:dataResult.remark||'',
                    successResult,
                    errorResult,
                    mockResult
                })

                this.refs.jsonEditorBox.setEditorSuc(successResult);
                this.refs.jsonEditorBox.setEditorErr(errorResult);
                this.refs.jsonMockBox.setEditorMock(mockResult);


            } catch (e) {
                console.log(e)
            }
        }else{
           this.clearState();
        }


    }

    /**
     * 请求参数 - 为没有subParams字段的数据添加subParams字段
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
     * 返回说明 - 判断返回说明内容是否为空
     * */
    forReturnParamsEmpty(params) {
        params.forEach((param, index) => {
            if (!param.returnDataKey) {
                message.error("返回说明名称不能为空！");
                this.state.hasEmptyReturnData = true;
            } else {
                if (param.value.length != 0) {
                    param.value.forEach((val, num) => {
                        if (!val.valueCont) {
                            message.error("值可能性不能为空！");
                            this.state.hasEmptyReturnData = true;
                        }
                    });
                }
            }
        });
    }

    /**
     * 返回说明 - 接收返回说明的数据并赋值
     * */
    fromReturnParamData(params) {
        this.setState({
            returnData_list: params
        });
    }

    /*
     * 保存
     * */
    saveData_clickHandler() {

        let state = this.state;
        let id = state.itempleteId,
            apiEditbase = this.refs.ApiEditBase.getData(), //基本信息，包括url,名称，线上地址，method，接口状态，接口状态，代理域名，分组
            paramResult = this.refs.requestParam.getParamData(), //请求参数
            returnData = this.state.returnData_list, //返回说明
            successResult = {}, //成功结果
            errorResult = {}, //失败结果
            mockResult = {},
            canClick = true;

        this.setState({
            loading: true,
        });
        this.state.hasEmptyReturnData = false;

        //验证数据

        this.forReturnParamsEmpty(returnData);
        if (!paramResult.isVerify || !apiEditbase.isVerify || this.state.hasEmptyReturnData || !this.state.itemplateObj.name) {
            this.state.errorClickStatus = true;

            this.setState({
                loading: false,
            });
            message.error('您还有空的请求参数未填写！');
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
            mockResult = this.refs.jsonMockBox.getEditorMock();
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
            opt.remark= this.state.quillText;
            opt.params= paramResult.data;
            opt.returnData= returnData;
            opt.apiJson= {
                successResult,
                errorResult,
                mockResult
            };

            let itemplate = this.state.itemplateObj;

            itemplate.data = opt;
            itemplate.projectId= this.state.queryData.projectId;

            if (id!="0") {
                itemplate.id = id;
            }

            this.props.fetchUpdateAddITemplete(paramsFormat(itemplate), (data) => {
                this.props.history.push(`/project/itemplete/edit?itempleteId=0&projectId=${this.state.queryData.projectId}&groupId=-1&apiId=${this.state.queryData.apiId}`);
                this.clearState();
            });


        }

    }

    /*
     * 清除还原state数据
     * */
    clearState(){

        this.setState({
            itemplateObj:{},
            itempleteId:"0",
            loading: false,
            parameter_list: [],
            returnData_list: [],
            dataResult: {},
            quillText: '',
            apiEditStatus: 0,
        })


        if(!this.refs.jsonEditorBox){
            return;
        }

        this.refs.jsonEditorBox.setEditorSuc({});
        this.refs.jsonEditorBox.setEditorErr({});
        this.refs.jsonMockBox.setEditorMock({});
        this.refs.requestParam.fromFatherData([]);
        this.refs.returnParam.fromEditContainerData([]);
        this.refs.ApiEditBase.clearData()


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


    /**
     * 模板名称change事件
     */
    itempleteName_changeHandler(e){
        let obj = this.state.itemplateObj,
            ele = e.target;

        obj.name = ele.value;
        this.setState({
           itemplateObj:obj
        })

        if(!obj.name){
            ele.classList.add("g-errorTip");
        }else{
            ele.classList.remove("g-errorTip");
        }

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
     * 用户权限
     * */
    getUserAuthority(){

        let userAuthority = this.props.user.proUserAuth||{};


        return userAuthority.authority;

    }


    render() {
        let state = this.state;
        const {queryData,dataResult={},itemplateObj,itempleteId,userAuthority} = this.state;
        let key=itempleteId;


        return (
            <div className="itemplateEidt">
                <div className="apiEdit " >

                    <TemplateSelect alt="选择模板"
                        {...this.props}
                        type="eidtItemplete"
                        refreshPage={this.dealData.bind(this)}/>

                    <header className='apiEditBtnBox'>
                        <Link to={"/project/api/edit?projectId=" + queryData.projectId + "&groupId=" + queryData.groupId + "&apiId=" + queryData.apiId + ""}>
                            <Button className='edit_backList'> &lt; 接口详情</Button>
                        </Link>
                        <Button onClick={this.saveData_clickHandler.bind(this)} className='edit_saveList'
                                type="primary" loading={this.state.loading}>
                            保存</Button>
                    </header>

                    <section>
                        <label>
                            <span className='edit_name'><em>*</em>模板名称：</span>
                            <Input placeholder="请输入模板名称"
                                   style={{"width":"60%"}}
                                   defaultValue={itemplateObj.name}
                                   onChange={this.itempleteName_changeHandler.bind(this)}
                                   value={itemplateObj.name}
                                   className={!itemplateObj.name && state.errorClickStatus ? "edit_input g-errorTip" : "edit_input"}
                            />
                        </label>
                    </section>

                    <ApiEditBase ref="ApiEditBase"
                                 key={"ApiEditBase"+key}
                                 {...this.props}
                                 option={dataResult}
                                 verify={false}
                                 userAuthority={userAuthority}
                                />


                    {
                        dataResult && (() => {
                            return (
                                <div>
                                    {/*----------------------- 请求参数----------------------------*/}
                                    <h4 className='edit_parameter_box'>请求参数：</h4>
                                    <RequestParam ref='requestParam'
                                                  key={"requestParam"+key}
                                                  { ...this.props }
                                                  requestParame={this.state.parameter_list}
                                                  userAuthority={userAuthority}
                                    />
                                    {/*----------------------- 返回说明----------------------------*/}
                                    <h4 className='edit_parameter_box'>返回说明：</h4>
                                    <ReturnParam ref='returnParam'
                                                 key={"ReturnParam"+key}
                                                 returnParame={this.state.returnData_list}
                                                 fromReturnParamData={this.fromReturnParamData.bind(this)}
                                                 { ...this.props }
                                                 userAuthority={userAuthority}
                                    />
                                    {/*----------------------- 返回结果----------------------------*/}
                                    <section>
                                        <JsonEditorBox ref='jsonEditorBox'
                                                       successResult={this.state.successResult}
                                                       errorResult={this.state.errorResult}
                                                       mode="itemplate"
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
                                        <ReactQuill
                                            theme="snow"
                                            modules={quill.modules}
                                            formats={quill.formats}
                                            defaultValue={ this.state.quillText }
                                            value={ this.state.quillText||'' }
                                            onChange={this.quillText_changeHandler.bind(this)}
                                        />

                                    </section>
                                    <Button onClick={this.saveData_clickHandler.bind(this)}
                                            className='edit_saveList' type="primary"
                                            loading={this.state.loading}>保存</Button>
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