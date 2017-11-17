/**
 * Created by VULCAN on 2017/10/17.
 */
import React from 'react';
import md5 from 'blueimp-md5';
import {message} from 'antd';

export default class Md5Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '',
            md5Key: '',
            md5Value: '',
            hash: ''
        }
    }

    _md5(value, key) {
        if (key) {
            return md5(value, key);
        } else {
            return md5(value);
        }
    }

    changeTitle(type) {
        if (!this.state.md5Value) {
            message.error('请先输入加密内容');
            return;
        }
        ;
        let hash = this._md5(this.state.md5Value, this.state.md5Key);
        let hash16 = hash;
        hash16 = hash16.substring(8, 24);
        if (type === '16x') {
            hash = hash16;
        } else if (type === '16d') {
            hash = hash16.toUpperCase();
        } else if (type === '32x') {

        } else if (type === '32d') {
            hash = hash.toUpperCase();
        }
        this.setState({
            current: type,
            hash
        })
    }


    changeTextarea(type, event) {
        if (type === 'md5Key') {
            this.setState({
                md5Key: event.target.value
            })
        } else {
            this.setState({
                md5Value: event.target.value
            })
        }

    }

    render() {
        return (
            <div className='md5-container clearfix'>
                <div className="input">
                    <textarea onInput={this.changeTextarea.bind(this, 'md5Key')}
                              placeholder="输入key" className='md5Key'></textarea>
                    <textarea onInput={this.changeTextarea.bind(this, 'md5Value')}
                              placeholder="输入加密内容"></textarea>
                </div>
                <div className="title">
                    <span className={this.state.current === '16x' ? 'current' : ''}
                          onClick={this.changeTitle.bind(this, '16x')}>16位小写</span>
                    <span className={this.state.current === '16d' ? 'current' : ''}
                          onClick={this.changeTitle.bind(this, '16d')}>16位大写</span>
                    <span className={this.state.current === '32x' ? 'current' : ''}
                          onClick={this.changeTitle.bind(this, '32x')}>32位小写</span>
                    <span className={this.state.current === '32d' ? 'current' : ''}
                          onClick={this.changeTitle.bind(this, '32d')}>32位大写</span>
                </div>
                <ul className="content">
                    <li className={this.state.current === '16x' ? 'li-show' : 'li-hide'}>
                        {this.state.hash}
                    </li>
                    <li className={this.state.current === '16d' ? 'li-show' : 'li-hide'}>
                        {this.state.hash}
                    </li>
                    <li className={this.state.current === '32x' ? 'li-show' : 'li-hide'}>
                        {this.state.hash}
                    </li>
                    <li className={this.state.current === '32d' ? 'li-show' : 'li-hide'}>
                        {this.state.hash}
                    </li>
                </ul>
            </div>
        )
    }
}