import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {  Modal, Tabs, Icon, Form, Input, Button, message } from 'antd';

import AddUser from '../../components/PriManagePage/addUser'
import PriModify from '../../components/PriManagePage/priModify'
import PwModify from '../../components/PriManagePage/PwModify'

import getUserList from '../../fetch/userList';  // 获取用户列表
import deleteUser from '../../fetch/deleteUser'  // 删除用户
import addUser from '../../fetch/addUser' // 添加用户
import changeRole from '../../fetch/changeRole' // 修改权限
import modifyPW from '../../fetch/modifyPW' // 修改密码

import * as fetchType from '../../constants/fetchType'
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class PriManage extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            userList: {}
        }
    }
    handleHideMode() {
        this.props.onCancle();
    }
    componentDidMount() {
        this.getUserListFun();
    }
    changeTab(index) {
        console.log('切換tab', index);
        // if () {};
    }
    // 获取用户列表 
    getUserListFun() {   
        let { token } = this.props;
        let result = getUserList(token);
        result.then(resp => {
            return resp.json()
        }).then(json => {
            let newUserList = [];
            let sample = [];
            for(let key of Object.keys(json)) {
                sample = sample.concat(json[key]);
            }
            for(let key in sample){
                newUserList.push(Object.assign({}, sample[key], {key: newUserList.length}))
            }
            console.log('成功获取了用户列表');
            this.setState({
                userList: newUserList
            })
        }).catch(ex => {
            console.log('用户列表获取失败', ex.message);
            if (__DEV__) {  // 在开发模式下
            }
        })
    }
    // 删除用户 
    deleteUserAction(delObj) { 
        let { token } = this.props;
        console.log(' 删除对象 ',delObj);
        console.log(' 删除对象 ',delObj.username);
        let result = deleteUser(delObj.username, token, fetchType.FETCH_TYPE_POST_URL);
        result.then(resp => {
            if (resp.ok) {
                message.success(`成功删除 ${delObj.username} 用户`);
                this.getUserListFun();
            }
        })
    }
    // 添加用户 
    addUserAction(addObj) {
        let { token } = this.props;
        let { userList } = this.state;
        let repeatFlag = false;
        for(let key in userList) {
            if (userList[key].username === addObj.username ) {
                message.error('用戶名已存在，请更换');
                repeatFlag = true;
                break;
            }
        }
        if(repeatFlag) { return }

        delete addObj.confirm;

        let result = addUser(addObj, token);

        result.then(resp => {
            if (resp.ok) {
                message.success('新用户成功添加');
                this.getUserListFun();
            }
        }).catch(ex =>{
            console.log('添加用户失败 ', ex.message);
            if (__DEV__) {
            }
        })
    }
    // 修改权限
    changeRoleAciton(changeObj) {
        let { token } = this.props;
        let result = changeRole({
            username: changeObj.username,
            role: changeObj.role
        }, token);
        result.then(resp =>{
            if(resp.ok){
                this.getUserListFun();
                message.success('修改成功');
            }
        })
    }
    // 修改密码
    modifyPWAction(modifyPWObj) {
        delete modifyPWObj.user;
        delete modifyPWObj.confirm;
        let { token } = this.props;
        let result = modifyPW(modifyPWObj, token);
        result.then(resp => {
            if (resp.ok) {
                return resp.text();
            } else {
                message.error('服务器内部发生错误');
            }
        }).then(text => {
            if (text==='原始密码不匹配，请重新输入原始密码') {
                message.error(text);
            } else {
                message.success('你的密码已经修改成功！');
            }
        }).catch(ex => {
            if (__DEV__) {
                console.log('修改密码时发生错误 ', ex.message);
            }
        })
    }
    render(){

        return(
            <Modal
                width='600'
                title='权限管理'
                visible={this.props.visible}
                onOk={this.handleHideMode.bind(this)}
                onCancel={this.handleHideMode.bind(this)}
                footer={null}>
                <Tabs style={{height: '420px',width: '580px'}}
                onChange={e => { this.changeTab(e)} }
                tabPosition='left'>
                    <TabPane tab={<span><Icon type="usergroup-add" />Add New User</span>} key='1'> 
                        <AddUser addUserAction={this.addUserAction.bind(this)}/>
                    </TabPane>
                    <TabPane tab={<span><Icon type="schedule" />Privilege Modify </span>} key='2'>
                        <PriModify 
                         userList={this.state.userList} 
                         deleteUserAction={this.deleteUserAction.bind(this)}
                         changeRoleAciton={this.changeRoleAciton.bind(this)} />

                    </TabPane>
                    <TabPane tab={<span><Icon type="edit" />Reset Password</span>} key='3'>
                        <PwModify 
                         username={this.props.username}
                         modifyPWAction={this.modifyPWAction.bind(this)}/>
                    </TabPane>
                </Tabs>
            </Modal>

        )
    }
}

export default PriManage;