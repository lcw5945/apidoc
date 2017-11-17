/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import _ from 'lodash'
import {paramsFormat} from '~common/http';
import  ProjectSubnav  from '~components/common/ProjectSubnav';
import Utils from '~utils/index'
import {Table, Button, Modal, Icon,Form,Input,Select,Popconfirm,Popover,message,notification} from 'antd';
import {Link} from 'react-router-dom';

@Form.create({})
export default class TableContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queryData: {},  //URL携带的参数
            fieldDialogVisible:false,//弹窗显隐
            groupId:'-1',//组ID
            fieldId:'',//字段ID
            fieldsLength:0,//字段总数
            dialogTitle:'',
            isAdmin:false,//是否有权限
            tableList:[],
            tableColumns: [     //表格的结构数据
                {
                    title: <Icon type="key" style={{color:'#f48932'}}/>,
                    dataIndex: 'primary',
                    render:(a)=>{
                        return (a===1||a==='1')?<Icon type="key" style={{color:'#f48932'}}/>:''
                    }
                },
                {
                    title: '必填',
                    dataIndex: 'required',
                    render:(a)=>{
                        return a?'√':''
                    }
                },
                {
                    title: '字段名',
                    dataIndex: 'name',
                },
                {
                    title: '类型',
                    dataIndex: 'type',
                },
                {
                    title: '长度',
                    dataIndex: 'length',
                },
                {
                    title: '描述',
                    dataIndex: 'description',
                    render:(a)=>{
                        return a?<Popover content={a} trigger="click"><span className="descBtn descDetailBtn">查看</span></Popover>:<span className="descBtn">无</span>
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (data) => {
                        return <div style={{display:this.state.isAdmin ? 'block' : 'none'}}>
                            <Button icon="edit" onClick={this.updateField.bind(this,data)}>修改</Button>
                            <Popconfirm title="确定删除此字段吗？" okText="确定" cancelText="取消" onConfirm={this.fieldDel.bind(this,data)}>
                                <Button icon="delete" type="danger">删除</Button>
                            </Popconfirm>
                        </div>
                    },
                }
            ],
        }
    }

    /**
     * 获取组的列表
     * */
    getGroupList(){
        const queryData = this.state.queryData = Utils.parseUrlToData(this.props.location.search);
        const {groups} = this.props.entity;
        let groupsList = [];
        try{
            const {items} = groups[queryData.databaseId] || [];
            groupsList = _.filter(items,['type', 'database']);
        }catch (e){}
        return groupsList;
    }

    /**
     * 添加/修改字段
     * */
    updateField(data,event){
        event.stopPropagation();
        event.preventDefault();

        if(this.state.tableList.length == 0){
            message.error('您还没有建表！');
            return false;
        }
        let title;

        if(!data){
            data = {};
            title = '添加字段';
        }else {
            title = '修改字段';
        }
        this.setState({
            fieldId:data._id,
            fieldDialogVisible:true,
            dialogTitle:title,
        });
        if(data._id){
            data.required = "" + data.required;
            data.primary = "" + data.primary;
            this.props.form.setFieldsValue(_.pick(data, ["primary", "required", "name", "type", "length", "description","groupId"]));
        }else {
            this.props.form.resetFields();
        }
    }

    /**
     * 修改/添加对话框点击事件
     * */
    fieldSubmit(result){
        let formData = this.props.form.getFieldsValue();
        if(!formData.description){
            formData.description = '';
        }
        if (result === 'OK' && formData.name && formData.type && formData.length && formData.required && formData.primary) {
            let obj = {
                databaseId: this.state.queryData.databaseId,
                groupId:formData.groupId,
                name:formData.name,
                type:formData.type,
                length:formData.length,
                required:formData.required,
                primary:formData.primary,
                description:formData.description
            };
            if(this.state.fieldId){
                obj.id = this.state.fieldId
            }
            this.props.fetchUpdateAddField(paramsFormat(obj));
            this.setState({
                fieldDialogVisible:false,
            });
        }else if(result === 'OK'){
            message.error('您还有未填写的内容！');
        }else {
            this.setState({
                fieldDialogVisible:false,
            });
        }


    }

    /**
     * 删除表对话框的按钮事件
     * OK：删除
     * */
    fieldDel(data) {
        this.props.fetchDelField(paramsFormat({id:data._id, databaseId: this.state.queryData.databaseId}));
    }

    /**
     *  处理数据
     *  */
    getItemsData() {
        const queryData = this.state.queryData = Utils.parseUrlToData(this.props.location.search);
        const {fields} = this.props.entity;

        let items = [];
        try{
            if (fields[queryData.databaseId]) {
                let fieldsData = fields[queryData.databaseId];
                items = fieldsData['items'];
            }
        }catch (e){}
        return items;
    }

    getDatabaseAdmin(){
        const queryData = this.state.queryData = Utils.parseUrlToData(this.props.location.search);
        const {databases} = this.props.entity;
        let items = [];
        try{
            if(databases["items"]){
                items = _.filter(databases["items"],['_id', queryData.databaseId]);
            }
        }catch(e){}

        return items[0].admin;
    }
    render() {
        const queryData = this.state.queryData = Utils.parseUrlToData(this.props.location.search);
        const {getFieldDecorator} = this.props.form;
        const FormItem = Form.Item;
        const Option = Select.Option;
        this.state.isAdmin = (this.getDatabaseAdmin() == this.props.user.userId) ? true : false;
        let tableGroupList = this.state.tableList = this.getGroupList();
        const typeList = ['tinyint','smallint','mediumint','int','integer','bigint','bit','real','double','float','decimal','numeric','char','varchar','date','time','year','timestamp','datetime','tinyblob','blob','mediumblob','longblob','tinytext','text','mediumtext','longtext','enum','set','binary','varbinary','point','linestring','polygon','geometry','multipoint','multilinestring','multipolygon','geometrycollection'];
        const formItemLayout = {labelCol: {xs: {span: 24}, sm: {span: 6},}, wrapperCol: {xs: {span: 24}, sm: {span: 14},},};

        let items = this.getItemsData();
        const { groupCmp } = this.props.global;
        let groupListId = this.state.groupId = queryData.groupId;

        if(items[0] && tableGroupList.length>0){
            groupListId = groupListId == '-1' ? tableGroupList[0]._id : queryData.groupId;
            items = _.filter(items,['groupId', groupListId]);
            this.state.fieldsLength = items.length;
        }

        return (
            <div>
                <ProjectSubnav />
                <div className="tableList" style={{'marginLeft': groupCmp.width}}>
                    <div className="buttons">
                        <Button type="primary" icon="plus" onClick={this.updateField.bind(this,null)} style={{display:this.state.isAdmin?'inline-block':'none'}}>添加字段</Button>
                        <span className="allCounts">字段总数：{this.state.fieldsLength}</span>
                    </div>
                    {
                        items && (() => {
                            items.map((obj) => {
                                return obj.key = obj._id
                            });

                            return (<Table dataSource={ items } columns={this.state.tableColumns}/>)
                        })()
                    }
                </div>

                <Modal
                    visible={this.state.fieldDialogVisible}
                    title={this.state.dialogTitle}
                    onOk={this.fieldSubmit.bind(this, "OK")}
                    onCancel={this.fieldSubmit.bind(this, "Cancel")}
                >
                    <Form className="fieldForm">
                        <FormItem {...formItemLayout}
                                  label="所属表:"
                                  hasFeedback
                        >
                            {getFieldDecorator('groupId', {
                                rules: [{
                                    required: true, message: '所属表不能为空!',whitespace:true,
                                }],
                            })(
                                <Select>
                                    {
                                        this.state.tableList.length>0 && this.state.tableList.map((obj) => {
                                            return <Option value={obj._id} key={obj._id}>{obj.name}</Option>;
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout}
                                  label="字段名:"
                                  hasFeedback
                        >
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true, message: '字段名不能为空!',whitespace:true,
                                }],
                            })(<Input type="text" placeholder="字段名（1~255位）" />)}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="类型"
                            hasFeedback
                        >
                            {getFieldDecorator('type', {
                                rules: [{
                                    required: true, message: '类型不能为空!',whitespace:true,
                                },{
                                    validator(rule,value,callback){
                                       if(!_.includes(typeList,value)){
                                           callback('请输入正确的字段类型！');
                                       }else {
                                           callback();
                                       }
                                    }
                                }],
                            })(
                                <Select mode="combobox">
                                    {
                                        typeList.map((obj) => {
                                            return <Option value={obj} key={obj}>{obj}</Option>;
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="字段长度"
                            hasFeedback
                        >
                            {getFieldDecorator('length', {
                                rules: [{
                                    required: true, message: '字段长度为数字且不能为空!',whitespace:true,
                                }],
                            })(
                                <Input type="number" placeholder="字段长度"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="主键"
                            hasFeedback
                        >
                            {getFieldDecorator('primary', {
                                rules: [{
                                    required: true
                                }],
                            })(
                                <Select>
                                    <Option value='0' key='0'>否</Option>
                                    <Option value='1' key='1'>是</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="必填"
                            hasFeedback
                        >
                            {getFieldDecorator('required', {
                                rules: [{
                                    required: true
                                }],
                            })(
                                <Select>
                                    <Option value='0' key='0'>否</Option>
                                    <Option value='1' key='1'>是</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label="字段描述"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('description', {
                                rules: [{}],
                            })(
                                <Input type="textarea" rows="5"/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}



