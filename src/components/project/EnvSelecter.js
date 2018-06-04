/**
 * Created by VULCAN on 2017/10/26.
 */
import React from 'react';
import {Table, Button, Modal, Select, Input, Popconfirm, Col, Icon, Switch, message} from 'antd';
import {Link} from 'react-router-dom';
import {paramsFormat} from '~common/http';
import Utils from '~utils'
import {API_HOST} from '~constants/api-host';


export default class ApiEnvContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queryData: Utils.parseUrlToData(this.props.location.search) || {},
            modal: '',
            url: '',
            envStatus: ''
        }
    }

    /**
     * 选择环境Table
     **/
    environmental(testenv, item, value) {
        if (value === 'manager') {
            this.state.modal = Modal.success({
                title: '管理测试环境',
                content: <div>
                    {
                        testenv.map((environmental, index) => {
                            return (
                                <div key={index}>
                                    <div id={'environmental' + index}>
                                        <Col span={4}>
                                            <div>{environmental.name}</div>
                                        </Col>
                                        <Col span={1}></Col>
                                        <Col span={12}>
                                            <div>{environmental.URI}</div>
                                        </Col>
                                        <Col span={1}></Col>
                                        <Col span={4}>
                                            <div>
                                                <Button type="primary" icon="edit"
                                                        onClick={this.editEnvironmental.bind(this, index)}></Button>

                                                <Popconfirm placement="rightTop" title='确认删除'
                                                            onConfirm={this.deleteEnvironmental.bind(this,testenv, index)}
                                                            okText="Yes" cancelText="No">
                                                    <Button type="primary" icon="delete"></Button>
                                                </Popconfirm>
                                            </div>
                                        </Col>
                                        <div className="modal-line"></div>
                                    </div>
                                    <div style={{display: 'none'}} id={'editenvironmental' + index}>
                                        <Col span={4}>
                                            <Input id={'environmentalName' + index} placeholder="环境名称"
                                                   defaultValue={environmental.name}/>
                                        </Col>
                                        <Col span={1}></Col>
                                        <Col span={12}>
                                            <Input id={'environmentalUrl' + index} placeholder="环境地址URL"
                                                   defaultValue={environmental.URI}/>
                                        </Col>
                                        <Col span={1}></Col>
                                        <Col span={4}>
                                            <div>
                                                <Button type="primary"
                                                        onClick={this.saveEnvironmental.bind(this, testenv, index)}>保存</Button>
                                            </div>
                                        </Col>
                                        <div className="modal-line"></div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div>
                        <Col span={4}>
                            <div>
                                <Input id='environmentalName' placeholder="环境名称"/>
                            </div>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={12}>
                            <div>
                                <Input id='environmentalUrl' placeholder="环境地址URL"/>
                            </div>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={4}>
                            <Button type="primary" icon="plus"
                                    onClick={this.addEnvironmental.bind(this)}>添加</Button>
                        </Col>
                    </div>
                </div>,
                okText: '关闭',
                width: 600
            });
        } else if (value === 'mock') {
            let mockHost = API_HOST.substring(7) + '/mock'
            let url = Utils.foramtUrl(mockHost, item.URI);
            this.setState({
                url,
                envStatus: mockHost
            })
            this.returnUrl(url, mockHost);
        } else {
            let url = Utils.foramtUrl(value, item.URI);
            this.setState({
                url,
                envStatus: value
            })
            this.returnUrl(url, value);
        }
    }

    /**
     * 添加选择环境
     **/
    addEnvironmental() {
        let name = document.getElementById('environmentalName').value;
        let URI = document.getElementById('environmentalUrl').value;
        if (name === '' || URI === '') return;
        this.props.fetchUpdateAddTestEnv(paramsFormat({
            name,
            URI,
            projectid: this.state.queryData.projectId
        }));

        this.state.modal.destroy();
    }

    /**
     * 修改选择环境
     **/
    editEnvironmental(index) {
        let environmental = document.getElementById('environmental' + index);
        let editenvironmental = document.getElementById('editenvironmental' + index);

        environmental.style.display = 'none';
        editenvironmental.style.display = 'block';
    }

    /**
     * 保存选择环境
     **/
    saveEnvironmental(testenv, index) {
        let name = document.getElementById('environmentalName' + index).value;
        let URI = document.getElementById('environmentalUrl' + index).value;


        if (name === '' || URI === '') return;
        this.props.fetchUpdateAddTestEnv(paramsFormat({
            id: testenv[index]['_id'],
            name,
            URI,
            projectid: this.state.queryData.projectId
        }));
        this.state.modal.destroy();
    }

    /**
     * 删除选择环境
     **/
    deleteEnvironmental(testenv, index) {
        this.props.fetchTestEnv(paramsFormat({
            id: testenv[index]['_id'],
        }));
        this.state.modal.destroy();
    }

    /**
     * 修改过的URL返回给父组件
     **/
    returnUrl(url, envStatus) {
        if (this.props.onSubmitUrl) {
            this.props.onSubmitUrl(url, envStatus);
        }
    }

    render() {
        const {testenv} = this.props.entity;
        const Option = Select.Option;
        let environmental = '';
        let item = this.props.item || '';
        return (<div style={{float: 'right'}}>
            {
                testenv && (() => {

                    if (testenv.items) {
                        let option = testenv.items.map((environmental, index) => {
                            return <Option value={environmental.URI} key={index + 2}>
                                {environmental.name}
                            </Option>
                        })
                        environmental = (
                            <Select defaultValue="mock" style={{width: 180, float: 'right'}}
                                    onSelect={this.environmental.bind(this, testenv.items, item)}
                                    ref={selectChoice => this.selectChoice = selectChoice}>
                                <Option value="manager" key='0'>管理测试环境</Option>
                                <Option value="mock" key='1'>mock测试环境</Option>
                                {option}
                            </Select>)

                    }
                })()
            }
            {environmental}
        </div>)
    }
}