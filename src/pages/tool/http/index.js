/**
 * Created by user on 2017/10/18.
 */
import React from 'react';
import  MainNav  from '~components/common/MainNav';
import  HttpContainer  from '~containers/tool/HttpContainer';


export default class Http extends React.Component {


    render() {
        return (
            <div id='httpBox'>
                <MainNav/>
                <HttpContainer/>
            </div>
        )
    }
}
