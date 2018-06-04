/**
 * Created by VULCAN on 2017/10/17.
 */
import React from 'react';
import md5 from 'blueimp-md5';
import { Select, message } from 'antd';
import Utils from '~utils';
export default class TimestampContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            placeHolder: '当前时间',
            result: '',
            textareaEnable: true,
            type: 0,
            time: ''
        }
        this.optionArr = ['当前时间时间戳', '时间戳(毫秒) —> 日期', '日期(年/月/日 时:分:秒) —> 时间戳(毫秒)']
        this.placeHolderArr = ['当前时间', '请输入时间戳(毫秒)', '请输入日期(例:2017/11/29 10:51:22)']
    }
    doTimeChange() {
        if (this.state.time == '' && this.state.type != 0) {
            message.error('请先要转化的内容！');
            return
        }
        let result = new Date().getTime();

        switch (this.state.type) {
            case 0:
                result = result;
                break
            case 1:
                result = Utils.formatDate(new Date(Number(this.state.time)));
                break
            case 2:
                result = new Date(this.state.time).getTime();
                break
            default:
                result = result;
        }
        if (this.state.type == 1) {
            let resultRes = String(new Date(result).getTime()),
                timeRes = String(this.state.time);
            resultRes = resultRes.substring(0, resultRes.length - 3)
            timeRes = timeRes.substring(0, timeRes.length - 3)
            if (resultRes != timeRes) {
                message.error('转换失败，请检查输入格式是否正确！');
                return
            }

        }
        if (!result) {
            message.error('转换失败，请检查输入格式是否正确！');
            return
        }
        this.setState({
            result
        })
    }
    changeSelect(val) {
        val = Number(val);
        let placeHolder = this.placeHolderArr[val];
        this.setState({
            placeHolder,
            textareaEnable: !val,
            type: Number(val),
            time: '',
            result: ''
        })
    }
    changeTextarea(event) {
        this.setState({
            time: event.target.value
        })
    }

    render() {
        const Option = Select.Option;
        return (
            <div className='ts-container clearfix'>
                <div className="input"  id='input'>
                    <Select defaultValue={'0'} className='ts-select' 
                    dropdownClassName='ts-select-option' 
                    onChange={this.changeSelect.bind(this)}
                    getPopupContainer={() => document.getElementById('input')}
                    >{
                        this.optionArr.map((val,index)=>(<Option value={index+''} key={index}>{val}</Option>))
                    }
                    </Select>
                    <textarea onInput={this.changeTextarea.bind(this) }
                              disabled={this.state.textareaEnable}
                              placeholder={this.state.placeHolder}
                              value={this.state.time}></textarea>
                </div>
                <div className="title">
                    <span className='' onClick={this.doTimeChange.bind(this)}>转换</span>
                </div>
                <div className="content">
                        {this.state.result}
                </div>
            </div>
        )
    }
}