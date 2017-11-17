/**
 * Created by VULCAN on 2017/10/17.
 */

import React from 'react';
import  MainNav  from '~components/common/MainNav';
import  Base64Container  from '~containers/tool/Base64Container';


export default class Base64 extends React.Component {


    render() {
        return (
            <div id='jsonBox'>
                <MainNav/>
                <Base64Container/>
            </div>
        )
    }
}




