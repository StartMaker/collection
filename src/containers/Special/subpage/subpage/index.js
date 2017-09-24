import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Form, Icon, Input, Button, message, Modal  } from 'antd';

import TagInput from '../../../../components/TagInput';

const FormItem = Form.Item;
import './style.less';

class IncreaseEventWrap extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    handleCancel(){
        this.props.onCancle();
    }
    handleOk(){
        this.props.onAdd();
    }
    handleGetRegionAction(regions) {
        console.log('父组件得到的regions', regions);
    }
    handleGetRulesAction(rules) {
        console.log('父组件得到的rules', rules);
    }
    render(){
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        return(
            <div>
            <Form>
                <FormItem
                 label="专题名">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please input topic name!' }],
                  })(
                    <Input prefix={<Icon type="tag" style={{ fontSize: 13 }} />} placeholder="topic name" />
                  )}
                </FormItem>
                <FormItem
                label="地域">
                {getFieldDecorator('region', {
                    rules: [{ required: true, message: 'Please input topic name!' }],
                  })(
                    <TagInput handlePopValue={this.handleGetRegionAction.bind(this)} initTags={['西南石油大学']} />
                   )}
                </FormItem>
                <FormItem
                label="关键字">
                {getFieldDecorator('rules', {
                    rules: [{ required: true, message: 'Please input topic name!' }],
                  })(
                    <TagInput handlePopValue={this.handleGetRulesAction.bind(this)} />
                   )}
                </FormItem>
            </Form>
            <p>            
                <Button key="back" onClick={this.handleCancel.bind(this)}>取消</Button>,
                <Button key="submit" type="primary" onClick={this.handleOk}>
                  添加
                </Button>
            </p>
            </div>

        )
    }
}
const IncreaseEvent = Form.create()(IncreaseEventWrap);
export default IncreaseEvent;