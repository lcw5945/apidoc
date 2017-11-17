/**
 * Created by chy on 2017/10/18.
 */
import React from 'react';
import QRCode from '~plugins/qrcode';
import {message} from 'antd';

export default class QRcodeContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            codeUrl:'',
            codeWidth: 280,
            codeIsOk:false
        }
    }

    /**
     * 清空或者生成二维码
     * */
    getQRcode(type) {
        document.getElementById("qrcode").innerHTML = "";
        let qrcode = new QRCode(document.getElementById("qrcode"), {
            text: this.state.codeUrl,
            width: this.state.codeWidth,
            height: this.state.codeWidth,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        if(type == "clear"){
            this.setState({
                codeUrl:''
            });
            document.getElementById("codeUrl").value = "";
            qrcode.clear();
            this.state.codeIsOk = false;
        }else {
            if(!this.state.codeUrl){
                message.error('请先输入内容');
            }else if(this.state.codeUrl.length > 300) {
                message.error('内容长度超过了300！');
            }else{
                qrcode.makeCode(this.state.codeUrl);
                this.state.codeIsOk = true;
            }
        }
    }

    changeTextarea(event) {
        this.setState({
            codeUrl: event.target.value
        })
    }

    changeInput(event){
        this.setState({
            codeWidth: event.target.value
        })
    }

    /**
     * 二维码下载功能
     * */
    downLoadCode(){
        let downLoadBtn = document.getElementById("downLoadBtn");
        if(this.state.codeIsOk){
            let codeImg = document.getElementById("qrcode").getElementsByTagName("img")[0];
            let canvas = document.createElement("canvas");
            canvas.width = this.state.codeWidth;
            canvas.height = this.state.codeWidth;
            console.log(canvas.getContext("2d"));
            canvas.getContext("2d").drawImage(codeImg, 0, 0);
            let url = canvas.toDataURL("image/png");//PNG格式
            //以下代码为下载此图片功能
            downLoadBtn.setAttribute("href", url);
            downLoadBtn.setAttribute("download", "二维码.png");
        }else {
            downLoadBtn.removeAttribute("href");
            downLoadBtn.removeAttribute("download");
            message.error('没有可下载的二维码！');
        }
    }

    render() {
        return (
            <div className='qrcode-container clearfix'>
                <textarea id="codeUrl" placeholder="请输入300字以内的字符或网址" onInput={this.changeTextarea.bind(this)}>
                </textarea>
                <div className="title">
                    <span onClick={this.getQRcode.bind(this,"generate")}>生成二维码</span>
                    <label>大小：</label><input type="number" placeholder="(默认280px)"  onInput={this.changeInput.bind(this)}/>
                    <span><a id="downLoadBtn" onClick={this.downLoadCode.bind(this)}>下载</a></span>
                    <span onClick={this.getQRcode.bind(this,"clear")}>清空</span>
                </div>
                <div className="content" id="qrcode">
                </div>
            </div>
        )
    }
}