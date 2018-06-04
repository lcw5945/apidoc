/**
 * Created by VULCAN on 2017/11/17.
 */

import React from 'react';
import {Link} from "react-router-dom";
import {Button, Icon, Input, Modal, Select, Switch, message, Radio, Form} from "antd";
import Utils from '~utils'
import _ from 'lodash';

export default class UseCase extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            useCase: props.useCase,
            errorClickStatus: false
        }
    }


    /**
     * 给输入框 绑定事件 赋值
     **/
    input_changeHandler(index, type, e) {
        let useCase = this.state.useCase;
        let errorClickStatus = this.state.errorClickStatus;
        if (type === 'param') {
            useCase[index].param = e.target.value;
            errorClickStatus = false
        } else {
            useCase[index].value = e.target.value;
        }
        this.setState({useCase, errorClickStatus})
    }

    /**
     * 给下拉框 绑定事件 赋值
     **/
    select_changeHandler(index, type, val) {
        let useCase = this.state.useCase;
        if (type === 'type') {
            useCase[index].type = val;
            useCase[index].judge = 'none';
        } else {
            useCase[index].judge = val;
        }
        this.setState({useCase})
    }

    /**
     * 添加 断言
     **/
    add_useCase(e) {
        e.preventDefault();
        let useCase = this.state.useCase;
        if (useCase.length > 0) {
            if (this.isUseCaseParamNull(useCase)) {
                useCase.push({
                    param: '',
                    type: 'none',
                    judge: 'none',
                    value: '',
                    keyIndex: Math.random() * 10 + new Date().getTime(),
                });
            } else {
                this.setState({
                    errorClickStatus: true
                })
            }
        } else {
            useCase.push({
                param: '',
                type: 'none',
                judge: 'none',
                value: '',
                keyIndex: Math.random() * 10 + new Date().getTime(),
            });
        }
        this.setState({useCase})
    }

    /**
     * 移除 断言
     **/
    remove_useCase(index, e) {
        e.preventDefault();
        let useCase = this.state.useCase;
        useCase.splice(index, 1);
        this.setState({useCase})
    }

    /**
     * 获取断言数据
     **/
    getUseCase() {
        let useCase = this.state.useCase;
        if (this.isUseCaseParamNull(useCase)) {
            return this.state.useCase;
        } else {
            this.setState({
                errorClickStatus: true
            })
            return [];
        }
    }

    /**
     * 返回断言所有参数是否填写
     **/
    isUseCaseParamNull(useCase) {
        let returnValue = true;
        useCase.map((data, index) => {
            if (!data.param) returnValue = false;
        })
        return returnValue;
    }

    render() {
        const useCase = this.state.useCase = this.props.useCase;
        const Option = Select.Option;

        return (
            <div className="use-case-list" id="use-case-list">
                <ul>
                    {
                        useCase && useCase.map((data, index) => {
                            let judgeOption = [];
                            switch (this.state.useCase[index].type) {
                                case 'int' :
                                case 'long' :
                                    judgeOption.push(<Option value="big" key="2">大于</Option>)
                                    judgeOption.push(<Option value="min" key="3">小于</Option>)
                                    break;
                                case 'string' :
                                case 'object' :
                                case 'array' :
                                    judgeOption.push(<Option value="contain" key="2">包含</Option>)
                                default:
                                    break;
                            }
                            return (
                                <li key={'use-case-list' + data.keyIndex}>
                                    <div className="list_row">
                                        <span className='list_count'>{index + 1}</span>
                                        <b onClick={this.remove_useCase.bind(this, index)}>
                                            <Icon
                                                type="minus-square"
                                                style={{fontSize: '27px', color: '#43a074'}}
                                                className='close_list'/>
                                        </b>
                                        <label htmlFor="list_name">参数：
                                            <Input id="list_name"
                                                   className={!data.param && this.state.errorClickStatus ? "edit_input g-errorTip" : "edit_input"}
                                                   placeholder="请输入需要断言的参数"
                                                   onChange={this.input_changeHandler.bind(this, index, 'param')}
                                                   defaultValue={data.param}/>
                                        </label>
                                        <label>类型：
                                            <Select value={data.type} style={{width: '100px'}}
                                                    onChange={this.select_changeHandler.bind(this, index, 'type')}>
                                                <Option value="none">无</Option>
                                                <Option value="int">int</Option>
                                                <Option value="string">string</Option>
                                                <Option value="long">long</Option>
                                                <Option value="object">object</Option>
                                                <Option value="array">array</Option>
                                            </Select>
                                        </label>
                                        <label className="judge">值：
                                            <Select value={data.judge} style={{width: '100px', marginRight: '36px'}}
                                                    onChange={this.select_changeHandler.bind(this, index, 'judge')}>
                                                <Option value="none" key="0">无</Option>
                                                <Option value="equal" key="1">等于</Option>
                                                {judgeOption}
                                                {/*<Option value="big">大于</Option>
                                                 <Option value="min">小于</Option>
                                                 <Option value="contain">包含</Option>*/}
                                            </Select>
                                            <Input className="list_input" style={{width: '170px'}}
                                                   placeholder="请输入需要判断的数值"
                                                   onChange={this.input_changeHandler.bind(this, index, 'value')}
                                                   defaultValue={data.value}/>
                                        </label>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
                <Button type="primary" icon="plus" style={{padding: '0 10px'}}
                        onClick={this.add_useCase.bind(this)}>添加</Button>
            </div>
        )
    }
}