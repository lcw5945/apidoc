/**
 * Created by user on 2017/12/6.
 */
import React from 'react'
import Utils from '~utils';
import _ from 'lodash';
function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
}
export const ProjectUserAuth = (WrappedComponent) => class extends React.Component {
    static displayName = `Auth(${getDisplayName(WrappedComponent)})`

    constructor(props) {

        super(props)

        let proUserAuth = {
            authority: -1, //权限 , -1或空表示无权限  0 表示mock权限 2表示编辑权限 3表示创建者或root
            isAdmin: false,
            isRoot: false
        };
        const queryData = Utils.parseUrlToData(document.location.search);
        let proId = queryData['projectId']

        if (proId && this.props.entity) {
            const {projects} = this.props.entity;
            let user = this.props.user;
            let pro = _.find(projects['items'], {'_id': queryData.projectId}) || {};


            let userAuth = _.find(pro.cooperGroup, {userId: user.userId}) || {}; //用户在此项目的权限
            proUserAuth.authority = userAuth.authority > -1 ? userAuth.authority : -1;
            if (user.auth === 3) {
                proUserAuth.isRoot = true
                proUserAuth.authority = 3
            }

            if (user.userId === pro.admin) {
                proUserAuth.authority = 2
                proUserAuth.isAdmin = true
            }

            // console.log("user-------------------------->",user)
            // console.log("pro-------------------------->",pro)
            // console.log("userAuth-------------------------->",userAuth)

        } else {
            console.log("ProjectUserAuth:projectId为空")
        }

        this.state = {
            proUserAuth
        }

    }


    render() {

        let newProps = _.merge({}, this.props, {user: this.state});

        return <WrappedComponent {...newProps} />
    }
}