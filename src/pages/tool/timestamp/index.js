/**
 * Created by VULCAN on 2017/10/17.
 */

import React from 'react';
import  MainNav  from '~components/common/MainNav';
import  UnixTimestamp  from '~containers/tool/UnixTimestamp';


export default class Timestamp extends React.Component {


    render() {
        return (
            <div id='jsonBox'>
                <MainNav/>
                <UnixTimestamp/>
            </div>
        )
    }
}



