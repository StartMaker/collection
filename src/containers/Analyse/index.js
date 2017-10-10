import  React from 'react';
import { Link, hashHistory } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../Head';
import DataExhibition from '../DataExhibition';
// import { Button } from 'antd';
// import getMockData from '../../fetch/easyMockTest';
import * as userInfoActionsFromOtherFile from '../../actions/userinfo.js';

import DailyDataList from '../DataList/dailyList';

import './style.less';

class Analyse extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    }
    componentDidMount() {
        if (this.props.userinfo.username == null ) { // 判断用户登录情况
            hashHistory.push('/');     
        }
    }
    handleMockTest() {
        let result = getMockData();
        result.then(resp => {
            if (resp.ok) {
                return resp.json();
            }
        }).then(json => {
            console.log('mock data', json);
        })
    }
    render(){
        // const { role, username } = this.props.userinfo;
        // console.log('this.props.userinfo', this.props.userinfo);
        const userinfo = this.props.userinfo;
        const role = userinfo.role;
        const username = userinfo.username;
        // console.log('username',username);

        return(
            <div>
                <Header user= { username } role={ role } selectedKeys='ana'/> { /* 头部 */} 
                <DataExhibition tableType='dailyEvent' token={this.props.userinfo.token}/>  { /* 图表 */}
                <DailyDataList token={this.props.userinfo.token} user= { username }/>  { /*  列表展示  */}
            </div>
        )
    }
}
// easy mock test
// <Button onClick={ this.handleMockTest }> Click me to get mock data </Button>

// 连接redux

function mapStateToProps(state) {
    return {
        userinfo: state.userinfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoAction: bindActionCreators(userInfoActionsFromOtherFile, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Analyse);