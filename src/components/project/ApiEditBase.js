/**
 * Created by user on 2017/11/14.
 */

import React from 'react';
import {Link} from "react-router-dom";
import {Button, Icon, Input, Modal, Select, Switch, message, Radio, Form} from "antd";
import Utils from '~utils'
import _ from 'lodash';

const Option = Select.Option;
const verifySort = ['URI','featureName'];

export default class ApiEditBase extends React.Component {

    constructor(props) {
        super(props);

        let {option}= props;

        let defaultValue = {
            URI: "",
            featureName: "", //名称
            host: "", //线上地址
            dataType: "GET", //method
            enable: "1", //接口状态
            active: "0", //接口激活状态
            proxyHost: "",//代理域名
            groupId: "-1", //分 组
        };

        this.state = {
            defaultValue,
            values: Object.assign({},defaultValue,option),
            queryData: Utils.parseUrlToData(this.props.location.search),
            verify: props.verify,//是否验证
            errorClickStatus:false
        }


    }

    /**
    * 得到数据，并作出验证
     * @return data 表单的数据
     * @return isVerify 是否验证通过，true表示验证通过，false表示验证不通过
    * */
    getData(){
        let result = true,
            values = this.state.values;


        if(this.state.verify){
            if(!values.URI||!values.featureName){
                result = false;
            }
        }

        if(values.active=="1"&&!values.proxyHost){
            result = false;
        }

        console.log(result,!result)

        if(!result){
            this.setState({
                errorClickStatus:true
            })
        }


        return {
            data:values,
            isVerify:result
        }

    }

    clearData(){
        this.setState({
            values:this.state.defaultValue,
            errorClickStatus:false
        })
    }



    /*
     * 给input 绑定事件 赋值
     * */
    editInput_changeHandler(selectType, e){
        let ele = e.target,
            values = this.state.values;

        if((this.state.verify&&_.indexOf(verifySort, selectType)>-1)||selectType == 'proxyHost'){
            if(!ele.value){
                ele.classList.add("g-errorTip");
            }else{
                ele.classList.remove("g-errorTip");
            }
        }

        values[selectType] = ele.value;

        this.setState({
            values:values
        })

    }


    /*
     * 给下拉框 绑定事件 赋值
     * */
    editSelect_changeHandler(selectType, val) {

        let values = this.state.values;
        values[selectType] = val;

        this.setState({
            values:values
        })

    }



    render(){
        let state= this.state;
        let {values} = this.state;
        let requiredDisplay = state.verify?'inline-block':'none';


        let groupList = [];

        try {
            groupList = this.props['entity']['groups'][state.queryData['projectId']];
            groupList = _.filter(groupList['items'], ['type', "interface"]);
        } catch (e) {

        }

        return (
            <div className='ApiEditBase'>
                <section>
                    <label>
                        <span className='edit_name'><em style={{display:requiredDisplay}} >*</em>URL：</span>
                        <Input
                            className={!values.URI && state.errorClickStatus ? "edit_input g-errorTip" : "edit_input"}
                            defaultValue={values.URI}
                            value={values.URI}
                            onChange={this.editInput_changeHandler.bind(this, 'URI')}
                            placeholder="请输入URL"/>
                    </label>
                    <label>
                        <span className='edit_name'><em style={{display:requiredDisplay}} >*</em>名 称：</span>
                        <Input
                            className={!values.featureName && state.errorClickStatus ? "edit_input g-errorTip" : "edit_input"}
                            defaultValue={values.featureName || ''}
                            value={values.featureName || ''}
                            onChange={this.editInput_changeHandler.bind(this, 'featureName')}
                            placeholder="请输入接口名称"/>
                    </label>
                </section>
                <section>
                    <label>
                        <span className='edit_name'>线上地址：</span>
                        <Input
                            className='edit_input'
                            defaultValue={values.host || ''}
                            value={values.host || ''}
                            onChange={this.editInput_changeHandler.bind(this, 'host')}
                            placeholder="请输入线上地址"/>
                    </label>
                    <label id="methodType">
                        <span className='edit_name'>method：</span>
                        <Select onChange={this.editSelect_changeHandler.bind(this, 'dataType')}
                                value={values.dataType}
                                defaultValue={values.dataType}
                                style={{minWidth: '165px'}}
                                getPopupContainer={() => document.getElementById('methodType')}
                                className='edit_method' >
                            <Option value="GET" >GET</Option>
                            <Option value="POST">POST</Option>
                            <Option value="PUT">PUT</Option>
                            <Option value="DELETE">DELETE</Option>
                            <Option value="HEAD">HEAD</Option>
                            <Option value="PATCH">PATCH</Option>
                            <Option value="OPTIONS">OPTIONS</Option>
                        </Select>
                    </label>
                    <label id="apiStatus">
                        <span className='edit_name'>接口状态：</span>
                        <Select onChange={this.editSelect_changeHandler.bind(this, 'enable')}
                                defaultValue={String(values.enable)}
                                value={String(values.enable)}
                                style={{minWidth: '65px'}}
                                getPopupContainer={() => document.getElementById('apiStatus')}
                                className='edit_method'>
                            <Option value="1">启用</Option>
                            <Option value="2">维护</Option>
                            <Option value="0">弃用</Option>
                        </Select>
                    </label>
                    <label id="activeStatus">
                        <span className='edit_name'>接口激活状态：</span>
                        <Select onChange={this.editSelect_changeHandler.bind(this, 'active')}
                                getPopupContainer={() => document.getElementById('activeStatus')}
                                defaultValue={String(values.active)}
                                value={String(values.active)}
                                style={{minWidth: '65px'}}
                                className='edit_method'>
                            <Option value="1">激活</Option>
                            <Option value="0">未激活</Option>
                        </Select>
                    </label>
                    <label style={{display: values.active=='1'?"block":"none"}}>
                        <span className='edit_name'><em>*</em>代理域名：</span>
                        <Input
                            className={!values.proxyHost && state.errorClickStatus ? "edit_input g-errorTip" : "edit_input"}
                            defaultValue={values.proxyHost}
                            value={values.proxyHost}
                            onChange={this.editInput_changeHandler.bind(this, 'proxyHost')}
                            placeholder="请输入代理域名"/>
                    </label>
                    <label  id="group">
                        <span className='edit_name'>分  组：</span>
                        <Select
                                onChange={this.editSelect_changeHandler.bind(this, 'groupId')}
                                getPopupContainer={() => document.getElementById('group')}
                                defaultValue={String(values.groupId)}
                                value={String(values.groupId)}
                                className='edit_method'>
                            <Option key={'-1'} value='-1'>无分组</Option>
                            {
                                groupList&&groupList.map((groupDtat) => {
                                    return (
                                        <Option key={groupDtat._id}
                                                value={groupDtat._id}>{groupDtat.name}</Option>
                                    )
                                })
                            }
                        </Select>
                    </label>
                </section>


            </div>
        )
    }

}