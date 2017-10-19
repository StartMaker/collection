import  React from 'react';
import { Link, hashHistory } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Form, Icon, Input, Button, Checkbox, message} from 'antd';

import localSave from '../../util/localStore';

import login from '../../fetch/login';


import * as userInfoActionsFromOtherFile from '../../actions/userinfo.js';


import './style.less';

const FormItem = Form.Item;


class Login extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
        // 读取保存的账号
        const setFieldsValue = this.props.form.setFieldsValue;
        if(localSave.getItem('BDTB_USERNAME') != null ){
            setFieldsValue({username: localSave.getItem('BDTB_USERNAME') });
            setFieldsValue({password: localSave.getItem('BDTB_PASSWORD') });
            setFieldsValue({remember: true});
        } else {
            setFieldsValue({username: "" });
            setFieldsValue({password: "" });
        }
    }
    hasErrors(fieldsError) {   // 判断输入框是否有错
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, value) => { // 提交
            if (!!value.remember) {
                localSave.setItem('BDTB_USERNAME', value.username);
                localSave.setItem('BDTB_PASSWORD', value.password);
            }
            if(! err ) {
                // console.log('Received values of form: ', value);
                delete value.remember;
                const result = login(value);
                result.then(resp => {
                    console.log('resp', resp);
                    if (resp.ok) {
                        return resp.json();
                    }
                }).then(data => {
                    const { role, token, username } = data;
                    this.props.userInfoAction.login({
                        role: role,
                        token: token,
                        username: username
                    })
                    hashHistory.push('/ana');
                }).catch(ex =>{
                    message.error('用戶名或者密码输入错误');
                    // console.log('登录发生错误', ex.message);
                })
            }
        })
    }
    render(){
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Only show error after a field is touched.
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return(
            <div className='login-container'>
                <Form
                 onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem
                      validateStatus={userNameError ? 'error' : ''}
                      help={userNameError || ''}
                    >
                      {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                      })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
                      )}
                    </FormItem>
                    <FormItem
                      validateStatus={passwordError ? 'error' : ''}
                      help={passwordError || ''}
                    >
                      {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                      })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                      )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initalValue: true,
                        })(
                        <Checkbox className='login-btn-radio'>Remember me</Checkbox>
                        )}
                      <Button
                        className='login-btn-submit'
                        type="primary"
                        htmlType="submit"
                        disabled={this.hasErrors(getFieldsError())}
                      >
                        Log in
                      </Button>
                    </FormItem>
                  </Form>


            </div>

        )
    }
}
const LoginWrap = Form.create()(Login);

// 连接redux

// {
//                     this.props.userinfo.username == null ? " 未登录 " : `已登录   ${this.props.userinfo.username}`

//                 }

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
)(LoginWrap);