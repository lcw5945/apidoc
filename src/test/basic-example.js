import React, {Component} from 'react'
import {
    Link
} from 'react-router-dom'
class BasicExample extends Component {
    render() {
        return (
            <div>
                <ul>
                    <li><Link to="/">HOme3</Link></li>
                    <li><Link to="/base">Topics3</Link></li>
                </ul>
                <hr/>
            </div>
        )
    }
}

export default BasicExample