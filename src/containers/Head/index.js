import  React from 'react';
import { Link, hashHistory } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Menu, Icon, Button, Dropdown, Modal, Tabs } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as userInfoActionsFromOtherFile from '../../actions/userinfo.js';

import * as fetchType from '../../constants/fetchType';

import PriManage from '../PriManage';
import Category from '../../components/Category';
import User from './subpage';
import downLoadReport from '../../fetch/downLoadReport';


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
            reportDate: {
                year: (new Date()).getFullYear(),
                month: (new Date()).getMonth() + 1
            } 
        }
    }
    componentDidMount() {
        console.log('this.props' ,this.props);
    }
    // 点击时调用
    handleDiffPage(e){ 
        console.log('click ', e.key);
        hashHistory.push(e.key);
        this.setState({
          current: e.key,
        });
    }
    // 权限管理
    handleRightCom() {   
        console.log('handleRightCom');
        this.setState({
            visible: true
        })
    }
    // 注销
    handleDisconneted() {  
        console.log('handleDisconneted');
        this.props.userinfoAction.logout({});
        hashHistory.push('login');
    }
    // 生成报表
    handleDownLoadReport() { 
        this.setState({
            isDownLoadReport: true
        })
        let { token } = this.props.userinfo; 
        let result = downLoadReport( token );
        result.then(resp =>{
            if (resp.ok) {
                return resp.text()
            }
        }).then(text => {
            const { reportDate } = this.state;
            let _a = document.createElement('a');
            const url = `/event/report/${reportDate.year}/${reportDate.month}?permission=${text}`;
            const filename = `西南石油大学${reportDate.year}年${reportDate.month-1}-${reportDate.month}月舆情报表`;
            console.log('url', url);
            _a.setAttribute('href', url);
            _a.setAttribute('download', filename);
            _a.click();
            console.log(_a);
            _a = null;
            this.setState({
                isDownLoadReport: false
            })
        }).catch(ex => {
            if (__DEV__) {
                console.log('下载报表出错 ', ex.message);
            }
        })
        // /event/report/2017/3?permission=db2501df6a994728"
        // /event/report/2017/9?permission=e5a4968e40ec49e3
        // setTimeout(function(){
        // this.setState({
        //     isDownLoadReport: false
        // })
        // }.bind(this), 1500)
    }
    // 月报月份
    handleChangeReportDate(year, month) {

        // console.log(year, month);
        this.setState({
            reportDate: {
                year,
                month
            }
        })
        console.log('当前月份', this.state.reportDate);
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
                 handleChangeReportDateAction={this.handleChangeReportDate.bind(this)} // 改变月报月份
                 handleRightCom={this.handleRightCom.bind(this)}/> {/* 权限管理 */}

            {/* 导航 */}
                <Category current={this.state.current}  // 默认选中 
                changePage={this.handleDiffPage.bind(this)}/>  {/*改变页面时*/}

            {/* 權限管理*/}
                <PriManage visible={this.state.visible} // 弹窗是否可见 
                onCancle={this.handleHideMode.bind(this)} // 取消 
                token={this.props.userinfo.token}
                username={this.props.userinfo.username}/> 
                

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