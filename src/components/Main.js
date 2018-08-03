import React from 'react'
import { Register } from './Register'
import {Route, Link, Switch, Redirect} from 'react-router-dom';
import {Login} from "./Login"
export class Main extends React.Component {
    getLogin = ()=>{
        return (
            <div>
                <Login/>
            </div>
        );
    }
    getRoot = ()=>{
        return (
            <Redirect to = "login"/>
        );
    }
    render(){
        return (
            <div className="main">
                <Switch>
                    <Route exact path = "/" render = {this.getRoot} />
                    <Route path = "/register" component = {Register}/>
                    <Route path = "/login" render = {this.getLogin}/>
                    <Route render = {this.getRoot}/>
                </Switch>
            </div>
        );
    }
}