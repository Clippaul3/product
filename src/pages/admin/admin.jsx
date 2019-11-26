import React,{Component} from  'react'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {Redirect,Route,Switch} from 'react-router-dom'
import {Layout} from 'antd'
import RightNav from "../../components/right-nav/right-nav";
import HeaderNav from "../../components/header-nav/header-nav";
import './admin.css'
import Home from "../home/home";
import Category from "../category/catagory";
import Product from "../product/product";
import Roles from "../roles/roles";
import User from "../user/user";
import Pie from "../charts/pie";
import Line from "../charts/line";
import Bar from "../charts/bar";


const {Header,Footer,Sider,Content} = Layout
export default class Admin extends Component{



    render() {

        let {user} = memoryUtils
        //如果当前内存中没有user说明当前尚未登陆
        if(!user || !user._id){
            //自动跳转回登录界面
            return <Redirect to={'/login'}/>
        }

        return(
            <Layout className={'layout'}>
                <Header className={'header'} style={{backgroundColor:'pink'}}>
                    <HeaderNav/>
                </Header>
                <Layout>
                    <Content style={{margin:'20px',backgroundColor:'lightgray'}}>
                        <Switch>
                            <Route path={'/admin/home'} component={Home}/>
                            <Route path={'/admin/category'} component={Category}/>
                            <Route path={'/admin/user'} component={User}/>
                            <Route path={'/admin/roles'} component={Roles}/>
                            <Route path={'/admin/product'} component={Product}/>
                            <Route path={'/admin/charts/pie'} component={Pie}/>
                            <Route path={'/admin/charts/line'} component={Line}/>
                            <Route path={'/admin/charts/bar'} component={Bar}/>
                            <Redirect to={'/admin/home'}/>
                        </Switch>
                    </Content>
                    <Sider>
                        <RightNav/>
                    </Sider>
                </Layout>
                <Footer style={{opacity:0.5,textAlign:"center",backgroundColor:'pink'}}>
                    欢迎使用,建议使用谷歌浏览器,如有疑问请咨询:18760325022
                </Footer>
            </Layout>
        )
    }
}