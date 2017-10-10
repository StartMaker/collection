import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Analyse from '../containers/Analyse';  // 舆情分析
import Handle from '../containers/Handle'; // 舆情处置
import Special from '../containers/Special';  // 专题事件
import Topic from '../containers/Topic';    // 专贴事件
import Login from '../containers/Login';
import NotFound from '../containers/Notfound';
import App from '../containers/App'

import { Affix, Button } from 'antd';

let count = 0 ;
class RouteMap extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            play: true
        }
    }
    updateHandle() { 
        console.log('记录PV');
        //PV统计
    }
     render() {

        return ( 
            <Router 
             history={this.props.history} 
             onUpdate={this.updateHandle.bind(this)}> 
                <Route path='/' component={App}> 
                    <IndexRoute component={Login}/> 
                    <Route path='/ana' component={Analyse}/>
                    <Route path='/handle' component={Handle}/>
                    <Route path='/special' component={Special}/> 
                    <Route path='/Topic' component={Topic}/> 
                    <Route path='/login(/:router)' component={Login} /> 
                    <Route path="*" component={NotFound}/> 
                </Route> 
            </Router> 
            ) 
    } 
}
// 连接redux

// {
//                  

//                 }

// function mapStateToProps(state) {
//     return {
//         userinfo: state.userinfo
//     }
// }


// export default connect(
//     mapStateToProps
// )(RouteMap);

export default RouteMap;

