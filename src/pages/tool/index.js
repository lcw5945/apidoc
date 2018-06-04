/**
 * Created by VULCAN on 2017/10/17.
 */
/**
 * Created by Cray on 2017/7/20.
 */

import React from 'react';
import {Link} from 'react-router-dom'
import {Dropdown, Menu, Button} from 'antd';
import  MainNav  from '~components/common/MainNav';


export default class Tool extends React.Component {


    render() {
        return (
            <div id='toolBox'>
                <MainNav/>
                <div className="toolBox-area">
                    <div className="content clearfix">
                        <h6>加密解密</h6>
                        <Link to="/tool/md5">
                            <div className="box">
                                <div className="box-title">MD5</div>
                                <div className="box-explain">16/32位MD5加密</div>
                            </div>
                        </Link>
                        <Link to="/tool/base64">
                            <div className="box">
                                <div className="box-title">Base64</div>
                                <div className="box-explain">Base64加密、解密</div>
                            </div>
                        </Link>
                    </div>
                    <div className="content clearfix">
                        <h6>格式整理</h6>
                        <Link to="/tool/json">
                            <div className="box">
                                <div className="box-title">JSON</div>
                                <div className="box-explain">格式校正、压缩</div>
                            </div>
                        </Link>
                    </div>
                    <div className="content clearfix">
                        <h6>时间戳转换</h6>
                        <Link to="/tool/timestamp">
                            <div className="box">
                                <div className="box-title">Timestamp</div>
                                <div className="box-explain">时间戳转换</div>
                            </div>
                        </Link>
                    </div>

                    <div className="content clearfix">
                        <h6>其他</h6>
                        <Link to="/tool/qrcode">
                            <div className="box">
                                <div className="box-title">二维码生成</div>
                                <div className="box-explain">二维码生成</div>
                            </div>
                        </Link>
                        <Link to="/tool/http">
                            <div className="box">
                                <div className="box-title">HTTP状态码</div>
                                <div className="box-explain">状态码详解</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}



