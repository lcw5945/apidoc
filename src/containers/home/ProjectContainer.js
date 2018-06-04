/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import _ from 'lodash'
import {
    paramsFormat
} from '~common/http';
import Utils from '~utils';
import {
    Table,
    Button,
    Modal,
    Input,
    Row,
    Col,
    Select,
    Popconfirm,
    Tag,
    Dropdown,
    Menu,
    Upload,
    Message,
    Icon
} from 'antd';
import Dialog from '~components/common/Dialog';
const Option = Select.Option;

export default class ProjectListContainer extends React.Component {

    constructor() {
        super();
        let that = this;
        this.state = {
            selectChangeHandleNum: '',
            apiviewName: '',
            apiviewPW: '',
            selectedRows: [],
            columns: [{
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '版本号',
                dataIndex: 'version',
                key: 'version',
                render: (text) => {
                    return <Tag className='noPoint' color="#82d886">{text}</Tag>
                }
            }, {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                render: (text) => {
                    return <Tag className='noPoint' color="green">{text}</Tag>
                }
            }, {
                title: '拥有者',
                dataIndex: 'adminInfo.username',
                key: 'adminInfo.username',
                render: (text) => {
                    return text
                }
            }, {
                title: '项目最后修改时间',
                dataIndex: 'lastTime',
                key: 'lastTime',
                // sorter: (a, b) => Number(b) - Number(a),
                // sortOrder: true,
                render: (text, record) => {
                    return Utils.formatDate(new Date(parseInt(record.lastTime)));
                }
            }, {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => {

                    let hfApiUserInfo = that.props.user;

                    if (record.admin === hfApiUserInfo.userId || hfApiUserInfo.auth > 2) {
                        return (
                            <div>
                                    <Button size="small" icon="edit"
                                            onClick={this.openModel.bind(this, record, 'eidt')}>修改</Button>
                                    <Popconfirm placement="rightTop" title='确定删除'
                                                onConfirm={this.deletePopconfirmHandle.bind(this, record)}
                                                okText="Yes" cancelText="No">
                                        <Button size="small" icon="delete"
                                                onClick={this.deleteHandle.bind(this, record)}>删除</Button>
                                    </Popconfirm>
                                </div>
                        )
                    } else {
                        return;
                    }
                }
            }],
            addDataSource: {
                title: "增加项目",
                name: '',
                version: '',
                type: 'Web',
                visible: false,
            }
        }
    }


