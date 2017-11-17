import React from 'react';
import {Link} from "react-router-dom";
import {Button, Icon, Input, Modal, Select, Switch, message,Radio,Form} from "antd";
import MaybeModal from "~components/project/MaybeModal";
import ParamDom from "./ParamDom";
import Utils from '~utils'
import _ from 'lodash';

export default class RequestParam extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            parameter_list:[],
            modalVisible:false,
            queryData: Utils.parseUrlToData(this.props.location.search),
            options:[],
        }
    }

    componentWillMount() {
        this.dealData();

    }

    /**
     * 打开参数值可能性 弹窗
     * */
    showMaybeModal(mutli){

        var result = this.getStateByIndex(mutli),
            data,
            that=this;

        eval(`data=${result.data}`); //eval函数把字符串当做js语句执行


        data.value.forEach((param,index)=>{
            if(!param.hasOwnProperty('valueDefault')){
                param.valueDefault = 0;
            }
        });

        this.refs.maybeData.showMaybeModal(data.key,data.value,(d)=>{
            data.value = d;
            that.setState({
                parameter_list:that.state.parameter_list
            })

        });

    }


    /**
     * 添加请求数据结构
     * */
    pushParams(subParams){

        subParams.push({
            'display': 'none',
            'require': '1',
            'key': '',
            'des': '',
            'type':'string',
            keyIndex: Math.random() * 10 + new Date().getTime(),
            value:[],
            subParams:[],
        });

    }


    /**
     * 为没有subParams字段的数据添加subParams字段
     * */
    forAddSubParams(params) {
        params.forEach((param, index) => {
            if (!param.hasOwnProperty("subParams")) {
                param.subParams = [];
            }else if(!param.hasOwnProperty("type")){
                param.type = 'string';
                this.forAddSubParams(param.subParams);
            }else {
                this.forAddSubParams(param.subParams);
            }
        })
    }

    /**
     * 来自父组件的数据渲染
     * */
    fromFatherData(params){
        this.setState({
            parameter_list: params
        })
    }

    /*
     * 处理 数据
     * */
    dealData() {
        this.setState({
            parameter_list: this.props.requestParame
        })
    }

    /**
     *  根据每个组件的层级关系，得到字符串类型的变量，通过eval()方法可执行字符串类型的js语句
     *  @param indexs 层级数据；多层用,隔开
     *  @param lastNum 整个数据的前lastNum数据
     *
     *  @return
     *  {
            data: 字符串类型的状态变量,
            index: 数组，后几层的索引
        }
     *  例如 getStateByIndex("0,1,2,3",1)
     *
     *  {
     *      data:"this.state.parameter_list[0].subParams[1].subParams[2]",
     *      index:[3]
     *  }
     *
     * **/
    getStateByIndex(indexs,lastNum=0){

        indexs = _.endsWith(indexs,",")?indexs.substring(0,indexs.length-1):indexs;

        let indexSort = indexs.split(","),
            sdata = "this.state.parameter_list" ,
            valueSort = indexs?indexSort:[];

            if(lastNum){
                valueSort = _.dropRight(indexSort, lastNum);
            }

            valueSort&&valueSort.map((val,index)=>{
                if(index == 0){
                    sdata+="["+val+"]"
                }else{
                    sdata+=".subParams["+val+"]"
                }
            })

            return {
                data: sdata,
                index:_.drop( indexSort , indexSort.length-lastNum),
            }

    }

    /*
     * 添加请求参数
     * @param index 层级索引 多层用 , 隔开
     * */
    add_clickHandler(index,e) {
        e.preventDefault()

        var parentMulti = index,
            data,
            that=this,
            result;

        result = this.getStateByIndex(parentMulti);

        if(!parentMulti){ //第一层

            eval(`data = ${result.data}`);

        }else{ //其他层

            eval(`data = ${result.data}.subParams`);

        }

        if(data.some((obj)=>(obj.key == ""))){
            message.error('您还有空的请求参数未填写！');
            return false;
        }
        this.pushParams(data);
        this.setState({
            parameter_list:that.state.parameter_list
        })

    }

    /*
     * 改变数据
     * @param data 当前层的数据
     * */
    paramDom_ChangeValue(data){
        var result = this.getStateByIndex(data.multi)
        eval(`Object.assign(${result.data},data)`);

        this.setState({"parameter_list":this.state.parameter_list})

    }

    /*
     * 删除请求参数
     * @param data 当前层的数据
     * */
    paramDom_delete(data){

        var result = this.getStateByIndex(data.multi, 1)
        var index = result&&result.index[0]

        if(data.multi.split(",").length==1){

            eval(result.data+`.splice(${index},1)`)
        }else{

            eval(result.data+`.subParams.splice(${index},1)`)
        }

        this.setState({"parameter_list":this.state.parameter_list})

    }

    /*
     * 点击参数可能性
     * @param data 当前层的数据
     * */
    paramDom_AddConfig(data){
        this.showMaybeModal(data.multi);
    }


    /*
     * 点击切换按钮
     * @param data 当前层的数据
     * */
    paramDom_Switch(data,onCancel){
        var data ,
            that=this,
            result = this.getStateByIndex(data.multi)


        eval(`data = ${result.data}`) ;
        if(data.subParams.length == 0){
            Modal.confirm({
                iconType:'smile',
                title:'温馨提示：',
                content:'添加子属性会清空参数值可能性，确定要继续添加吗？',
                onOk(){
                    that.pushParams(data.subParams);
                    that.setState({
                        parameter_list:that.state.parameter_list
                    })
                },
                onCancel(){
                    onCancel()
                    return false;
                }
            })
        }

    }



    /*
     * 改变数据
     * @param data 当前层的数据
     * @return data 参数数据
     * @return isVerify是否验证通过 true 表示验证通过 false表示验证失败
     * */
    getParamData(){

        var keys = document.querySelectorAll(".paramName");
        let flag=true;
        for(let key of keys){
            if(!key.value){
                flag = false;
                key.classList.add("g-errorTip");
                break;
            }
        }


        return {
            data:this.state.parameter_list,
            isVerify:flag,
        }
    }

    render() {

        let { parameter_list } = this.state;

        return (
            <div className='requestParam' id='requestParam'>
                <MaybeModal ref='maybeData'  {...this.props}/>
                <section>
                    <div className='edit_parameter_list'>
                        <ul>
                            {
                                parameter_list && parameter_list.map((firstData, firstIndex) => {

                                    let firstMulit=firstIndex.toString(); //第一层 - 层级索引

                                    return (
                                        <li key={'firstData' + firstData.keyIndex+firstIndex} alt="第一层">

                                                <ParamDom option = {firstData}
                                                          multi={firstMulit}
                                                          multiKey={firstIndex}
                                                          onDelete={this.paramDom_delete.bind(this)}
                                                          onAddConfig={this.paramDom_AddConfig.bind(this)}
                                                          onSwitch={this.paramDom_Switch.bind(this)}
                                                          onChangeValue={this.paramDom_ChangeValue.bind(this)} />

                                                <div  style={{display: firstData.display,marginLeft:80+"px"}} alt="第二层" >
                                                        {
                                                            firstData.subParams && firstData.subParams.map((sencondData, sencondIndex) => {

                                                                let sencondMulit=firstIndex+","+sencondIndex;   //第二层 - 层级索引

                                                                return (
                                                                    <div key={'sencondData' + sencondData.keyIndex+sencondIndex} >
                                                                        <ParamDom option = {sencondData}
                                                                                  multi={sencondMulit}
                                                                                  multiKey={sencondIndex}
                                                                                  onDelete={this.paramDom_delete.bind(this)}
                                                                                  onAddConfig={this.paramDom_AddConfig.bind(this)}
                                                                                  onSwitch={this.paramDom_Switch.bind(this)}
                                                                                  onChangeValue={this.paramDom_ChangeValue.bind(this)} />

                                                                        <div style={{display: sencondData.display,marginLeft:80+"px"}} alt="第三层" >
                                                                            {
                                                                                sencondData.subParams && sencondData.subParams.map((thirdData, thirdIndex) => {

                                                                                    let thirdMulit=firstIndex+","+sencondIndex+","+thirdIndex;  //第三层 - 层级索引

                                                                                    return (
                                                                                        <div key={'thirdData' + thirdData.keyIndex+thirdIndex}>
                                                                                            <ParamDom option = {thirdData}
                                                                                                      multi={thirdMulit}
                                                                                                      multiKey={thirdIndex}
                                                                                                      onDelete={this.paramDom_delete.bind(this)}
                                                                                                      onAddConfig={this.paramDom_AddConfig.bind(this)}
                                                                                                      onSwitch={this.paramDom_Switch.bind(this)}
                                                                                                      onChangeValue={this.paramDom_ChangeValue.bind(this)} />

                                                                                        </div>
                                                                                    )

                                                                                })
                                                                            }

                                                                            <Button  alt="第三层 - 添加按钮" onClick={this.add_clickHandler.bind(this,sencondMulit)} type="primary" icon="plus"  style={{padding: '0 10px'}}>
                                                                                添加</Button>

                                                                        </div>


                                                                    </div>

                                                                )
                                                            })
                                                        }
                                                        <Button alt="第二层 - 添加按钮" onClick={this.add_clickHandler.bind(this,firstMulit )}  type="primary" icon="plus" style={{padding: '0 10px'}}>
                                                            添加</Button>

                                                </div>

                                        </li>
                                    )
                                })
                            }

                        </ul>
                    </div>
                    <div className="list_addBtn">
                        <Button alt="第一层 - 添加按钮" onClick={this.add_clickHandler.bind(this,"")} type="primary" icon="plus" style={{padding: '0 10px'}}>
                            添加</Button>
                    </div>
                </section>
            </div>
        )
    }

}