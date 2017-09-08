import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {   Icon, Form, Input, Button, Select } from 'antd';

import './style.less'

const FormItem = Form.Item;


class AddUser extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            confirmDirty: false,
            role: 'NORMAL'
        }
    }

    handleConfirmBlur(e) {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    checkPassword(rule, value, callback) {  // 验证确认密码输入框
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('Two passwords that you enter is inconsistent!');
        } else {
          callback();
        }
    }

    checkConfirm(rule, value, callback) {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    handleSubmit(e) {   // 提交表单
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', Object.assign({}, values, {role:values.role.role} ));
              this.props.addUserAction(Object.assign({}, values, {role:values.role.role}));
          }
        });
    }
    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    }
    render(){
     const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
     const userNameError = isFieldTouched('username') && getFieldError('username');
     const passwordError = isFieldTouched('password') && getFieldError('password');
        return(

            <Form layout='vertical'>
                <FormItem
                  label='UserName'>
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                  })(
                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
                  )}
                </FormItem>

                <FormItem
                  label="Password"
                  hasFeedback
                  min='6'
                >
                  {getFieldDecorator('password', {
                    rules: [{ 
                            required: true, 
                            message: 'Please input your Password!'
                        }, {
                            validator: this.checkConfirm.bind(this),
                        }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                  )}
                </FormItem>
                <FormItem
                  label="Confirm Password"
                  hasFeedback
                >
                  {getFieldDecorator('confirm', {
                    rules: [{
                      required: true, message: 'Please confirm your password!',
                    }, {
                      validator: this.checkPassword.bind(this),
                    }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" onBlur={e => { this.handleConfirmBlur(e) } } placeholder='Please confirm your password!'/>
                  )}
                </FormItem>
                <FormItem
                 label='role'>
                    {getFieldDecorator('role', {
                        initialValue: { role: 'NORMAL' },
                    })(<SelectRole />)}                    
                </FormItem>
                <FormItem>
                <span className='form-btn-container'>
                      <Button type="primary" htmlType="submit" onClick={e => {this.handleSubmit(e)}}>Submit</Button>
                      <Button type="danger" htmlType="reset" onClick={e => {this.handleReset(e)}}>Reset</Button>
                </span>
                </FormItem>
            </Form>
        )
    }
}
class SelectRole extends React.Component {  // 自定义下拉框组件
    constructor(props) {
        super(props)
        const value = this.props.value || {};
        this.state = {
          role: value.role || 'NORMAL',
        }
    }
    handleRoleChange(role) {
        if (!('value' in this.props)) {
          this.setState({ role });
        }
        this.triggerChange({ role });
    }

    triggerChange(changedValue) {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange;
        if (onChange) {
          onChange(Object.assign({}, this.state, changedValue));
        }
    }

    render() {
        const Option = Select.Option;
        return (
        <Select defaultValue="普通用户" style={{ width: 120 }} onChange={this.handleRoleChange.bind(this)}>
          <Option value="NORMAL">普通用户</Option>
          <Option value="VIP">特权用户</Option>
          <Option value="ADMIN">超级特权用户</Option>
        </Select>
        )
    }
}

const AddUserWrap = Form.create()(AddUser);

export default AddUserWrap;