    /**
     * 选择导入的apiview项目
     * @returns {Promise.<T>}
     */
    chooseImportApiviewProject(data) {

        const columns = [{
            title: 'Project',
            dataIndex: 'name',
        }, {
            title: 'Authority',
            dataIndex: 'edit',
        }, {
            title: 'CreateTime',
            dataIndex: 'create_time',
        }];

        const dataSource = [];
        _.forEach(data, (value) => {
            dataSource.push({
                key: value.project_id,
                project_id: value.project_id,
                name: value.name,
                edit: value.edit === "1" ? "可写" : "只读",
                create_time: value.create_time,
            });
        })


        let _this = this;

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({
                    selectedRows
                })
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
            }),
        };

        Modal.confirm({
            title: '导入项目',
            iconType: 'cloud-upload',
            width: '700',
            content: <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} pagination={false}
                            size="middle"/>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                return new Promise((resolve, reject) => {
                    console.log(_this.state.apiviewName, _this.state.apiviewPW);
                    // setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    _this.props.fetchImportPjFromApiView(paramsFormat({
                        projects: _this.state.selectedRows
                    }), (data) => {
                        resolve(data);

                    }, (err) => {
                        reject(err);
                    })
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {},
        });
    }

    /**
     * 导入项目 - 点击导入
     * 1 : apiview项目
     * */
    import_clickHandler(e) {
        let _this = this;
        if (e.key === '1') {
            Modal.confirm({
                title: '导入项目',
                iconType: 'cloud-upload',
                content: <div className='apiview-login'>
                    <label>Apiview用户名：</label>
                    <Input className='apiview-name' prefix={<Icon type="user"/>} defaultValue='' placeholder="Username"
                           onChange={_this.apiviewInput.bind(this, 'name')}/>
                    <label>Apiview密码：</label>
                    <Input className='apiview-pw' prefix={<Icon type="lock"/>} defaultValue='' type="password"
                           placeholder="Password" onChange={_this.apiviewInput.bind(this, 'pw')}/>
                </div>,
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    return new Promise((resolve, reject) => {
                        console.log(_this.state.apiviewName, _this.state.apiviewPW);
                        // setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                        _this.props.fetchGetPjFromApiView(paramsFormat({
                            email: _this.state.apiviewName,
                            password: _this.state.apiviewPW
                        }), (data) => {
                            resolve(data);
                            _this.chooseImportApiviewProject(data);
                        }, (err) => {
                            reject(err);
                        })
                    }).catch(() => console.log('Oops errors!'));
                },
                onCancel() {},
            });
        }
    }


    /**
     * 点击导入项目文件
     * */
    handleMenuClick(e) {
        let _this = this;
        const uploadProps = {
            name: 'file',
            action: '//jsonplaceholder.typicode.com/posts/',
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    Message.success(`${info.file.name} 上传成功！`);
                } else if (info.file.status === 'error') {
                    Message.error(`${info.file.name} 上传失败！`);
                }
            },
        };
        const Option = Select.Option;
        if (e.key === '1') {
            Modal.confirm({
                title: '导入项目',
                iconType: 'cloud-upload',
                content: <div>
                    <p>项目名称：</p>
                    <Input defaultValue='示例' style={{'marginBottom': '10px'}}/>
                    <Col span={15}>
                        <p>版本号：</p>
                        <Input defaultValue='1.0'/>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={7} style={{'marginBottom': '10px'}}>
                        <p>项目类型：</p>
                        <Select defaultValue='Web' onChange={_this.selectChangeHandle.bind(this)}>
                            <Option value="Web">Web</Option>
                            <Option value="App">App</Option>
                            <Option value="PC">PC</Option>
                            <Option value="其他">其他</Option>
                        </Select>
                    </Col>
                    <p>选择文件：</p>
                    <Upload {...uploadProps}>
                        <Button>
                            <Icon type="upload"/> Click to Upload
                        </Button>
                    </Upload>
                </div>,
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    console.log('调用导入项目接口');
                },
                onCancel() {},
            });
        }
    }

    /**
     * 获取input value
     * */
    apiviewInput(type, e) {
        if (type === 'name') {
            this.state.apiviewName = e.target.value;
        } else {
            this.state.apiviewPW = e.target.value;
        }
    }


    /*
     * 进入详情页 - 跳转api列表页
     * */
    goApiList(record, index, event) {
        let _id = record._id;
        this.props.groupClear(); //清除下分组模块的搜索input为初始状态
        this.props.history.push("/project/api/list?projectId=" + _id + "&groupId=-1")

    }


    /**
     * 对话框 - delete - 弹框
     * **/
    deleteHandle(data, event) {
        event.stopPropagation();
        event.preventDefault();
    }

    /**
     *对话框 - delete - 确定删除
     * **/
    deletePopconfirmHandle(data, event) {
        event.stopPropagation();
        event.preventDefault();
        this.props.fetchDelProject(paramsFormat({
            id: data.key
        }));
    }

    /**
     * 对话框 - addUpdate - 更改项目类型
     * **/
    selectChangeHandle(event) {
        this.setState({
            selectChangeHandleNum: event
        });
    }

    /**
     * 对话框 - addUpdate - 打开
     * **/
    openModel(data, mType, event) {

        event.stopPropagation();
        event.preventDefault();


        let _this = this;
        let {
            name,
            type,
            version
        } = data;



        let dataModal = this.state.addDataSource;


        if (mType == 'eidt') {
            dataModal.title = "修改项目";
            dataModal.key = data.key;
            dataModal.name = name;
            dataModal.version = version;
        } else {
            dataModal.title = "新增项目";
            dataModal.key = "";
            dataModal.name = "";
            dataModal.version = "";
        }

        Utils.setValueById("dataSourceName", dataModal.name)
        Utils.setValueById("dataSourceHv", dataModal.version)
        this.setState({
            selectChangeHandleNum: type
        });


        this.refs.getDialog.confirm({
            title: dataModal.title,
            width: '450px',
            content: <div>
                        <Row>
                            <p>项目名称：</p>
                            <Input defaultValue={dataModal.name} id="dataSourceName"  placeholder="请输入项目名称"/>
                        </Row>
                        <Row style={{marginTop:"20px"}}>
                            <Col span={15}>
                                <p>版本号：</p>
                                <Input defaultValue={dataModal.version} id="dataSourceHv" placeholder="请输入版本号，比如1.0"/>
                            </Col>

                            <Col span={2}></Col>
                            <Col span={7}>
                                <p>项目类型：</p>
                                <Select defaultValue={dataModal.type}
                                        onChange={this.selectChangeHandle.bind(this)}>
                                    <Option value="Web">Web</Option>
                                    <Option value="App">App</Option>
                                    <Option value="PC">PC</Option>
                                    <Option value="其他">其他</Option>
                                </Select>
                            </Col>
                        </Row>
                    </div>,
            onOk() {
                let dataSource = _this.state.addDataSource;
                dataSource.name = Utils.getValueById('dataSourceName');
                dataSource.version = Utils.getValueById('dataSourceHv');
                dataSource.type = _this.state.selectChangeHandleNum;

                if (!dataSource.name) {
                    Message.error("请输入项目名称")
                    return false;
                }
                if (!dataSource.version) {
                    Message.error("请输入版本号")
                    return false;
                }

                let params = {
                    name: dataSource.name,
                    version: dataSource.version,
                    type: dataSource.type,
                };

                if (dataSource.key) {
                    params.id = dataSource.key
                }
                _this.props.fetchUpdateAddProject(paramsFormat(params));
            },
            onCancel() {},
        });

    }

    render() {

        const {
            projects
        } = this.props.entity;
        let pagination = {};
        if (projects) {
            pagination = {
                total: projects.items.length,
                pageSize: 10
            }
        }

        const menu = <Menu onClick={this.import_clickHandler.bind(this)}>
            <Menu.Item key="1">
                导入ApiView项目
            </Menu.Item>
        </Menu>;

        return (
            <div className='ProjectListBox'>
                <Dialog  ref="getDialog"/>

                <div className="ProjectList">

                    <div className="buttons">
                        <Button type="primary" icon="plus"
                                onClick={this.openModel.bind(this,this.state.addDataSource,'add')}>新增项目</Button>
                        <Dropdown overlay={menu} placement="bottomLeft" trigger={['hover']}>
                            <Button type="primary" icon="cloud-upload">导入项目</Button>
                        </Dropdown>
                    </div>

                    {
                        projects && (() => {
                            const {items} = projects;
                            items.map((obj) => {
                                return obj.key = obj._id
                            });

                            return (<Table dataSource={items} columns={this.state.columns}
                                           onRowClick={this.goApiList.bind(this)} pagination={pagination}/>)
                        })()
                    }

                </div>
            </div>
        );

    }
}