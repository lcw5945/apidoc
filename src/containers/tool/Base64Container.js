/**
 * Created by VULCAN on 2017/10/17.
 */
import React from 'react';
import base64 from '~utils/base64'
import {message} from 'antd';

export default class Base64Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '',
            base64:'',
            hash: ''
        }
    }

    changeTitle(type) {
        let hash = ''
        if (!this.state.base64) {
            message.error('请先输入内容');
            return;
        }
        if (type === 'encryption') {
            hash = base64.toBase64(this.state.base64);
        } else {
            hash = base64.fromBase64(this.state.base64);
        }
        this.setState({
            current: type,
            hash
        })
    }


    changeTextarea(event) {
        this.setState({
            base64: event.target.value
        })

    }

    render() {
        return (
            <div className='base64-container clearfix'>
                <textarea onInput={this.changeTextarea.bind(this)}></textarea>
                <div className="title">
                    <span className={this.state.current === 'encryption' ? 'current' : ''}
                          onClick={this.changeTitle.bind(this, 'encryption')}>加密</span>
                    <span className={this.state.current === 'decrypt' ? 'current' : ''}
                          onClick={this.changeTitle.bind(this, 'decrypt')}>解密</span>
                </div>
                <ul className="content">
                    <li className={this.state.current === 'encryption' ? 'li-show' : 'li-hide'}>
                        {this.state.hash}
                    </li>
                    <li className={this.state.current === 'decrypt' ? 'li-show' : 'li-hide'}>
                        {this.state.hash}
                    </li>
                </ul>
            </div>
        )
    }
}