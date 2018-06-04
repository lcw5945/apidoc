/**
 * Created by user on 2017/11/20.
 */
import React from 'react';
import {Button, Icon, Input, Modal, Select, Switch, message,Radio,Form,Tree} from "antd";
import Utils from '~utils'
import _ from 'lodash';
import ApiLoginLocal from './local';


const TreeNode = Tree.TreeNode;
let num = 0;



export default class SelectTree extends React.Component {
    constructor(props){
        super(props);
        let queryData = Utils.parseUrlToData(this.props.location.search);
        this.state = {
            projectId : queryData["projectId"],
            visible:false,
            treeData:[],
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            // url:'',
            // account:''
        }

    }

    componentWillMount() {
        
    }

    open(param){
        let data = ApiLoginLocal.getJsonData(param);

        this.setState({
            treeData:data.data,
            checkedKeys:data.checkedKeys,
            visible:true,
        })
    }
    handleOk(){
        let param={
            projectId:this.state.projectId,
            accountObj:{
                data:this.state.treeData,
                checkedKeys:this.state.checkedKeys
            }
        };
        let allData = ApiLoginLocal.getJsonData(param);
        let options = allData.options
        param.accountObj.json = allData.json

        ApiLoginLocal.update(param,options);
        this.props.getTreeData(this.state.treeData,this.state.checkedKeys,true);
        this.setState({
            visible:false
        })
    }
    handleCancel(){
        this.setState({
            visible:false
        })
    }
    renderTreeNodes(data){
        return data&&data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }else {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                    </TreeNode>
                );
            }
        });
    }

    onExpand(expandedKeys){
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onCheck(checkedKeys){
        if(checkedKeys.length>5){
            checkedKeys = _.intersection(checkedKeys,this.state.checkedKeys);
        }
        this.setState({ checkedKeys });
    }
    onSelect(selectedKeys, info){
        this.setState({ selectedKeys });
    }

    render() {
        return (
            <div>
                <Modal  ref="treeDialog"
                        className='treeDialog'
                        title="选择要显示的数据(最多选择5个)"
                        visible={this.state.visible}
                        onOk={this.handleOk.bind(this)}
                        onCancel={this.handleCancel.bind(this)} >
                    <Tree
                        checkable
                        onExpand={this.onExpand.bind(this)}
                        expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck.bind(this)}
                        checkedKeys={this.state.checkedKeys}
                        // onSelect={this.onSelect.bind(this)}
                        // selectedKeys={this.state.selectedKeys}
                    >
                        {this.renderTreeNodes(this.state.treeData)}
                    </Tree>
                </Modal>
            </div>
        )
    }

}