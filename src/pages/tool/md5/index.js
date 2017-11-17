/**
 * Created by VULCAN on 2017/10/17.
 */

import React from 'react';
import  MainNav  from '~components/common/MainNav';
import  Md5Container  from '~containers/tool/Md5Container';


export default class Md5 extends React.Component {


    render() {
        return (
            <div id='jsonBox'>
                <MainNav/>
                <Md5Container/>
            </div>
        )
    }
}



