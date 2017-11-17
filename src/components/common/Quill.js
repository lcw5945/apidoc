/**
 * Created by chy on 2017/7/31.
 */
import React from 'react';
import ReactQuill from 'react-quill';
export default class Quill extends React.Component {
    constructor(props) {
        super(props);
        this.config = {
            modules: {
                toolbar: [
                    [{
                        'header': [1, 2, 3, 4, 5, 6, false]
                    }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{
                        'list': 'ordered'
                    }, {
                        'list': 'bullet'
                    }, {
                        'indent': '-1'
                    }, {
                        'indent': '+1'
                    }],
                    // ['link', 'image'],
                    ['link'],
                    ['clean']
                ],
            },

            formats: [
                'header',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent',
                'link', 'image'
            ]
        }

    }
    getVal() {
        return this.refs.quill.getEditorContents()
    }
    render() {
        let modules = Object.assign(this.config.modules, this.props.modules);
        let formats = Object.assign(this.config.formats, this.props.formats);
        return (
            <div>
                <ReactQuill
                ref='quill'
                theme={this.props.theme || 'snow'}
                modules={this.config.modules}
                formats={this.config.formats}
                defaultValue={ this.props.defaultValue || '' }
                value={ this.props.value || '' }/>
            </div>
        )
    }
}