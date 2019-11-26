import React,{Component} from  'react'
import './header-nav.css'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {Icon} from 'antd'

export default class HeaderNav extends Component{

    quit = ()=>{
        storageUtils.deleteUser()
        window.location.reload()
    }

    render() {
        return(
            <div className={'header-nav'}>
                <div className={'header-up'}>
                    <span>欢迎,{memoryUtils.user.username}  【<a onClick={this.quit}>退出</a>】</span>
                </div>
                <div className={'header-down'}>
                    <div className={'header-down-left'}>
                        <span>首页</span>
                    </div>
                    <div className={'header-down-right'} >

                        <span><Icon type="ant-cloud" /></span>
                        <span>aaa</span>
                    </div>
                </div>
            </div>
        )
    }
}