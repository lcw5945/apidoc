/**
 * Created by user on 2017/11/16.
 */
import React from 'react';
import {Button, Icon, Input, Modal, Select, Switch, message,Radio,Form} from "antd";
import Utils from '~utils'
import _ from 'lodash';
const Option = Select.Option;
export default class ApiTestLogin extends React.Component {
    constructor(props){
        super(props);

    }


    render() {

        let userList = [];

        return (
            <div className='apiTestLogin'>
                <section>
                    <label>
                        <span className='edit_name'>手机号：</span>
                        <Input placeholder="请输入手机号"/>
                    </label>
                    <label id="methodType">
                        <span className='edit_name'>当前用户：</span>
                        <Select className='edit_method' >
                            {
                                userList&&userList.map((user) => {
                                    return (
                                        <Option key={user._id}
                                                value={user._id}>{user.name}</Option>
                                    )
                                })
                            }
                        </Select>
                    </label>
                </section>

            </div>
        )
    }

}