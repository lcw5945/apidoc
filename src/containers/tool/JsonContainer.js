/**
 * Created by VULCAN on 2017/10/17.
 */
import React from 'react';
import jsoneditor from 'jsoneditor'

export default class JsonContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'arrange',
            editor: {},
            compressJson: ''
        }
    }

    componentDidMount() {
        let options = {
            history: false,
            mode: 'view'
        };
        this.state.editor = new jsoneditor(this.jsoneditor, options);
        this.state.editor.set({});
    }

    changeTitle(type) {
        this.setState({
            current: type
        })
    }


    changeTextarea(event) {
        let obj = JSON.parse(event.target.value);
        let str = JSON.stringify(obj)
        this.state.editor.set(obj);
        this.setState({
            compressJson:str
        })
    }

    render() {
        return (
            <div className='json-container clearfix'>
                <textarea onInput={this.changeTextarea.bind(this)}></textarea>
                <div className="title">
                    <span className={this.state.current === 'arrange' ? 'current' : ''}
                          onClick={this.changeTitle.bind(this, 'arrange')}>整理格式</span>
                    <span className={this.state.current === 'compress' ? 'current' : ''}
                          onClick={this.changeTitle.bind(this, 'compress')}>压缩</span>
                </div>
                <ul className="content">
                    <li className={this.state.current === 'arrange' ? 'li-show' : 'li-hide'}>
                        <div className='jsonTabEditCont'
                             ref={jsoneditor => this.jsoneditor = jsoneditor}></div>
                    </li>
                    <li className={this.state.current === 'compress' ? 'li-show compress' : 'li-hide compress'}>
                        { this.state.compressJson }
                    </li>
                </ul>
            </div>
        )
    }
}