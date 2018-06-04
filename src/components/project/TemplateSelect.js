import React from 'react';
import {Table, Button, Modal, Select, Input, Popconfirm, Col, Icon, Switch, message} from 'antd';
import {Link} from 'react-router-dom';
import {paramsFormat} from '~common/http';
import Utils from '~utils'
import {API_HOST} from '~constants/api-host';


export default class TemplateSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queryData: Utils.parseUrlToData(this.props.location.search),
            tempData: [],
            modalVisible: false,
            pageType: this.props.type,
            selectValue:'manager'
        }
    }

    componentWillMount() {
        this.dealData();
    }

    /**
     * 管理接口模板弹窗
     **/
    templateModal(value) {
        if (value === 'manager') {
            this.setState({
                modalVisible: true
            })
        } else {
            this.props.refreshPage(value);
            if(this.state.pageType === 'eidtItemplete'){
                this.props.history.push(`/project/itemplete/edit?projectId=${this.state.queryData.projectId}&groupId=-1&apiId=${this.state.queryData.apiId}&itempleteId=${value}`)
            }
        }

        this.setState({
            selectValue: value
        })
    }

    /**
     * 模板隐藏
     * */
    modalHide() {
        this.setState({
            modalVisible: false
        })
    }

    /**
     * 添加或者修改模板
     **/
    addOrEditTemplate(id) {
        if(this.state.pageType === 'eidtItemplete'){
            this.props.refreshPage(id);
            this.setState({
                modalVisible: false,
                selectValue:id == 0 ? 'manager' : id
            });
        }

        this.setState({
            modalVisible: false,
        });

        this.props.history.push(`/project/itemplete/edit?projectId=${this.state.queryData.projectId}&groupId=-1&apiId=${this.state.queryData.apiId}&itempleteId=${id}`)
    }

    /**
     * 删除模板
     **/
    delTemplate(id) {
        this.props.fetchDelITemplete(paramsFormat({id}));
    }

    /**
     * 数据获取
     * */
    dealData() {
        this.props.fetchITempleteCheckList(paramsFormat({projectId:this.state.queryData.projectId}), (data) => {
            this.setState({
                tempData: data.details
            })
        });

        if(this.state.pageType === 'eidtItemplete'){
            this.setState({
                selectValue: this.state.queryData.itempleteId == 0 ? 'manager' : this.state.queryData.itempleteId
            });
        }
    }



    render() {
        const Option = Select.Option;
        let templateData = this.state.tempData;
        let templateDom = '';

        return (<div id='templateSelect' style={{float: 'right'}}>
            {
                templateData && (() => {
                    let option = templateData.map((data, index) => {
                        return <Option value={data._id} key={data._id}>
                            {data.name}
                        </Option>
                    })
                    templateDom = (
                        <Select ref='selectTemplate' defaultValue='manager' value={this.state.selectValue} style={{width: 180, float: 'right'}}
                                onSelect={this.templateModal.bind(this)}
                                getPopupContainer={() => document.getElementById('templateSelect')}>
                            <Option value="manager" key='0'>管理接口模板</Option>
                            {option}
                        </Select>)
                })()
            }
            {templateDom}


            <Modal
                title="接口模板管理"
                visible={this.state.modalVisible}
                footer={null}
                width={400}
                onCancel={this.modalHide.bind(this)}>
                <div>
                    {
                        this.state.tempData.map((temp, index) => {
                            return (
                                <div key={index}>
                                    <div id={'templateList' + index}>
                                        <Col span={12}>
                                            <div style={{paddingLeft: '50px'}}>{temp.name}</div>
                                        </Col>
                                        <Col span={12}>
                                            <div style={{paddingLeft: '50px'}}>
                                                <Button style={{marginRight: '5px'}} type="primary" icon="edit"
                                                        onClick={this.addOrEditTemplate.bind(this, temp._id)}></Button>

                                                <Popconfirm placement="rightTop" title='确认删除'
                                                            onConfirm={this.delTemplate.bind(this, temp._id)}
                                                            okText="Yes" cancelText="No">
                                                    <Button type="primary" icon="delete"></Button>
                                                </Popconfirm>
                                            </div>
                                        </Col>
                                        <div className="modal-line"></div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <Col style={{textAlign: 'center'}}>
                        <Button type="primary" icon="plus"
                                onClick={this.addOrEditTemplate.bind(this,'0')}>添加</Button>
                    </Col>
                </div>
            </Modal>
        </div>)
    }
}