/**
 * Created by Cray on 2017/8/7.
 */

import React from 'react';
import {paramsFormat} from '~common/http';
import {Form, Input, Tooltip, Icon, Button, Card, Select, message } from 'antd';

@Form.create({})
export default class RegisterContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            confirmDirty: false,
            queryData: {},  //URL携带的参数
        }
    }

    /**
     * 提交修改密码
     * @param e
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                this.props.fetchRegUser(paramsFormat(values), ()=>{
                    message.success('注册成功!');
                });
                this.props.form.resetFields();
            }
        });
    }
    /**
     * 确认框失去焦点
     * @param e
     */
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }
    /**
     * 检查密码
     * @param rule
     * @param value
     * @param callback
     */
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }
    /**
     * 检测确认密码
     * @param rule
     * @param value
     * @param callback
     */
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }

    handleSelectChange = (value) => {
        console.log(value);
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {getFieldDecorator} = this.props.form;
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {auth} = this.props.user;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };

        let FormHTML = <Form onSubmit={this.handleSubmit}>
            <FormItem
                {...formItemLayout}
                label={(
                    <span>用户名&nbsp;
                        <Tooltip title="用户名不允许数据特殊字符和中文?">
                                        <Icon type="question-circle-o"/>
                                    </Tooltip>
                                </span>
                )}
                hasFeedback
            >
                {getFieldDecorator('username', {
                    rules: [{required: true, message: '请输入用户名!', whitespace: true}],
                })(
                    <Input />
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="密码"
                hasFeedback
            >
                {getFieldDecorator('password', {
                    rules: [{
                        required: true, message: '请输入密码!',
                    }, {
                        validator: this.checkConfirm,
                    }],
                })(
                    <Input type="password"/>
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="确认密码"
                hasFeedback
            >
                {getFieldDecorator('confirm', {
                    rules: [{
                        required: true, message: '请确认密码!',
                    }, {
                        validator: this.checkPassword,
                    }],
                })(
                    <Input type="password" onBlur={this.handleConfirmBlur}/>
                )}
            </FormItem>
            <FormItem {...tailFormItemLayout} wrapperCol={{span: 8, offset: 10}}>
                <Button type="primary" htmlType="submit">注册</Button>
            </FormItem>
        </Form>
        if(auth === 3){
            FormHTML = <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>用户名&nbsp;
                            <Tooltip title="用户名不允许数据特殊字符和中文?">
                                        <Icon type="question-circle-o"/>
                                    </Tooltip>
                                </span>
                    )}
                    hasFeedback
                >
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: '请输入用户名!', whitespace: true}],
                    })(
                        <Input placeholder="username"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="密码"
                    hasFeedback
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '请输入密码!',
                        }, {
                            validator: this.checkConfirm,
                        }],
                    })(
                        <Input type="password" placeholder="password"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="确认密码"
                    hasFeedback
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: '请确认密码!',
                        }, {
                            validator: this.checkPassword,
                        }],
                    })(
                        <Input type="password" placeholder="confirm password" onBlur={this.handleConfirmBlur}/>
                    )}
                </FormItem>
                <FormItem
                    label="权限选择"
                    {...formItemLayout}
                >
                    {getFieldDecorator('authority', {
                        rules: [{ required: true, message: 'Please select authority!' }],
                    })(
                        <Select
                            placeholder="select authority"
                            onChange={this.handleSelectChange}
                        >
                            <Option value="1">Normal</Option>
                            <Option value="2">Admin</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout} wrapperCol={{span: 8, offset: 10}}>
                    <Button type="primary" htmlType="submit">注册</Button>
                </FormItem>
            </Form>
        }


        return (
            <div className="user-c-box">
                <Card title="注册用户" style={{width: 800, top: 40, left: 30}}>
                    { FormHTML }
                </Card>
            </div>
        );
    }
}




