/**
 * Created by user on 2017/10/27.
 */

import React from 'react';
import {Table, Button, Modal, Input, Popconfirm,Tag} from 'antd';
import {paramsFormat} from '~common/http';
import Utils from '~utils';


 class Dialog extends React.Component {

    constructor(props) {
        super(props);
        let setting = {
            width:'400px',
            title: '',
            content:'',
            visible:false,
            onOk:()=>{return false},
            onCancel:()=>{return false},
        }

        this.state = setting;

    }


     confirm(option){
        var setting = this.state;
        setting.visible = true ;
        Object.assign(setting,option);
        this.setState(setting);
     }

    okModal(){
        let result = this.state.onOk();

        if(result == false){
            return;
        }
        this.closeModal();

    }
    cancelModal(){
        this.state.onCancel();
        this.closeModal();
    }

    closeModal(){
        this.setState({
            visible:false
        })
    }

    render(){

        return  <Modal width={this.state.width}
                       title={this.state.title}
                       visible={this.state.visible}
                       onOk={this.okModal.bind(this)}
                       onCancel={this.cancelModal.bind(this)}
        >

            {this.state.content}

        </Modal>


    }


}


export default Dialog ;