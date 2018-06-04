/**
 * Created by VULCAN on 2017/11/9.
 */
import React from 'react';
import {Button} from 'antd';
import jsoneditor from 'jsoneditor';

export default class JsonEditorBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jsoneditorOne: true, // 第一次实例化jsoneditor
            jsonTabClickStatus: 1, // 0 是失败结果 1 是成功结果
            editorMock: '',
        }
    }

    componentDidMount(nextProps, nextState) {
        if (this.jsoneditorMock && this.state.jsoneditorOne) {

            // 权限userAuthority , -1或空表示无权限  0 表示mock权限 2表示编辑权限 3表示创建者或root
            const options = this.props.options && this.props.userAuthority > -1 ? this.props.options : {
                    history: false,
                    mode: 'view'
                };

            this.state.editorMock = new jsoneditor(this.jsoneditorMock, options);
            if (this.props.mockResult) {
                this.state.editorMock.set(this.props.mockResult);
                this.preMockContent.innerText = JSON.stringify(this.props.mockResult, null, 2);
            }


            this.state.jsoneditorOne = false;
        }
    }


    componentWillUpdate(nextProps, nextState) {
        if (nextProps.mode == 'show') {
            if (nextProps.mockResult) {
                this.state.editorMock.set(nextProps.mockResult);
                this.preMockContent.innerText = JSON.stringify(nextProps.mockResult, null, 2);
            }
        }

    }


    /**
     * 切换 json Tab 页
     **/
    changeJsonTab(tabType) {
        if (tabType === 'success') {
            this.setState({
                jsonTabClickStatus: 1
            })
        } else {
            this.setState({
                jsonTabClickStatus: 0
            })
        }
    }

    /**
     * 格式化json
     **/
    josnFormat() {
        if (this.state.jsonTabClickStatus === 1) {
            if (this.jsoneditorMock.style.display === 'block') {
                this.jsoneditorMock.style.display = 'none';
                this.preMock.style.display = 'block';
            } else {
                this.jsoneditorMock.style.display = 'block';
                this.preMock.style.display = 'none';
            }
        }

    }

    /**
     * 获取成功结果的数据对象
     **/
    getEditorMock() {
        return this.state.editorMock.get() || {};
    }


    /**
     * 设置成功结果的数据对象
     **/
    setEditorMock(data) {
        this.preMockContent.innerText = JSON.stringify(data, null, 2);
        this.state.editorMock.set(data);
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.mode == 'show') {
            if (nextProps.mockResult) {
                this.state.editorMock.set(nextProps.mockResult);
                this.preMockContent.innerText = JSON.stringify(nextProps.mockResult, null, 2);
            }
        }
    }


    render() {
        let jsonTabTitle = '',
            font = '',
            button = '',
            display = 'none';
        if (this.props.mockResult) {
            jsonTabTitle = <ul className='jsonTabTitle'>
                <li onClick={this.changeJsonTab.bind(this, 'success')}
                    className={this.state.jsonTabClickStatus ? 'jsonActive' : ''}>
                    <span>Mock结果</span>
                </li>
            </ul>;
        } else {
            jsonTabTitle = <div className="jsonTabTitle">Mock结果</div>;
            font = <p>尚无返回结果</p>
        }

        if (!this.props.options) {
            button = <Button icon="rocket" type="primary"
                             onClick={this.josnFormat.bind(this)}>JSON格式整理</Button>
            display = 'block';
        }

        return (
            <div className="complete jsonEditorBox">
                {button}
                <div className='jsonTabBox'>
                    {jsonTabTitle}
                    <div className='jsonTabCont'
                         style={{marginLeft: this.state.jsonTabClickStatus ? '0' : '-100%'}}>
                        <div className="jsonTabContPre" ref={preMock => this.preMock = preMock}
                             style={{'left': 0, 'display': display}}>
                            <pre ref={preMockContent => this.preMockContent = preMockContent}>
                                {font}
                            </pre>
                        </div>
                        <div className='jsonTabEditCont' style={{'left': 0}}
                             ref={jsoneditor => this.jsoneditorMock = jsoneditor}></div>

                    </div>
                </div>
            </div>
        )
    }
}