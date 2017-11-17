/**
 * Created by user on 2017/10/27.
 */

import React from 'react';
import {Button, Icon, Input, Modal, Select, Switch, message,Radio,Form,Tooltip} from "antd";
import {paramsFormat} from '~common/http';
import Utils from '~utils';
import _ from 'lodash';
const Option = Select.Option;

const optionArr = ['string','file','json','int','float','double','date','datetime','boolean','byte','short','long','array','object'];
const MAX_MULIT = 3;

class ParamDom extends React.Component {

    constructor(props) {
        super(props);

        let option = props.option,
            multi = props.multi.toString(),
            isShowSwitch = multi.split(",").length < MAX_MULIT ;


        let setting = {
            require:"", //参数名称 0 选填 1必填
            key:"", //参数名称
            type:"", //参数类型
            des:"", //参数说明
            display:false,
            multi:"",
            onDelete:()=>{},
            onAddConfig:()=>{},
            onSwitch:()=>{},
            onChangeValue:(data)=>{}
        }

        //清空多余数据


        this.state = {values:{...option,multi},...props,isShowSwitch};

    }
    /**
    * 删除事件
    * */
    delete(){
        let _stateValue = this.state.values;
        this.state.onDelete(_stateValue);
    }



    /**
     * onchange 参数名称 type=text
     * */
    changeValue (Valuetype,e){

        let ele=e.target,
            _stateValue = this.state.values;

         _stateValue[Valuetype]=ele.value;
        if(Valuetype == 'key' && !_stateValue[Valuetype]){
            ele.classList.add("g-errorTip");
        }else{
            ele.classList.remove("g-errorTip");
        }

        this.changeStateValues(_stateValue);

    }

    /**
     * onchange 参数名称 type=select
     * */
    changeSelect (Valuetype,val){

        let _stateValue = this.state.values;
        _stateValue[Valuetype]=val;

       this.changeStateValues(_stateValue);

    }

    /**
     * 改变state.values 并且触发父组件的onChangeValue方法
     * */
    changeStateValues(_values){

        this.setState({
            values:_values
        })

        this.props.onChangeValue(_values);

    }


    /**
     * onchange 开关 更多:false 简单:true
     * */
    change_switch(checked){
        let that2 = this,
            _stateValue = this.state.values;

            _stateValue['display']=checked?'block':'none';
            that2.changeStateValues(_stateValue);


        if(checked){
            this.props.onSwitch(_stateValue,
                ()=>{ //取消
                _stateValue['display']='none';

                that2.changeStateValues(_stateValue);
            })
        }

        return false;

    }
    /**
     * 参数可能值
     * */
    addConfig(){
        let _stateValue = this.state.values;
        this.props.onAddConfig(_stateValue);
    }


    render(){

        var _state = this.state;
        var _values = this.state.values;
        var paramId = "param"+_values.multi;


        return  <div className="list_row" id={paramId}>
                    <span className='list_count'>{_state.multiKey+1}</span>
                    <b onClick={this.delete.bind(this)}>
                        <Icon className='close_list' type="minus-square" style={{fontSize: '27px',color: '#43a074'}} />
                    </b>
                    <Select  onChange={this.changeSelect.bind(this,'require')}
                             defaultValue={_values.require}
                             className='edit_method' style={{minWidth: '60px'}}
                             getPopupContainer={() => document.getElementById(paramId)}
                    >
                        <Option value="0">选填</Option>
                        <Option value="1">必填</Option>
                    </Select>
                    <label className='list_name'>参数名称：
                        <Input onChange={this.changeValue.bind(this,'key')}
                               defaultValue={_values.key} className="list_input paramName" placeholder="Basic usage" id="key"/>
                    </label>
                    <label className='list_name'>参数类型：
                        <Select
                            showSearch
                            onChange={this.changeSelect.bind(this,'type')}
                            defaultValue={_values.type}
                            style={{ width: 80 }}
                            placeholder="参数类型"
                            optionFilterProp="children"
                            getPopupContainer={() => document.getElementById(paramId)}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {
                                optionArr.map((obj) => {
                                    return <Option value={obj} key={obj}>{obj}</Option>;
                                })
                            }
                        </Select>
                    </label>
                    <label className='list_explain'>参数说明：
                        <Tooltip placement="topLeft" title={_values.des} trigger={['hover']}>
                            <Input  defaultValue={_values.des}
                                    onChange={this.changeValue.bind(this,'des')}
                                    placeholder="Basic usage" className="list_input" />
                        </Tooltip>

                    </label>
                    <Button className='list_addMaybe' type="primary" icon="plus"
                            onClick={this.addConfig.bind(this)}
                            style={{display:((_values.subParams &&_values.subParams.length>0 ))  ? 'none':'block' }}>参数值可能性</Button>


                    <Switch onChange={checked => {this.change_switch( checked)}} style={{display:this.state.isShowSwitch?"block":"none"}}
                        defaultChecked={_values.display == 'block' ? true : false}
                        checkedChildren="简单"
                        unCheckedChildren="更多"
                        checked={_values.display == 'block' ? true : false}
                        className='switch_btn'/>


            </div>


    }




}


export default ParamDom ;