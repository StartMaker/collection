import  React from 'react';
import { Link, hashHistory } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Menu, Icon, Button, Dropdown, Modal, Tabs, message } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as userInfoActionsFromOtherFile from '../../actions/userinfo.js';

import * as fetchType from '../../constants/fetchType';

import PriManage from '../PriManage';
import Category from '../../components/Category';
import User from './subpage';
import downLoadReport from '../../fetch/downLoadReport';
import downLoadTopicReport from '../../fetch/downLoadSpecialReport';

const MenuItemGroup = Menu.ItemGroup;

import './style.less'




class Head extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            current: this.props.selectedKeys,  // 默认选择页
            privilege: false,
            isDownLoadReport: false,  //是否在下载报表
            visible: false, // 权限管理 弹窗
            reportDate: {
                year: (new Date()).getFullYear(),
                month: (new Date()).getMonth() + 1
            } 
        }
    }
    componentDidMount() {
        const role = this.props.role;
        // console.log('this.props' ,this.props);
        // console.log('NODE_ENV', __DEV__);
        if (role === 'ADMIN') {
            this.setState({privilege: true})
        }
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
        // console.log('handleRightCom');
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
    // 生成专报
    handleDownLoadTopicReport() {
        const { selectedRows } = this.props;
        console.log('this.props.selectedRows', selectedRows);
        // fetch 
        let { token } = this.props.userinfo;
        this.setState({
            isDownLoadReport: true
        })
        let result = downLoadTopicReport(token, selectedRows.map((item, index) => item.url));
        // deal fetch-return-promise
        result.then(resp => {
            if (resp.ok) {
                return resp.blob()
            } else {
                message.error('专报生成失败');
            }
        }).then(blob => {
            this.downloadFile(blob, "专报");
        }).catch(ex => {
            if (__DEV__) {
                console.log(ex.message);
            }
            this.setState({
                isDownLoadReport: false,
            })
        })
        // message.info('下载专报功能暂未开放');
    }
    // 生成报表
    handleDownLoadReport() { 
        const { reportDate } = this.state;
        this.setState({
            isDownLoadReport: true
        })
        let { token } = this.props.userinfo; 
        let result = downLoadReport( token, reportDate );
        result.then(resp =>{
            if (resp.ok) {
                return resp.blob()
            } else {
                message.error('该月份月报暂未生成');
            }
        }).then(blob => {
            const filename = `西南石油大学${reportDate.year}年${reportDate.month-1}-${reportDate.month}月舆情报表.doc`;
            this.downloadFile(blob, filename);
        }).catch(ex => {
            if (__DEV__) {
                console.log('下载报表出错 ', ex.message);
            }
            // message.info('下载报表功能暂未开放');
            this.setState({
                isDownLoadReport: false,
            })
        })
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
    // 文件下载
    downloadFile(blob, fileName) {
        // console.log(blob);
            // 兼容FF
            // const isFF = false;
            let url = window.URL.createObjectURL(blob);
            // console.log('primary url', url);
            let _a = document.createElement('a');

            _a.href = url ;
            _a.download = fileName;
            document.body.appendChild(_a); // 兼容FF
            _a.click();
            document.body.removeChild(_a); // 兼容FF
            // 释放文件引用
            URL.revokeObjectURL(url);
            // 解除等待状态
            this.setState({
                isDownLoadReport: false,
            })
    }
    render(){
        const { role, username, token} = this.props.userinfo;
        const { privilege, current } = this.state;
        const { selectedRows : selectedRows4Topic } = this.props;
        return(
            <div id='header-container'>

            {/* 用户信息 */}
                <User 
                 selectedRows4Topic={selectedRows4Topic}
                 handleDownLoadReport={this.handleDownLoadReport.bind(this)}   // 下载报表
                 handleDownLoadTopicReport={this.handleDownLoadTopicReport.bind(this)}
                 isDownLoadReport={this.state.isDownLoadReport} // 是否在下载报表
                 role={role}  //  角色权限
                 username={username}  // 角色名字
                 privilege={privilege} // 角色是否拥有最高权限
                 handleDisconneted={this.handleDisconneted.bind(this)} // 注销
                 handleChangeReportDateAction={this.handleChangeReportDate.bind(this)} // 改变月报月份
                 handleRightCom={this.handleRightCom.bind(this)} // 权限管理 
                 current={current}/> {/* 当前选中 */}

            {/* 导航 */}
                <Category 
                 current={current}  // 默认选中 
                 changePage={this.handleDiffPage.bind(this)}/>  {/*改变页面时*/}

            {/* 權限管理*/}
                <PriManage 
                 visible={this.state.visible} // 弹窗是否可见 
                 onCancle={this.handleHideMode.bind(this)} // 取消 
                 token={token}
                 username={username}/> 
                

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