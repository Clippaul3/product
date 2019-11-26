import React,{Component} from  'react'
import {BrowserRouter,Route,Switch,NavLink,Redirect} from 'react-router-dom'
import Login from "./pages/login/login";
import Admin from "./pages/admin/admin";

export default class App extends Component{


    render() {
        return(
            <div style={{height:'100%',width:'100%'}}>
                <BrowserRouter>
                    <Switch>
                        <Route path={'/login'} component={Login}/>
                        <Route path={'/admin'} component={Admin}/>
                        <Redirect to={'/login'}/>
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}