/**
 * Created by lichunwei on 2017/8/4.
 */

import React from 'react';
import {paramsFormat} from '~common/http';
import {Form,  Input, Button, Card, message } from 'antd';

@Form.create({})
export default class UserContainer extends React.Component {
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

                this.props.fetchUpdateUser(paramsFormat(values), ()=>{
                    message.success('更新成功!');
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


    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {getFieldDecorator} = this.props.form;

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

        const FormItem = Form.Item;

        return (
            <div className="user-c-box" >
                <Card title="修改用户密码" style={{width: 800, top: 40, left: 0,right:0,}}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout}
                                  label="旧密码"
                                  hasFeedback
                        >
                            {getFieldDecorator('oldpassword', {
                                rules: [{required: true, message: '旧密码不能为空!'}],
                            })(<Input type="password" placeholder="old password"/>)}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="新密码"
                            hasFeedback
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: '请输入新密码!',
                                }, {
                                    validator: this.checkConfirm,
                                }],
                            })(
                                <Input type="password" placeholder="new password"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="确认新密码"
                            hasFeedback
                        >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: '请确认新密码!',
                                }, {
                                    validator: this.checkPassword,
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur}
                                       placeholder="confirm new password"/>
                            )}
                        </FormItem>
                        <FormItem
                            wrapperCol={{span: 8, offset: 10}}
                        >
                            <Button type="primary" htmlType="submit">提交</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        );
    }

}




