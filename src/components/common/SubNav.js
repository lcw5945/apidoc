/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import Utils from '~utils'


export default class SubNav extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            subNav_list :[]
        }
    }

    componentWillMount(){
        let subNavType = this.props.subNavType ;

        if(subNavType === 'homeList'){
            this.setState({
                subNav_list : [{id:1,type:'folder',cont:'项目列表',pathname:'/home/pm/project',chooseType:'pm/project'},{id:2,type:'database',cont:'数据字典',pathname:'/home/pm/databases',chooseType:'pm/databases'}]
            })
        }else if(subNavType === 'childList'){
            this.setState({
                subNav_list : [{id:3,type:'api',cont:'接口文档',pathname:'/project/api/list',chooseType:'/project/api'},{id:4,type:'code-o',cont:'状态码文档',pathname:'/project/code/list',chooseType:'project/code'}]
            })
        }

    }

    componentDidMount() {
   }

    render() {
        const SubNav_list = this.state.subNav_list;
        const queryData = Utils.parseUrlToData(window.location.search);
        let queryPath = "" ;
       try{
           if(this.props.subNavType === 'childList'){
               queryPath = '?projectId=' + queryData.projectId + '&groupId=-1' ;
           }

       }catch (e) {
           console.log('错误信息提示',e)
       }
        return (
            <div className='subNav' >
                <ul className='clearfix'>
                    {
                        SubNav_list.map((data) => {
                            return <Link to={data.pathname + queryPath} key={data.id}><li className={window.location.pathname.indexOf(data.chooseType)>-1?'subNavChoose':''} ><Icon type={data.type} /><span>{data.cont}</span></li></Link>
                        })
                    }
                </ul>
            </div>
        )
    }
}
SubNav.propTypes = {
    subNavType:PropTypes.string.isRequired
};