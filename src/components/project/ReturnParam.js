import React from "react";
import {Link} from "react-router-dom";
import {Button, Icon, Input, Modal, Select, Switch, message} from "antd";
import {paramsFormat} from "~common/http";
import Utils from '~utils'
import _ from 'lodash';

export default class ApiEditContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            returnData_list: [],
            queryData: Utils.parseUrlToData(this.props.location.search),
        }
    }

    componentWillMount() {
        this.dealData();
    }

    /*
     * 显示 更多 参数
     *
     * */
    switchMore_changeHandler(index, checked) {
        let returnData_list = this.state.returnData_list;
        returnData_list[index]['display'] = checked ? 'block' : 'none';

        this.setState({
            returnData_list
        });
    }

    /*
     * 移除 请求 参数
     *
     * */
    close_clickHandler(index, e) {
        e.preventDefault()
        let returnData_list = this.state.returnData_list;
        returnData_list.splice(index, 1);

        this.setState({
            returnData_list
        });
    }

    /*
     * 移除 请求参数 字段
     *
     * */
    closeParams_clickHandler(index, paramsIndex, e) {
        e.preventDefault()
        let returnData_list = this.state.returnData_list;
        returnData_list[index].value.splice(paramsIndex, 1);

        this.setState({
            returnData_list
        });
    }


    /*
     * 添加 请求 返回说明 和 参数
     *
     * */
    add_clickHandler(e) {
        e.preventDefault()
        let returnData_list = this.state.returnData_list;
        returnData_list.push({
            'display': 'none',
            'include': '1',
            'returnDataKey': '',
            'returnDataDes': '',
            keyIndex: parseInt(Math.ceil(Math.random() * 1000) + '' + new Date().getTime()),
            value: []
        });

        this.setState({
            returnData_list
        });
    }

    /*
     * 添加 返回说明 字段
     *
     * */
    addParams_clickHandler(index) {
        let returnData_list = this.state.returnData_list;
        returnData_list[index].value.push({
            valueCont: '',
            valueDes: "",
            valIndex: parseInt(Math.ceil(Math.random() * 1000) + '' + new Date().getTime())
        });

        this.setState({
            returnData_list
        });
    }

    /*
     * 返回说明下拉框 事件
     * */
    editParams_changeHandler(selectType, index, val) {
        switch (selectType) {
            case 'include' :
                let returnData_list = this.state.returnData_list;
                returnData_list[index].include = val;

                this.setState({
                    returnData_list
                });
                break;
            default:
                break
        }
    }

    /*
     * 给 返回说明 input 绑定事件 赋值
     * */
    editParamsInput_changeHandler(selectType, index, paramsIndex, e) {
        let returnData_list = this.state.returnData_list;
        switch (selectType) {
            case 'returnDataKey' :
                returnData_list[index].returnDataKey = e.target.value;
                break;
            case 'returnDataDes' :
                returnData_list[index].returnDataDes = e.target.value;
                break;
            case 'returnDataMayBeName' :
                returnData_list[index]['value'][paramsIndex].valueCont = e.target.value;
                break;
            case 'returnDataMayBeDes' :
                returnData_list[index]['value'][paramsIndex].valueDes = e.target.value;
                break;
            default:
                break
        }

        this.setState({
            returnData_list
        })
    }


    /*
     * 处理 数据
     * */
    dealData() {
        this.setState({
            returnData_list: this.props.returnParame,
        })
    }

    fromEditContainerData(returnData_list) {
        this.setState({
            returnData_list
        })
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

    getReturnParamData(){
        return this.state.returnData_list
    }


    render() {
        const Option = Select.Option;
        const {returnData_list} = this.state;

        return (
            <div>
                {/*----------------------- 返回说明----------------------------*/}
                <section>
                    <div className='edit_parameter_list'>
                        <ul>
                            {
                                returnData_list && returnData_list.map((data, index) => {
                                    return (
                                        <li id='returnParamsList' key={'returnData_list' + data.keyIndex}>
                                            <div className="list_row">
                                                <span className='list_count'>{index + 1}</span>
                                                <b onClick={this.close_clickHandler.bind(this, index)}>
                                                    <Icon
                                                        type="minus-square"
                                                        style={{
                                                            fontSize: '27px',
                                                            color: '#43a074'
                                                        }}
                                                        className='close_list'/>
                                                </b>
                                                <Select defaultValue={String(data.include)}
                                                        getPopupContainer={() => document.getElementById('returnParamsList')}
                                                        style={{minWidth: '30px'}}
                                                        onChange={this.editParams_changeHandler.bind(this, 'include', index)}
                                                        className='edit_method'>
                                                    <Option value="1">必含</Option>
                                                    <Option value="0">非必含</Option>
                                                </Select>
                                                <label className='list_name'>字段名称 ：<Input
                                                    className="list_input"
                                                    placeholder="Basic usage"
                                                    onChange={this.editParamsInput_changeHandler.bind(this, 'returnDataKey', index, -1)}
                                                    defaultValue={data.returnDataKey || ''}/></label>
                                                <label className='list_name'>字段说明 ：<Input
                                                    className="list_input"
                                                    defaultValue={data.returnDataDes || ''}
                                                    onChange={this.editParamsInput_changeHandler.bind(this, 'returnDataDes', index, -1)}
                                                    placeholder="Basic usage"/></label>
                                                <Switch onChange={checked => {
                                                    this.switchMore_changeHandler(index, checked)
                                                }}
                                                        defaultChecked={returnData_list[index].display == 'block' ? true : false}
                                                        checkedChildren="简单" unCheckedChildren="更多"
                                                        className='switch_btn'/>
                                            </div>
                                            <div className="list_moreCont clearfix"
                                                 style={{display: returnData_list[index].display}}>
                                                <span className='list_mayBeName'>值可能性 :</span>
                                                <div className="list_mayBeBox">
                                                    {
                                                        data.value && data.value.map((paramsData, paramsIndex) => {
                                                            return (
                                                                <div
                                                                    className='paramsList_row clearfix'
                                                                    key={'params' + paramsData.valIndex}>
                                                                    <span
                                                                        className='list_count'>{paramsIndex + 1}</span>
                                                                    <Icon
                                                                        onClick={this.closeParams_clickHandler.bind(this, index, paramsIndex)}
                                                                        type="minus-square"
                                                                        style={{
                                                                            fontSize: '27px',
                                                                            color: '#43a074'
                                                                        }}
                                                                        className='close_list'/>
                                                                    <label
                                                                        className='list_mayBe_name'>
                                                                        <Input
                                                                            defaultValue={paramsData.valueCont || ''}
                                                                            onChange={this.editParamsInput_changeHandler.bind(this, 'returnDataMayBeName', index, paramsIndex)}
                                                                            className="list_mayBe_input"
                                                                            placeholder="Basic usage"/>
                                                                    </label>
                                                                    <label
                                                                        className='list_mayBe_name'><span>值说明：</span><Input
                                                                        defaultValue={paramsData.valueDes || ''}
                                                                        onChange={this.editParamsInput_changeHandler.bind(this, 'returnDataMayBeDes', index, paramsIndex)}
                                                                        className="list_mayBeDescribe_input"
                                                                        placeholder="Basic usage"/></label>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    <div>

                                                    </div>
                                                    <Button
                                                        onClick={this.addParams_clickHandler.bind(this, index)}
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
                        <Button type="primary" icon="plus" onClick={this.add_clickHandler.bind(this)}
                                style={{padding: '0 10px'}}>添加</Button>
                    </div>
                </section>
            </div>
        );
    }

}




