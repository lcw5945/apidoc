/**
 * Created by Cray on 2017/7/24.
 */
import React, {Component} from 'react'
import {
    Link
} from 'react-router-dom'
class simCpm extends Component {
    render() {
        return (
                <div>
                    <ul>
                        <li><Link to="/">HOme</Link></li>
                        <li><Link to="/base">Topics</Link></li>
                    </ul>
                    <hr/>
                </div>
        )
    }
}

export default simCpm