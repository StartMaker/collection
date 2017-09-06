import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import Analyse from '../containers/Analyse';
import Event from '../containers/Event';
import Topic from '../containers/Topic';
import Handle from '../containers/Handle';
import Login from '../containers/Login';
import NotFound from '../containers/Notfound';
import App from '../containers/App'

class RouteMap extends React.Component {

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
                    <Route path='/event' component={Event}/>
                    <Route path='/handle' component={Handle}/>
                    <Route path='/topic' component={Topic}/> 
                    <Route path='/login(/:router)' component={Login} /> 
                    <Route path="*" component={NotFound}/> 
                </Route> 
            </Router> 
            ) 
    } 
}

export default RouteMap;

