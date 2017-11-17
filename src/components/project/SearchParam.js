import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Input, Modal, Select, Switch, message } from "antd";
import { paramsFormat } from "~common/http";
import Utils from '~utils';
import { ParamType } from '~constants/param-type';
import _ from 'lodash';

export default class SearchParam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paramList: [],
            isValidate: false,
            searchList: [],
            paramItemList: []
        }
        this.queryData = Utils.parseUrlToData(this.props.location.search)
    }

    componentWillMount() {
        this.dealData();
    }
    /*
     * 处理 数据
     * */
    dealData() {
        let paramItemList = _.flattenDeep(this.props.searchParam.map(val => val.paramList))
        this.setState({
            paramList: this.props.paramList,
            paramItemList
        })
    }
    /*
     * 给 返回说明 和 参数说明 input 绑定事件 赋值
     * */
    inputHandler(stateVal, index, e) {
        let paramList = this.state.paramList;
        paramList[index][stateVal] = e.target.value;
        this.setState({
            paramList,
            isValidate: false
        })
        this.props.paramHandler(paramList);
    }
    /*
     * 给 选择类型 select 绑定事件 赋值
     * */
    selectHandler(index, val) {
        let paramList = this.state.paramList;
        paramList[index]['type'] = val;
        this.setState({
            paramList
        })
        this.props.paramHandler(paramList);
    }
    /*
     * 移除 请求参数 字段
     *
     * */
    delParamHandler(index, e) {
        e.preventDefault()
        let paramList = this.state.paramList;

        paramList.splice(index, 1);
        this.setState({
            paramList
        })

        this.props.paramHandler(paramList);
    }
    /*
     * 添加 请求 返回说明 和 参数
     *
     * */
    addParam(e) {
        e.preventDefault()
        let paramList = this.state.paramList;
        if (this.state.searchList.length > 0) {
            this.state.searchList.map((val, index) => {
                let item = this.state.paramItemList.filter(value => value.id == val)[0]
                paramList.push({
                    'name': item.name,
                    'type': item.type,
                    'des': item.des,
                    'id': new Date().getTime() +''+ Math.ceil((Math.random() * 100000))+''
                });
            })
        } else {
            paramList.push({
                'name': '',
                'type': '缺省',
                'des': '',
                'id': new Date().getTime() +''+ Math.ceil((Math.random() * 100000))+''
            });
        }

        this.setState({
            paramList,
            searchList: []
        })
        this.props.paramHandler(paramList);
    }
    /**
     * 验证是否有空字段
     * */
    validate() {
        this.isValidate = true
        return this.state.paramList.some((val) => val.name == '' || val.des == '')

    }

    searchSelect(searchList) {
        this.setState({
            searchList
        })
    }

    render() {
        const { Option, OptGroup } = Select;
        const { paramList } = this.state;
        console.log('234234', this.props.searchParam)
        return (
            <div>
                {/*----------------------- 返回说明----------------------------*/}
                <section>
                    <div className='edit_parameter_list'>
                        <ul>
                            {
                                paramList && paramList.map((data, index) => {
                                    return (
                                        <li key={'paramList' + index}>
                                            <div className="list_row">
                                                <span className='list_count'>{index + 1}</span>

                                                <label className='list_name'>字段名称 ：<Input
                                                    className={!data.name && this.isValidate ? "list_input edit_input g-errorTip" : "list_input edit_input"}
                                                    placeholder="Basic usage"
                                                    onChange={this.inputHandler.bind(this,'name',index)}
                                                    defaultValue={data.name || ''}
                                                    value={data.name || ''}/></label>
                                                <label className='list_name'>参数类型 ：
                                                    <Select defaultValue={data.type || '缺省' }
                                                            style={{minWidth: '30px', 'float':'right'}}
                                                            onChange={this.selectHandler.bind(this, index)}
                                                            className='edit_method'>
                                                        <Option value="缺省">缺省</Option>
                                                            {ParamType && ParamType.map((val,index)=>(<Option key={'param'+index} value={val}>{val}</Option>))}
                                                    </Select>
                                               </label>
                                                <label className='list_name'>字段说明 ：<Input
                                                    style={{width:'350px'}}
                                                    className={!data.des && this.isValidate ? "list_input edit_input g-errorTip" : "list_input edit_input"}
                                                    defaultValue={data.des || ''}
                                                    onChange={this.inputHandler.bind(this,'des',index)}
                                                    placeholder="Basic usage"
                                                    value={data.des || ''}/></label>
                                                    <b onClick={this.delParamHandler.bind(this, index)}>
                                                    <Icon
                                                        type="minus-square"
                                                        style={{
                                                            fontSize: '27px',
                                                            color: '#43a074',
                                                            cursor:'pointer'
                                                        }}
                                                        className='close_list'/>
                                                </b>
                                               
                                            </div>
                                           
                                        </li>
                                    )
                                })
                            }

                        </ul>
                    </div>
                    <div className="list_addBtn" id='list_addBtn'>
                {/*----------------------------------------------
                    <Select
                        mode="multiple"
                        style={{ width: '50%','marginRight':'10px'}}
                        placeholder="Please select"
                        defaultValue={[]}
                        value={this.state.searchList}
                        onChange={this.searchSelect.bind(this)}
                        getPopupContainer={() => document.getElementById('list_addBtn')}
                      >
                         {this.props.searchParam && this.props.searchParam.map((val,index)=>(

                             <OptGroup label={'状态码：'+val.name} key={val.name+index}>
                                {
                                    val.paramList.map((value,ind)=>(<Option key={'param'+value.id+ind} value={value.id}>{value.name}</Option>))
                                }
                             </OptGroup>
                            ))}
                      </Select>
                    */}
                        <Button type="primary" icon="plus" onClick={this.addParam.bind(this)}
                                style={{padding: '0 10px'}}>添加</Button>
                    </div>
                </section>
            </div>
        );
    }

}