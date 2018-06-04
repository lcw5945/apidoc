
import React from 'react';
import {Link} from "react-router-dom";
import {Button, Icon, Input, Modal, message,Radio,Tooltip } from "antd";

export default class MaybeModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            modalVisible:false,
            maybeTitle:'',
            maybeData:[],
            onOK:()=>{},
        }
    }

    componentWillMount() {
        this.dealData();
    }

    /**
     * 参数值可能性弹窗
     * */
    showMaybeModal(maybeTitle,maybeData,onOK){
        this.setState({
            modalVisible:true,
            maybeTitle,
            maybeData,
            onOK
        });
    }
    /**
     * 关闭参数值可能性弹窗
     * */
    hideMaybeModal(){
        this.setState({
            modalVisible:false,
            maybeData: [],
        });
    }

    /**
     * 参数值可能性添加按钮
     * */
    addMaybeData() {
        let maybeData = this.state.maybeData;
        let valueDefault = 0;
        if(maybeData.length>0){
            valueDefault = 0;
        }else {
            valueDefault = 1;
        }
        maybeData.push({
            valueCont: '',
            valueDes: "",
            valueDefault,
            valIndex: parseInt(Math.ceil(Math.random()*1000) + '' + new Date().getTime())
        });
        this.setState({
            maybeData
        });
    }

    /**
     * 参数值可能性确定按钮
     * */
    commitMaybeData(){
        let maybeData = this.state.maybeData;
        for(let i=0;i<maybeData.length;i++){
            if(!maybeData[i].valueCont){
                message.error('参数值可能性名称不能为空！');
                return false;
            }
        }

        this.state.onOK(maybeData);
        this.setState({
            modalVisible:false,
        });
    }

    /**
     * 删除参数可能性
     * */
    delMaybeData_clickHandler(index){
        let maybeData = this.state.maybeData;
        maybeData.splice(index, 1);
        this.setState({
            maybeData
        });
    }


    /**
     * 默认值单选按钮
     * */
    checkDefaultMaybe(index){
        let maybeData = this.state.maybeData;
        for (let i=0;i<maybeData.length;i++){
            maybeData[i].valueDefault = 0;
        }
        maybeData[index].valueDefault = 1;
        this.setState({
            maybeData
        });
    }

    /**
     * 给参数值可能性input绑定事件
     * */
    editMaybeInput_changeHandler(index,inputType,e){
        let maybeData = this.state.maybeData;

        switch (inputType) {
            case 'valueCont' :
                maybeData[index].valueCont = e.target.value.trim();
                break;
            case 'valueDes' :
                maybeData[index].valueDes = e.target.value.trim();
                break;
        }

        this.setState({
            maybeData
        });
    }

    /**
     * 处理 数据
     * */
    dealData() {
        this.setState({
            maybeData: this.props.maybeData
        })
    }
    render() {
        return (
            <Modal
                className='maybeModalBox'
                maskClosable={false}
                visible={this.state.modalVisible}
                title='参数值可能性'
                width={580}
                onCancel={this.hideMaybeModal.bind(this)}
                onOk={this.commitMaybeData.bind(this)}
            >
                <div className='maybeModel'>
                    <div className='clearfix maybeModelTitle'>参数名称 ：{this.state.maybeTitle}</div>
                    {
                        this.state.maybeData && this.state.maybeData.map((data,index) => {

                            return <div key={data.valIndex} className='clearfix'>
                                <span className='list_count'>{index + 1}</span>
                                <b onClick={this.delMaybeData_clickHandler.bind(this, index)}>
                                    <Icon type="minus-square" style={{fontSize: '27px', color: '#43a074'}} className='close_list'/>
                                </b>
                                <label className='list_name'>参数值可能性 ：
                                    <Tooltip
                                        trigger={['hover']}
                                        title={data.valueCont||''}
                                        placement="topLeft"
                                        overlayClassName="g-toolTipBreak">
                                            <Input
                                                className='list_input'
                                                defaultValue={data.valueCont||''}
                                                onChange={this.editMaybeInput_changeHandler.bind(this,index,'valueCont')}/></Tooltip></label>
                                <label className='list_explain'>说明 ：
                                    <Tooltip
                                        trigger={['hover']}
                                        title={data.valueDes||''}
                                        placement="topLeft"
                                        overlayClassName="g-toolTipBreak">
                                            <Input
                                                className="list_input"
                                                defaultValue={data.valueDes||''}
                                                onChange={this.editMaybeInput_changeHandler.bind(this,index,'valueDes')}/></Tooltip></label>
                                <Radio className="list_checkBtn"
                                       checked={data.valueDefault}
                                       onChange={this.checkDefaultMaybe.bind(this,index)}/>
                            </div>
                        })
                    }
                    <Button className='list_addMaybe' type="primary" icon="plus"
                            onClick={this.addMaybeData.bind(this)}>添加</Button>
                </div>
            </Modal>
        )
    }

}