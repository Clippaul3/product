import React,{Component} from  'react'
import './header-nav.css'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {Icon,Modal} from 'antd'
import api from '../../api'
import {formateDate} from "../../utils/dateutils";
import {withRouter} from 'react-router-dom'
import menulist from "../../config/menuConfig";


class HeaderNav extends Component{

    state = {
        now_time:formateDate(Date.now()),//读取时间
        wea_img:'',//读取天气图片
        wea:'',//读取天气
        air_level:'',//读取空气质量
        air_tips:''//读取天气建议
    }

    quit = ()=>{
        //退出登录
        /*let confirm = window.confirm("确认退出")
        if(confirm === true){
            storageUtils.deleteUser()
            window.location.reload()
        }*/
        let confirm = Modal.confirm({
            title:'您确定退出???',
            content:'点击确定您可真的拜了个拜了',
            onOk(){
                storageUtils.deleteUser()
                memoryUtils.user={}
                window.location.reload()
            },
            onCancel(){

            }
        })
    }

    currentTime = ()=>{
        //变换时间
        setInterval(()=>{
            let time = formateDate(Date.now())
            this.setState({now_time:time})
        },1000)
    }

    getWeather = ()=>{
        api.reqWeather().then((result)=>this.setState({wea:result.data.data[0].wea}))
        /*api.reqWeather().then((result)=>(this.setState({})))*/
    }

    getAirLevel = ()=>{
        api.reqWeather().then((result)=>this.setState({air_level:result.data.data[0].air_level}))
    }

    getAirTips = ()=>{
        api.reqWeather().then((result)=>this.setState({air_tips:result.data.data[0].air_tips}))
    }

    getWeaImg = ()=>{
        api.reqWeather().then((result)=>this.setState({wea_img:result.data.data[0].wea_img}))
    }

    getTitle = ()=>{
        //得到当前请求路径
        let path = this.props.location.pathname
        let title
        menulist.forEach(item=>{
            //如果当前item对象的key与path一样item的title就是需要显示的title
            if(item.key === path){
                title = item.title
            }else if(item.children){
                //在所有子item中查找相关匹配
                let cItem = item.children.find(cItem => cItem.key === path)
                if(cItem){
                    title=cItem.title
                }
            }
        })
        return title
    }

    componentDidMount() {
        //每秒变换时间
        this.currentTime()
        this.getWeather()
        this.getAirLevel()
        this.getAirTips()
        this.getWeaImg()
    }

    render() {
        //得到当前标题
        let title = this.getTitle()
        return(
            <div className={'header-nav'}>
                <div className={'header-up'}>
                    <span>欢迎,{memoryUtils.user.username}  【<a onClick={this.quit}>退出</a>】</span>
                </div>
                <div className={'header-down'}>
                    <div className={'header-down-left'}>
                        <span>{title}</span>
                    </div>
                    <div className={'header-down-right'} >

                        <span>今天的天气是:{this.state.wea}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span>空气质量:{this.state.air_level}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span>出行建议:{this.state.air_tips}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span>{this.state.now_time}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(HeaderNav)