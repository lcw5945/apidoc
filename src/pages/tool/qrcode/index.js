/**
 * Created by chy on 2017/10/18.
 */
import React from 'react';
import  MainNav  from '~components/common/MainNav';
import  QRcodeContainer  from '~containers/tool/QRcodeContainer';


export default class QRcode extends React.Component {


    render() {
        return (
            <div id='qrcodeBox'>
                <MainNav/>
                <QRcodeContainer/>
            </div>
        )
    }
}

