import React,{Component} from  'react'
import {Switch,Route,Redirect} from 'react-router-dom'

import ProductHome from "./home";
import Detail from "./detail";
import ProductAddUpdate from "./add-update";
import './product.css'

export default class Product extends Component{
    render() {
        return(
            <Switch>
                <Route exact path={'/admin/product'} component={ProductHome}/>
                <Route path={'/admin/product/add-update'} component={ProductAddUpdate}/>
                <Route path={'/admin/product/detail'} component={Detail}/>
                <Redirect to={'/admin/product'} />
            </Switch>
        )
    }
}