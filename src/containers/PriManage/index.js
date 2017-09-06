import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {  Modal, Tabs, Icon, Form, Input, Button } from 'antd';

import AddUser from '../../components/PriManagePage/addUser'
import PriModify from '../../components/PriManagePage/priModify'
import PwModify from '../../components/PriManagePage/PwModify'

import getUserList from '../../fetch/userList'

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
        let { token } = this.props;
        let result = getUserList(token);
        result.then(resp => {
            return resp.json()
        }).then(json => {

            this.setState({
                userList: json
            })
            console.log('json', json);
        }).catch(ex => {
            if (__DEV__) {  // 在开发模式下
                console.log('用户列表获取失败', ex.message);
            }
        })
    }
    changeTab(index) {
        console.log('切換tab', index);
        // if () {};
    }
     // handleSubmit = (e) => {
     //    e.preventDefault();
     //    this.props.form.validateFields((err, values) => {
     //      if (!err) {
     //        console.log('Received values of form: ', values);
     //      }
     //    });
     //  }
    render(){
        // const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // const userNameError = isFieldTouched('userName') && getFieldError('userName');
        // const passwordError = isFieldTouched('password') && getFieldError('password');

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
                    <TabPane tab={<span><Icon type="usergroup-add" />添加新用户</span>} key='1'> 
                        <AddUser/>
                    </TabPane>
                    <TabPane tab={<span><Icon type="schedule" />权限修改</span>} key='2'>
                        <PriModify userList={this.state.userList}/>
                    </TabPane>
                    <TabPane tab={<span><Icon type="edit" />修改密码</span>} key='3'>
                        <PwModify />
                    </TabPane>
                </Tabs>
            </Modal>

        )
    }
}

export default PriManage;