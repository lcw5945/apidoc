/**
 * Created by VULCAN on 2017/11/6.
 */
import React from 'react';
import {Link} from "react-router-dom";
import {Button, Icon, Input, Modal, Select, Switch, message, Radio, Form} from "antd";
import Utils from '~utils'
import _ from 'lodash';

export default class RequestHead extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            requestHead: [],
            headKey: {},
        }
    }


    /**
     * 给下拉框 绑定事件 赋值
     **/
    testSelect_changeHandler(index, val) {
        let requestHead = this.state.requestHead;
        let headKey = this.state.headKey;
        requestHead[index].key = val;
        headKey[index] = val;
        this.setState({
            requestHead,
            headKey
        })
        this.props.OnfromSubRequestHeadData(requestHead);
    }

    /**
     * 给输入框 绑定事件 赋值
     **/
    testInput_changeHandler(index, e) {
        let requestHead = this.state.requestHead;
        requestHead[index].require = e.target.value;
        this.setState({
            requestHead
        })
        this.props.OnfromSubRequestHeadData(requestHead);
    }

    /**
     * 添加 请求头 和 参数
     **/
    add_clickHandler(e) {
        e.preventDefault();
        let requestHead = this.state.requestHead;
        requestHead.push({
            'status': 1,
            'require': '',
            'key': '',
            'des': '',
            keyIndex: Math.random() * 10 + new Date().getTime(),
            value: []
        });
        this.setState({
            requestHead
        })
        this.props.OnfromSubRequestHeadData(requestHead);
    }

    /**
     * 选择 请求头 和 参数
     **/
    switch_changeHandler(e, index, checked) {
        let requestHead = this.state.requestHead;
        requestHead[index]['status'] = checked ? 1 : 0;
        this.setState({
            requestHead
        })
        this.props.OnfromSubRequestHeadData(requestHead);
    }

    /**
     * 移除 请求头 参数
     **/
    close_clickHandler(index, e) {
        e.preventDefault();
        let requestHead = this.state.requestHead;
        requestHead.splice(index, 1);
        this.setState({
            requestHead
        })
        this.props.OnfromSubRequestHeadData(requestHead);
    }

    render() {
        const requestHead = this.state.requestHead = this.props.requestHead;
        const Option = Select.Option;
        requestHead.forEach((date, index) => {
            this.state.headKey[index] = date.key;
        })

        return (
            <div className="request-head-list" id="request-head-list">
                <ul>
                    {
                        requestHead && requestHead.map((data, index) => {
                            return (
                                <li key={'request-head-list' + data.keyIndex}>
                                    <div className="list_row">
                                        <Switch onChange={checked => {
                                            this.switch_changeHandler(this, index, checked)
                                        }}
                                                className='switch_btn'
                                                checked={Boolean(requestHead[index]['status'])}/>
                                        <span className='list_count'>{index + 1}</span>
                                         <b onClick={this.close_clickHandler.bind(this, index)}>
                                            <Icon
                                                type="minus-square"
                                                style={{fontSize: '27px', color: '#43a074'}}
                                                className='close_list'/>
                                        </b>
                                        <Select placeholder="请求头部的标签" mode="combobox"
                                                onChange={this.testSelect_changeHandler.bind(this, index)}
                                                value={this.state.headKey[index]}
                                                style={{minWidth: '30px'}}
                                                className='edit_method'>
                                            <Option value="Accept">Accept</Option>
                                            <Option
                                                value="Accept-Charset">Accept-Charset</Option>
                                            <Option
                                                value="Accept-Encoding">Accept-Encoding</Option>
                                            <Option
                                                value="Accept-Language">Accept-Language</Option>
                                            <Option value="Accept-Ranges">Accept-Ranges</Option>
                                            <Option value="Authorization">Authorization</Option>
                                            <Option value="Cache-Control">Cache-Control</Option>
                                            <Option value="Connection">Connection</Option>
                                            <Option value="Cookie">Cookie</Option>
                                            <Option
                                                value="Content-Length">Content-Length</Option>
                                            <Option value="Content-Type">Content-Type</Option>
                                            <Option value="Date">Date</Option>
                                            <Option value="Expect">Expect</Option>
                                            <Option value="From">From</Option>
                                            <Option value="Host">Host</Option>
                                            <Option value="If-Match">If-Match</Option>
                                            <Option
                                                value="If-Modified-Since">If-Modified-Since</Option>
                                            <Option value="If-None-Match">If-None-Match</Option>
                                            <Option value="If-Range">If-Range</Option>
                                            <Option value="If-Unmodified-Since">If-Unmodified-Since</Option>
                                            <Option value="Max-Forwards">Max-Forwards</Option>
                                            <Option value="Pragma">Pragma</Option>
                                            <Option value="Proxy-Authorization">Proxy-Authorization</Option>
                                            <Option value="Range">Range</Option>
                                            <Option value="Referer">Referer</Option>
                                            <Option value="TE">TE</Option>
                                            <Option value="Upgrade">Upgrade</Option>
                                            <Option value="User-Agent">User-Agent</Option>
                                            <Option value="Via">Via</Option>
                                            <Option value="Warning">Warning</Option>
                                        </Select>
                                        <label className='list_name'>内容 ：<Input
                                            className="list_input"
                                            placeholder="Basic usage"
                                            onChange={this.testInput_changeHandler.bind(this, index)}
                                            defaultValue={data.require || ''}/></label>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="list_addBtn" onClick={this.add_clickHandler.bind(this)}>
                    <Button type="primary" icon="plus" style={{padding: '0 10px'}}>添加</Button>
                </div>
            </div>
        )
    }
}