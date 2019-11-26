/*
* 右侧导航组件
* */

import React, {Component} from 'react'
import './right-nav.css'
import imgurl from '../../pages/login/images/sxc.jpg'
import {Link,withRouter} from 'react-router-dom'
import {Menu, Icon, Button} from 'antd'
import menulist from "../../config/menuConfig";

const {SubMenu} = Menu;

class RightNav extends Component {

    getMenuNodes =(menulist)=>{
        //根据menu的数据数组,生成对应的标签数组
        return menulist.map(item =>{
            if(!item.children){
                return(
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }else{
                let url = this.props.location.pathname
                let cItem = item.children.find(cItem => cItem.key === url)
                //如果存在说明当前item的子列表需要打开
                if(cItem){
                    this.openKey = item.key
                }
                return(
                    <SubMenu key={item.key} title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                )
            }
        })
    }

    componentWillMount() {
        //为第一次render做准备数据
       this.menuNodes = this.getMenuNodes(menulist)
    }


    render() {
        //得到当前请求的路由路径,用于默认选择
        let url = this.props.location.pathname
        let openKey = this.openKey
        return (
            <div className={'right-nav'}>
                <Link to={''} className={'right-nav-header'}>
                    <img src={imgurl} alt={'1'}/>
                    <h1>儒雅随和</h1>
                </Link>
                <Menu mode="inline" theme="pink" selectedKeys={[url]} defaultOpenKeys={[openKey]}>
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

export default withRouter(RightNav)