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
            editorSuc: '',
            editorErr: ''
        }
    }

    componentDidMount(nextProps, nextState) {
        if (this.jsoneditorSuc && this.state.jsoneditorOne) {

            //权限userAuthority , -1或空表示无权限  0 表示mock权限 2表示编辑权限 3表示创建者或root

            let options = {
                history: false,
                mode: 'view'
            }
            if (this.props.mode == 'eidt') {
                if (this.props.options && this.props.userAuthority >= 2) {
                    options = this.props.options
                }
            } else  {
                if (this.props.options) {
                    options = this.props.options
                }
            }


            this.state.editorSuc = new jsoneditor(this.jsoneditorSuc, options);
            if (this.props.successResult) {
                this.state.editorSuc.set(this.props.successResult);
                this.preSucContent.innerText = JSON.stringify(this.props.successResult, null, 2);
            }

            if (this.props.errorResult) {
                this.state.editorErr = new jsoneditor(this.jsoneditorErr, options);
                this.state.editorErr.set(this.props.errorResult);
                this.preErrContent.innerText = JSON.stringify(this.props.errorResult, null, 2);
            }

            this.state.jsoneditorOne = false;
        }
    }


    componentWillUpdate(nextProps, nextState) {

        if (nextProps.mode == 'show') {
            if (nextProps.successResult) {
                this.state.editorSuc.set(nextProps.successResult);
                this.preSucContent.innerText = JSON.stringify(nextProps.successResult, null, 2);
            }

            if (nextProps.errorResult) {
                this.state.editorErr.set(nextProps.errorResult);
                this.preErrContent.innerText = JSON.stringify(nextProps.errorResult, null, 2);
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
            if (this.jsoneditorSuc.style.display === 'block') {
                this.jsoneditorSuc.style.display = 'none';
                this.preSuc.style.display = 'block';
            } else {
                this.jsoneditorSuc.style.display = 'block';
                this.preSuc.style.display = 'none';
            }
        } else {
            if (this.jsoneditorErr.style.display === 'block') {
                this.jsoneditorErr.style.display = 'none';
                this.preErr.style.display = 'block';
            } else {
                this.jsoneditorErr.style.display = 'block';
                this.preErr.style.display = 'none';
            }
        }

    }

    /**
     * 获取成功结果的数据对象
     **/
    getEditorSuc() {
        return this.state.editorSuc.get() || {};
    }

    /**
     * 获取失败结果的数据对象
     **/
    getEditorErr() {
        return this.state.editorErr.get() || {};
    }

    /**
     * 设置成功结果的数据对象
     **/
    setEditorSuc(data) {
        this.preSucContent.innerText = JSON.stringify(data, null, 2);
        this.state.editorSuc.set(data);
    }

    /**
     * 设置失败结果的数据对象
     **/
    setEditorErr(data) {
        this.preErrContent.innerText = JSON.stringify(data, null, 2);
        this.state.editorErr.set(data);
    }

    render() {
        let jsonTabTitle = '',
            font = '',
            button = '',
            display = 'none',
            editDisplay = 'block';
        if (this.props.errorResult) {
            jsonTabTitle = <ul className='jsonTabTitle'>
                <li onClick={this.changeJsonTab.bind(this, 'success')}
                    className={this.state.jsonTabClickStatus ? 'jsonActive' : ''}>
                    <span>成功结果</span>
                </li>
                <li onClick={this.changeJsonTab.bind(this, 'error')}
                    className={!this.state.jsonTabClickStatus ? 'jsonActive' : ''}>
                    <span>失败结果</span>
                </li>
            </ul>;
        } else {
            jsonTabTitle = <div className="jsonTabTitle">返回结果</div>;
            font = <p>尚无返回结果</p>
        }

        if (!this.props.options || (this.props.mode == 'eidt' && this.props.userAuthority < 2)) {
            button = <Button icon="rocket" type="primary"
                             onClick={this.josnFormat.bind(this)}>JSON格式整理</Button>
            display = 'block';
            editDisplay = 'none'
        }

        return (
            <div className="complete jsonEditorBox">
                {button}
                <div className='jsonTabBox'>
                    {jsonTabTitle}
                    <div className='jsonTabCont'
                         style={{marginLeft: this.state.jsonTabClickStatus ? '0' : '-100%'}}>
                        {/*成功*/}
                        <div className="jsonTabContPre" ref={preSuc => this.preSuc = preSuc}
                             style={{'left': 0, 'display': display}}>
                            <pre ref={preSucContent => this.preSucContent = preSucContent}>
                                {font}
                            </pre>
                        </div>
                        <div className='jsonTabEditCont' style={{'left': 0, 'display': editDisplay}}
                             ref={jsoneditor => this.jsoneditorSuc = jsoneditor}></div>

                        {/*失败*/}
                        <div className="jsonTabContPre" ref={preErr => this.preErr = preErr}
                             style={{'left': '100%', 'display': display}}>
                            <pre ref={preErrContent => this.preErrContent = preErrContent}
                                 style={{'display': display}}></pre>
                        </div>
                        <div className='jsonTabEditCont' style={{'left': '100%', 'display': editDisplay}}
                             ref={jsoneditor => this.jsoneditorErr = jsoneditor}></div>
                    </div>
                </div>
            </div>
        )
    }
}