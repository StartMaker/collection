import  React from 'react';
import { Link, hashHistory } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Menu, Icon, Button, Dropdown, Modal, Tabs } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as userInfoActionsFromOtherFile from '../../actions/userinfo.js';

import PriManage from '../PriManage';
import Category from '../../components/Category';
import User from './subpage';

const MenuItemGroup = Menu.ItemGroup;

import './style.less'




class Head extends React.Component{
    constructor(props, context){
        super(props, context);
        // this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            current: this.props.selectedKeys,  // 默认选择页
            privilege: true,
            isDownLoadReport: false,  //是否在下载报表
            visible: false, // 权限管理 弹窗 
        }
    }
    componentDidMount() {
        console.log('this.props' ,this.props);
    }
    handleDiffPage(e){ // 点击时调用
        console.log('click ', e.key);
        this.setState({
          current: e.key,
        });
    }

    handleRightCom() {   // 权限管理
        console.log('handleRightCom');
        this.setState({
            visible: true
        })
    }

    handleDisconneted() {  // 注销
        console.log('handleDisconneted');
        this.props.userinfoAction.logout({});
        hashHistory.push('login');
    }

    handleDownLoadReport() { // 生成报表
        console.log('handleDownLoadReport');
        this.setState({
            isDownLoadReport: true
        })
        setTimeout(function(){
        this.setState({
            isDownLoadReport: false
        })
        }.bind(this), 1500)
    }
    handleHideMode() {
        this.setState({
            visible: false
        })
    }
    render(){

        return(
            <div id='header-container'>

            {/* 用户信息 */}
                <User handleDownLoadReport={this.handleDownLoadReport.bind(this)}   // 下载报表
                 isDownLoadReport={this.state.isDownLoadReport} // 是否在下载报表
                 role={this.props.role}  //  角色权限
                 username={this.props.user}  // 角色名字
                 privilege={this.state.privilege} // 角色是否拥有最高权限
                 handleDisconneted={this.handleDisconneted.bind(this)} // 注销
                 handleRightCom={this.handleRightCom.bind(this)}/> {/* 权限管理 */}

            {/* 导航 */}
                <Category current={this.state.current}  // 默认选中 
                changePage={this.handleDiffPage.bind(this)}/>  {/*改变页面时*/}

            {/* 權限管理*/}
                <PriManage visible={this.state.visible} // 弹窗是否可见 
                onCancle={this.handleHideMode.bind(this)}
                token={this.props.userinfo.token}/> {/* 取消 */}
                

            </div>

        )
    }
}


// 链接redux

function mapStateToProps(state) {
    return {
        userinfo: state.userinfo
    }
}
function matDispatchToProps(dispatch) {
    return {
        userinfoAction: bindActionCreators(userInfoActionsFromOtherFile, dispatch)
    }
}
export default connect(
    mapStateToProps,
    matDispatchToProps
)(Head);