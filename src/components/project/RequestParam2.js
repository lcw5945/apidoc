
import React from 'react';
import {Link} from "react-router-dom";
import {Button, Icon, Input, Modal, Select, Switch, message,Radio,Form} from "antd";
import MaybeModal from "~components/project/MaybeModal";
import Utils from '~utils'
import _ from 'lodash';

export default class RequestParam extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            parameter_list:[],
            modalVisible:false,
            queryData: Utils.parseUrlToData(this.props.location.search),
            maybeNum: 0,
            maybeFirstIndex: 0,
            maybeSecondIndex: -1,
            maybeThirdIndex: -1,
            maybeTitle:'',
            maybeData:[],
            options:[]
        }
    }

    componentWillMount() {
        this.dealData();
    }
    /*
     * 显示 更多 参数
     *
     * */
    switchMore_changeHandler(index, dataType, checked, paramsIndex) {
        let parameter_list = this.state.parameter_list;
        if (dataType === 'parameter_list') {
            parameter_list[index]['display'] = checked ? 'block' : 'none';
        }else if(dataType === 'parameter_list_list'){
            parameter_list[index]['subParams'][paramsIndex]['display'] = checked ? 'block' : 'none';
        }
        this.state.parameter_list = parameter_list;
        this.props.fromSubComponentData(parameter_list);
    }

    /*
     * 移除 请求 参数
     *
     * */
    close_clickHandler(index, dataType, e) {
        e.preventDefault();
        let parameter_list = this.state.parameter_list;
        parameter_list.splice(index, 1);
        this.state.parameter_list = parameter_list;
        this.props.fromSubComponentData(parameter_list);

    }

    /*
     * 移除 请求参数 字段
     *
     * */
    closeParams_clickHandler(index, paramsIndex, dataType, listIndex, e) {
        e.preventDefault();
        let parameter_list = this.state.parameter_list;
        if (dataType === 'parameter_list_list') {
            parameter_list[index].subParams.splice(paramsIndex, 1);
        }else if (dataType === 'parameter_list_list_list'){
            parameter_list[index]['subParams'][paramsIndex]['subParams'].splice(listIndex, 1);
        }
        this.state.parameter_list = parameter_list;
        this.props.fromSubComponentData(parameter_list);
    }
    /**
     * 参数值可能性弹窗
     * */
    showMaybeModal(index,dataType,paramsIndex,listIndex){
        let parameter_list = this.state.parameter_list;
        let maybeFirstIndex,maybeSecondIndex,maybeThirdIndex,maybeNum,maybeData,maybeTitle;
        switch (dataType) {
            case 'parameter_list' :
                maybeNum = 0;
                maybeFirstIndex = index;
                maybeSecondIndex = -1;
                maybeThirdIndex = -1;
                maybeData = Utils.copy(parameter_list[index].value);
                maybeTitle = parameter_list[index].key;
                break;
            case 'parameter_list_list' :
                maybeNum = 1;
                maybeFirstIndex = index;
                maybeSecondIndex = paramsIndex;
                maybeThirdIndex = -1;
                maybeData = Utils.copy(parameter_list[index]['subParams'][paramsIndex].value);
                maybeTitle = parameter_list[index]['subParams'][paramsIndex].key;
                break;
            case 'parameter_list_list_list' :
                maybeNum = 2;
                maybeFirstIndex = index;
                maybeSecondIndex = paramsIndex;
                maybeThirdIndex = listIndex;
                maybeData = Utils.copy(parameter_list[index]['subParams'][paramsIndex]['subParams'][listIndex].value);
                maybeTitle = parameter_list[index]['subParams'][paramsIndex]['subParams'][listIndex].key;
                break;
        }

        maybeData.forEach((param,index)=>{
            if(!param.hasOwnProperty('valueDefault')){
                param.valueDefault = 0;
            }
        });

        this.refs.maybeData.showMaybeModal(maybeTitle,maybeData);
        this.setState({
            maybeNum,
            maybeFirstIndex,
            maybeSecondIndex,
            maybeThirdIndex,
            maybeData,
        });
    }

    /**
     * 参数值可能性确定按钮
     * */
    commitMaybeData(maybeData){
        let parameter_list = this.state.parameter_list;

        if (this.state.maybeNum == 0) {
            parameter_list[this.state.maybeFirstIndex]['value'] = maybeData;
        } else if (this.state.maybeNum == 1) {
            parameter_list[this.state.maybeFirstIndex]['subParams'][this.state.maybeSecondIndex]['value'] = maybeData;
        } else if (this.state.maybeNum == 2) {
            parameter_list[this.state.maybeFirstIndex]['subParams'][this.state.maybeSecondIndex]['subParams'][this.state.maybeThirdIndex]['value'] = maybeData;
        }

        this.state.parameter_list = parameter_list;
        this.props.fromSubComponentData(parameter_list);
    }


    /*
     * 添加 请求 返回说明 和 参数
     *
     * */
    add_clickHandler(dataType, e) {
        e.preventDefault()
        if (dataType === 'parameter_list') {
            let parameter_checklist = this.state.parameter_list;
            if(parameter_checklist.length>0 && parameter_checklist[parameter_checklist.length-1].key == ''){
                message.error('您还有空的请求参数未填写！');
                return false;
            }
            this.pushParams(parameter_checklist);

            this.state.parameter_list = parameter_checklist;
            this.props.fromSubComponentData(parameter_checklist);
        }
    }

    /*
     * 添加 请求参数 和 返回说明 字段
     *
     * */
    addParams_clickHandler(index, dataType, paramsIndex) {
        let that = this;
        if (dataType === 'parameter_list') {
            let parameter_list = this.state.parameter_list;
            let subParams = parameter_list[index].subParams;
            if(parameter_list[index].subParams){
                let len = parameter_list[index].subParams.length;
                if(len > 0 && subParams[len-1].key == ''){
                    message.error('您还有空的请求参数未填写！');
                    return false;
                }else if(len == 0){
                    Modal.confirm({
                        iconType:'smile',
                        title:'温馨提示：',
                        content:'添加子属性会清空参数值可能性，确定要继续添加吗？',
                        onOk(){
                            that.pushParams(subParams);
                            that.setState({
                                parameter_list
                            })
                        },
                        onCancel(){
                            return false;
                        }
                    })
                }else {
                    this.pushParams(subParams);
                    this.setState({
                        parameter_list
                    })
                }
            }
        }else if(dataType === 'parameter_list_list'){
            let parameter_list = this.state.parameter_list;
            let subParams = parameter_list[index]['subParams'][paramsIndex]['subParams'];
            let len = parameter_list[index]['subParams'][paramsIndex]['subParams'].length;
            if(len > 0 && subParams[len-1].key == ''){
                message.error('您还有空的请求参数未填写！');
                return false;
            }else if(len == 0){
                Modal.confirm({
                    iconType:'smile',
                    title:'温馨提示：',
                    content:'添加子属性会清空参数值可能性，确定要继续添加吗？',
                    onOk(){
                        that.pushParams(subParams);
                        that.setState({
                            parameter_list
                        })
                    },
                    onCancel(){
                        return false;
                    }
                })
            }else {
                this.pushParams(subParams);
                this.setState({
                    parameter_list
                })
            }
        }
    }

    /**
     * 添加请求数据结构
     * */
    pushParams(subParams){
        subParams.push({
            'display': 'none',
            'require': '1',
            'key': '',
            'des': '',
            'type':'string',
            keyIndex: parseInt(Math.ceil(Math.random()*1000) + '' + new Date().getTime()),
            value:[],
            subParams:[],
        });
    }


    /*
     * 返回说明 和 参数说明 下拉框 事件
     * */
    editParams_changeHandler(selectType, index,paramsIndex,listIndex,val) {
        let parameter_list = this.state.parameter_list;
        switch (selectType) {
            case 'require' :
                parameter_list[index].require = val;
                break;
            case 'requireSecond' :
                parameter_list[index]['subParams'][paramsIndex].require = val;
                break;
            case 'requireThird' :
                parameter_list[index]['subParams'][paramsIndex]['subParams'][listIndex].require = val;
                break;
            default:
                break
        }
        this.state.parameter_list = parameter_list;
        this.props.fromSubComponentData(parameter_list);
    }

    /**
     * 选择参数的数据类型
     * */
    checkType_changeHandler(selectType, index,paramsIndex,listIndex,val){
        let parameter_list = this.state.parameter_list;
        switch (selectType) {
            case 'typeFirst' :
                parameter_list[index].type = val;
                break;
            case 'typeSecond' :
                parameter_list[index]['subParams'][paramsIndex].type = val;
                break;
            case 'typeThird' :
                parameter_list[index]['subParams'][paramsIndex]['subParams'][listIndex].type = val;
                break;
            default:
                break
        }
        this.state.parameter_list = parameter_list;
        this.props.fromSubComponentData(parameter_list);
    }

    /*
     * 给 返回说明 和 参数说明 input 绑定事件 赋值
     * */
    editParamsInput_changeHandler(selectType, index, paramsIndex,listIndex, e) {
        let parameter_list = this.state.parameter_list;
        switch (selectType) {
            case 'paramsName' :
                parameter_list[index].key = e.target.value;
                break;
            case 'paramsDes' :
                parameter_list[index].des = e.target.value;
                break;
            case 'paramsSecondName' :
                parameter_list[index]['subParams'][paramsIndex].key = e.target.value;
                break;
            case 'paramsSecondDes' :
                parameter_list[index]['subParams'][paramsIndex].des = e.target.value;
                break;
            case 'paramsThirdName' :
                parameter_list[index]['subParams'][paramsIndex]['subParams'][listIndex].key = e.target.value;
                break;
            case 'paramsThirdDes' :
                parameter_list[index]['subParams'][paramsIndex]['subParams'][listIndex].des = e.target.value;
                break;
        }
        this.state.parameter_list = parameter_list;
        this.props.fromSubComponentData(parameter_list);
    }
    /**
     * 为没有subParams字段的数据添加subParams字段
     * */
    forAddSubParams(params) {
        params.forEach((param, index) => {
            if (!param.hasOwnProperty("subParams")) {
                param.subParams = [];
            }else if(!param.hasOwnProperty("type")){
                param.type = 'string';
                this.forAddSubParams(param.subParams);
            }else {
                this.forAddSubParams(param.subParams);
            }
        })
    }

    /**
     * 来自父组件的数据渲染
     * */
    fromFatherData(params){
        this.setState({
            parameter_list: params
        })
    }

    /*
     * 处理 数据
     * */
    dealData() {
        this.setState({
            parameter_list: this.props.requestParame
        })
    }

    render() {
        const Option = Select.Option;
        const optionArr = ['string','file','json','int','float','double','date','datetime','boolean','byte','short','long','array','object'];

        let { parameter_list } = this.state;

        return (
            <div className='requestParam' id='requestParam'>
                <MaybeModal ref='maybeData'  commitMaybeData={this.commitMaybeData.bind(this)}  maybeData={this.state.maybeData} {...this.props}/>
                <section>
                    <div className='edit_parameter_list'>
                        <ul>
                            {
                                parameter_list && parameter_list.map((data, index) => {
                                    return (
                                        <li key={'parameter_list' + data.keyIndex}>
                                            <div className="list_row">
                                                <span className='list_count'>{index + 1}</span>
                                                <b onClick={this.close_clickHandler.bind(this, index, 'parameter_list')}>
                                                    <Icon
                                                        type="minus-square"
                                                        style={{
                                                            fontSize: '27px',
                                                            color: '#43a074'
                                                        }}
                                                        className='close_list'/>
                                                </b>
                                                <Select
                                                    onChange={this.editParams_changeHandler.bind(this, 'require', index,-1,-1)}
                                                    defaultValue={String(data.require)}
                                                    style={{minWidth: '30px'}}
                                                    className='edit_method'>
                                                    <Option value="0">选填</Option>
                                                    <Option value="1">必填</Option>
                                                </Select>
                                                <label className='list_name'>参数名称：<Input
                                                    className="list_input"
                                                    placeholder="Basic usage"
                                                    onChange={this.editParamsInput_changeHandler.bind(this, 'paramsName', index, -1,-1)}
                                                    defaultValue={data.key || ''}/></label>
                                                <label className='list_name'>参数类型：
                                                    <Select
                                                        showSearch
                                                        style={{ width: 80 }}
                                                        placeholder="参数类型"
                                                        defaultValue={String(data.type)}
                                                        optionFilterProp="children"
                                                        onChange={this.checkType_changeHandler.bind(this,'typeFirst',index,-1,-1)}
                                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    >
                                                        {
                                                            optionArr.map((obj) => {
                                                                return <Option value={obj} key={obj}>{obj}</Option>;
                                                            })
                                                        }
                                                    </Select></label>
                                                <label className='list_explain'>参数说明：<Input
                                                    className="list_input"
                                                    defaultValue={data.des || ''}
                                                    onChange={this.editParamsInput_changeHandler.bind(this, 'paramsDes', index, -1,-1)}
                                                    placeholder="Basic usage"/></label>
                                                <Button className='list_addMaybe' type="primary" icon="plus"
                                                        onClick={this.showMaybeModal.bind(this, index, 'parameter_list')}
                                                        style={{display: parameter_list[index]['subParams'] ? (parameter_list[index]['subParams'].length>0 ? 'none' : 'block') : 'block'}}>参数值可能性</Button>
                                                <Switch onChange={checked => {this.switchMore_changeHandler(index, 'parameter_list', checked)}}
                                                        defaultChecked={this.state.parameter_list[index].display == 'block' ? true : false}
                                                        checkedChildren="简单"
                                                        unCheckedChildren="更多"
                                                        className='switch_btn'/>
                                            </div>
                                            <div className="list_moreCont clearfix"
                                                 style={{display: parameter_list[index].display}}>
                                                <div className="list_mayBeBox">
                                                    {
                                                        data.subParams && data.subParams.map((paramsData, paramsIndex) => {
                                                            return (
                                                                <div
                                                                    className='paramsList_row clearfix'
                                                                    key={'params' + paramsData.keyIndex}>
                                                                                        <span
                                                                                            className='list_count'>{paramsIndex + 1}</span>
                                                                    <Icon
                                                                        onClick={this.closeParams_clickHandler.bind(this, index, paramsIndex, 'parameter_list_list',-1)}
                                                                        type="minus-square"
                                                                        style={{
                                                                            fontSize: '27px',
                                                                            color: '#43a074'
                                                                        }}
                                                                        className='close_list'/>
                                                                    <Select
                                                                        onChange={this.editParams_changeHandler.bind(this, 'requireSecond', index,paramsIndex,-1)}
                                                                        defaultValue={String(paramsData.require)}
                                                                        style={{minWidth: '30px'}}
                                                                        className='edit_method'>
                                                                        <Option value="0">选填</Option>
                                                                        <Option value="1">必填</Option>
                                                                    </Select>
                                                                    <label
                                                                        className='list_mayBe_name'>
                                                                        <span>参数名称：</span>
                                                                        <Input
                                                                            defaultValue={paramsData.key || ''}
                                                                            onChange={this.editParamsInput_changeHandler.bind(this, 'paramsSecondName', index, paramsIndex ,-1)}
                                                                            className="list_mayBe_input"
                                                                            placeholder="Basic usage"/>
                                                                    </label>
                                                                    <label className='list_mayBe_name'>参数类型：
                                                                        <Select
                                                                            showSearch
                                                                            style={{ width: 80 }}
                                                                            placeholder="参数类型"
                                                                            defaultValue={String(paramsData.type)}
                                                                            optionFilterProp="children"
                                                                            onChange={this.checkType_changeHandler.bind(this,'typeSecond',index,paramsIndex,-1)}
                                                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                                        >
                                                                            {
                                                                                optionArr.map((obj) => {
                                                                                    return <Option value={obj} key={obj}>{obj}</Option>;
                                                                                })
                                                                            }
                                                                        </Select></label>
                                                                    <label
                                                                        className='list_mayBe_name'><span>参数说明：</span><Input
                                                                        defaultValue={paramsData.des || ''}
                                                                        onChange={this.editParamsInput_changeHandler.bind(this, 'paramsSecondDes', index, paramsIndex ,-1)}
                                                                        className="list_mayBeDescribe_input"
                                                                        placeholder="Basic usage"/></label>
                                                                    <Button className='list_addMaybe' type="primary" icon="plus"
                                                                            onClick={this.showMaybeModal.bind(this, index, 'parameter_list_list',paramsIndex)}
                                                                            style={{display: parameter_list[index]['subParams'] ? (parameter_list[index]['subParams'][paramsIndex]['subParams'].length>0 ? 'none' : 'block'):'block'}}>参数值可能性</Button>
                                                                    <Switch onChange={checked => {this.switchMore_changeHandler(index, 'parameter_list_list', checked, paramsIndex)}}
                                                                            defaultChecked={(this.state.parameter_list[index]['subParams'] && this.state.parameter_list[index]['subParams'].length > 0) ? (this.state.parameter_list[index]['subParams'][paramsIndex].display == 'block' ? true : false) : false}
                                                                            checkedChildren="简单"
                                                                            unCheckedChildren="更多"
                                                                            className='switch_btn'/>


                                                                    <div className="list_moreCont clearfix"
                                                                         style={{display: parameter_list[index]['subParams'][paramsIndex].display}}>
                                                                        <div className="list_mayBeBox">
                                                                            {
                                                                                paramsData.subParams && paramsData.subParams.map((listData, listIndex) => {
                                                                                    return (
                                                                                        <div
                                                                                            className='paramsList_row clearfix'
                                                                                            key={'params' + listData.keyIndex}>
                                                                                                                <span
                                                                                                                    className='list_count'>{listIndex + 1}</span>
                                                                                            <Icon
                                                                                                onClick={this.closeParams_clickHandler.bind(this, index,paramsIndex, 'parameter_list_list_list', listIndex)}
                                                                                                type="minus-square"
                                                                                                style={{
                                                                                                    fontSize: '27px',
                                                                                                    color: '#43a074'
                                                                                                }}
                                                                                                className='close_list'/>
                                                                                            <Select
                                                                                                onChange={this.editParams_changeHandler.bind(this, 'requireThird', index,paramsIndex,listIndex)}
                                                                                                defaultValue={String(listData.require)}
                                                                                                style={{minWidth: '30px'}}
                                                                                                className='edit_method'>
                                                                                                <Option value="0">选填</Option>
                                                                                                <Option value="1">必填</Option>
                                                                                            </Select>
                                                                                            <label
                                                                                                className='list_mayBe_name'>
                                                                                                <span>参数名称：</span>
                                                                                                <Input
                                                                                                    defaultValue={listData.key || ''}
                                                                                                    onChange={this.editParamsInput_changeHandler.bind(this, 'paramsThirdName', index,paramsIndex, listIndex)}
                                                                                                    className="list_mayBe_input"
                                                                                                    placeholder="Basic usage"/>
                                                                                            </label>
                                                                                            <label className='list_mayBe_name'>参数类型：
                                                                                                <Select
                                                                                                    showSearch
                                                                                                    style={{ width: 80 }}
                                                                                                    placeholder="参数类型"
                                                                                                    defaultValue={String(listData.type)}
                                                                                                    optionFilterProp="children"
                                                                                                    onChange={this.checkType_changeHandler.bind(this,'typeThird',index,paramsIndex,listIndex)}
                                                                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                                                                >
                                                                                                    {
                                                                                                        optionArr.map((obj) => {
                                                                                                            return <Option value={obj} key={obj}>{obj}</Option>;
                                                                                                        })
                                                                                                    }
                                                                                                </Select></label>
                                                                                            <label
                                                                                                className='list_mayBe_name'><span>参数说明：</span><Input
                                                                                                defaultValue={listData.des || ''}
                                                                                                onChange={this.editParamsInput_changeHandler.bind(this, 'paramsThirdDes', index,paramsIndex, listIndex)}
                                                                                                className="list_mayBeDescribe_input"
                                                                                                placeholder="Basic usage"/></label>
                                                                                            <Button className='list_addMaybe' type="primary" icon="plus"
                                                                                                    onClick={this.showMaybeModal.bind(this, index, 'parameter_list_list_list',paramsIndex,listIndex)}>参数值可能性</Button>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                            <div>

                                                                            </div>
                                                                            <Button
                                                                                onClick={this.addParams_clickHandler.bind(this, index, 'parameter_list_list',paramsIndex)}
                                                                                type="primary" icon="plus"
                                                                                style={{padding: '0 10px'}}>添加</Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    <div>

                                                    </div>
                                                    <Button
                                                        onClick={this.addParams_clickHandler.bind(this, index, 'parameter_list')}
                                                        type="primary" icon="plus"
                                                        style={{padding: '0 10px'}}>添加</Button>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                            }

                        </ul>
                    </div>
                    <div className="list_addBtn">
                        <Button type="primary" icon="plus" onClick={this.add_clickHandler.bind(this, 'parameter_list')}
                                style={{padding: '0 10px'}}>添加</Button>
                    </div>
                </section>
            </div>
        )
    }

}