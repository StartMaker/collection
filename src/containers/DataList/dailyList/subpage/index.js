import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Form, Icon, Input, Button, Table } from 'antd';
import './style.less';

import EditableInput from '../../../../components/EditableInput';

const FormItem = Form.Item;
// const 

class CollectionWrap extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.columns = [{
          title: '主题',
          dataIndex: 'theme'
        },{
          title: '主要观点',
          dataIndex: 'mainView',
          width: '45%',
          render: (text, record, index) =>{ 
            console.log('text, record, index', text, record, index);
            return (
            <EditableInput  
            value={text}
            onChange={this.handleChange} />
            )
          }
        },{
          title: '更贴量',
          dataIndex: 'followCount'
        },{
          title: '类别',
          dataIndex: 'postType',
          width: '20%',
          render: (text, record, index) => (
            <EditableInput  
            value={text}
            onChange={this.handleChange} />
            )
        },{
          title: '发帖时间',
          dataIndex: 'postTime'
        },{
          title: '来源',
          dataIndex: 'source'
        }]
    }
    handleSubmit(value='') {
      console.log(' submit the form ', value);
    }
    handleChange(e){
      console.log(e);
    }
    render(){
       const { getFieldDecorator } = this.props.form;
       const { theme, mainView, source, postType, followCount, postTime } = this.props.data;
       const data =  this.props.data;
        return(
            <div>
            <Form onSubmit={this.handleSubmit.bind(this)}>
            <Table 
            size="small"
            pagination={false}
            bordered
            dataSource={data}
            columns={this.columns}>

            </Table>
            </Form>
            </div>

        )
    }
}
const Collection = Form.create()(CollectionWrap);
export default Collection;