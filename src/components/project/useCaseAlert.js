/**
 * Created by VULCAN on 2017/11/20.
 */
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import {message, Row, Button, Input, Col} from 'antd';
import UseCase from "~components/project/UseCase";
import Dialog from "~components/common/Dialog";
import Utils from '~utils';
import {paramsFormat} from '~common/http';

export const useCaseAlert = () => WrappedComponent => class extends Component {


    /**
     * 添加到批处理
     **/
    addPtest(item, index, event) {
        if (event.target.checked) {
            this.props.changeUseCase(item, index, this);
        } else {
            let data = item.history[index].useCase;
            this.props.addPtestCheck(item, index, 0, this);
        }
    }

    /**
     * 修改断言
     **/
    changeUseCase(item, index, _this) {
        let data = item.history[index];
        let dataModal = {
            name: '',
            unit: '',
            useCases: []
        };
        if (data.useCase) {
            dataModal.name = data.useCase.name;
            dataModal.unit = data.useCase.unit;
            dataModal.useCases = data.useCase.useCases;
        }

        Utils.setValueById("dataSourceName", dataModal.name);
        Utils.setValueById("dataSourceUnit", dataModal.unit);

        _this.props.getDialogRef.confirm({
            title: '断言',
            width: '500px',
            content: <div>
                <Row>
                    <Col span={20}>
                        <p>用例名称：</p>
                        <Input defaultValue={dataModal.name} id="dataSourceName" placeholder="请输入用例名称"/>
                    </Col>
                </Row>
                <Row style={{marginTop: "20px"}}>
                    <Col span={20}>
                        <p>用例单元：</p>
                        <Input defaultValue={dataModal.unit} id="dataSourceUnit" placeholder="用例单元"/>
                    </Col>
                </Row>
                <Row style={{marginTop: "20px"}}>
                    <p>断言：</p>
                    <UseCase ref={useCases => _this.useCases = useCases} useCase={dataModal.useCases}/>
                </Row>
            </div>,
            onOk() {
                let dataSource = data.useCase || {};
                dataSource.name = Utils.getValueById('dataSourceName');
                dataSource.unit = Utils.getValueById('dataSourceUnit');
                dataSource.useCases = _this.useCases.getUseCase();
                if (!dataSource.name) {
                    message.error("请输入用例名称")
                    return false;
                }
                if (!dataSource.unit) {
                    message.error("请输入用例单元")
                    return false;
                }
                if (dataSource.useCases.length < 1) {
                    message.error("请输入需断言的参数")
                    return false;
                }

                item.history[index].useCase = dataSource;
                _this.props.addPtestCheck(item, index, 1, _this);
            },
            onCancel() {
            },
        });
    }

    /**
     * 修改批处理按钮的选中状态
     **/
    addPtestCheck(item, index, number, _this) {
        let history = item.history;
        let data = item.history[index].useCase;
        history[index].addPtest = number;
        history[index].useCase = data;
        _this.props.fetchUpdateAddInterface(paramsFormat({
            id: item._id,
            projectId: item.projectId,
            history
        }));
    }

    render() {
        return (<div>
            <Dialog ref="getDialog"/>
            <WrappedComponent {...this.props} addPtest={this.addPtest} changeUseCase={this.changeUseCase}
                              addPtestCheck={this.addPtestCheck} getDialogRef={this.refs.getDialog}/>
        </div>);
    }
}