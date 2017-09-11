import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {   Icon, Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class PwModify extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            confirmDirty: false
        }
    }
    handleConfirmBlur(e) {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    checkPassword(rule, value, callback) {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
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
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values );
            this.props.modifyPWAction(values);
          }
        });
    }
    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    }
    render(){
         const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
         const userNameError = isFieldTouched('userName') && getFieldError('userName');
         const passwordError = isFieldTouched('password') && getFieldError('password');
        return(
            <Form layout='vertical'>
                <FormItem
                  label='Currently User'>
                  {getFieldDecorator('user', {
                    rules: [{ required: false, message: 'Please input your original password!' }],
                  })(
                    <Input disabled prefix={<Icon type="user" style={{ fontSize: 13 }} />} type='user' placeholder={this.props.username} />
                  )}
                </FormItem>
                <FormItem
                  label='original password'>
                  {getFieldDecorator('oldPassword', {
                    rules: [{ required: true, message: 'Please input your original password!' }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type='password' placeholder="original password" />
                  )}
                </FormItem>

                <FormItem
                  label="New Password"
                  hasFeedback
                  min='6'
                >
                  {getFieldDecorator('newPassword', {
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
const PwModifyWrap = Form.create()(PwModify);
export default PwModifyWrap;