/*
* 右侧导航组件
* */

import React, {Component} from 'react'
import './right-nav.css'
import imgurl from '../../pages/login/images/sxc.jpg'
import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon, Button} from 'antd'
import menulist from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
import user from "../../pages/user/user";

const {SubMenu} = Menu;

class RightNav extends Component {

    hasAuth = (item)=>{

        let {key,isPublic} = item
        let username = memoryUtils.user.username
        let menus = memoryUtils.user.role.menus

        /*
        * 判断当前登录用户对Item是否有权限
        *
        * 1.如果当前用户是admin
        * 2.当前用户有此item的权限:key有没有在menus中
        * 3.如果当前item是公开的
        *  */
        if(username === 'admin' || isPublic === true || menus.indexOf(key) !== -1){
            return true
        }else if(item.children){
            //如果当前用户有此item的某个子item的权限,也要显示出来
            return !!item.children.find(child =>menus.indexOf(child.key) !== -1)
        }
        return false
    }

    getMenuNodes = (menulist) => {
        //根据menu的数据数组,生成对应的标签数组
        let path = this.props.location.pathname

        return menulist.reduce((pre, item) => {

                //如果当前用户有item对应的权限,才需要显示对应的菜单项
                if (this.hasAuth(item)) {
                    if (!item.children) {
                        pre.push((
                            <Menu.Item key={item.key}>
                                <Link to={item.key}>
                                    <Icon type={item.icon}/>
                                    <span>{item.title}</span>
                                </Link>
                            </Menu.Item>
                        ))
                    } else {
                        let cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                        //如果存在,将item子列表打开
                        if (cItem) {
                            this.openKey = item.key
                        }
                        pre.push((
                            <SubMenu
                                key={item.key}
                                title={
                                    <span>
                            <Icon type={item.icon}></Icon>
                            <span>{item.title}</span>
                        </span>
                                }
                            >
                                {this.getMenuNodes(item.children)}
                            </SubMenu>
                        ))
                    }
                }
                return pre
            }
            , [])
        /*  return menulist.map(item => {
              if (!item.children) {
                  return (
                      <Menu.Item key={item.key}>
                          <Link to={item.key}>
                              <Icon type={item.icon}/>
                              <span>{item.title}</span>
                          </Link>
                      </Menu.Item>
                  )
              } else {
                  let url = this.props.location.pathname
                  let cItem = item.children.find(cItem => cItem.key === url)
                  //如果存在说明当前item的子列表需要打开
                  if (cItem) {
                      this.openKey = item.key
                  }
                  return (
                      <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                          {
                              this.getMenuNodes(item.children)
                          }
                      </SubMenu>
                  )
              }
          })*/
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