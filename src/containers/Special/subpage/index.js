import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Table, Badge, Menu, Dropdown, Icon, Button, message, Modal  } from 'antd';

import getSpecialTopicList from '../../../fetch/SpecialList/topicList';
import getSpecialEventList from '../../../fetch/SpecialList/eventList';
import * as fetchType from '../../../constants/fetchType';
import format from '../../DataExhibition/subpage/format';

import IncreaseEvent from './subpage'
import './style.less';

const menu = (
  <Menu>
    <Menu.Item>
      Action 1
    </Menu.Item>
    <Menu.Item>
      Action 2
    </Menu.Item>
  </Menu>
);
var cacheData = new Map();
class NestedTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      topicList: [],
      visible: false,
      nestedLoading: false,
    }
  }
  // 折叠内容
  expandedRowRender(record) {

    console.log('expandedRowRender: ', record);
    const columns = [{
      title: '主题',
      dataIndex: 'theme',
      key: 'theme',
      width: '19%'
    },{
      title: '主要观点',
      dataIndex: 'mainView',
      key: 'mainView',
      width: '50%'
    },{
      title: '类别',
      dataIndex: 'postType',
      key: 'postType'
    },{
      title: '来源',
      dataIndex: 'source',
      key: 'source'
    },{
      title: '发帖时间',
      key: 'createdTime',
      render: (text, record) => format(record.createdTime, 'MM-dd hh:mm')
    }];

    return (
      <Table
        loading={this.state.nestedLoading}
        rowKey='id'
        columns={columns}
        dataSource={!!record.subpage.eventPageList?record.subpage.eventPageList:[]}
        pagination={false}/>
    );
  };

  // 添加专题
  handleAddSpecial() {
    // message.error('正在开发中');
    this.setState({
      visible: true
    })
  }
  componentDidMount() {

  }
  componentWillMount() {
    this.getTopicList();
  }
  // 获取事件列表
  getEventList(id) {
    let { token } = this.props;
    // let data = [];
    this.setState({
      nestedLoading: true
    })
    setTimeout(() => {
      this.setState({
        nestedLoading: false
      })
    }, 200);

    let result = getSpecialEventList({
      url: 1,
      body: {
        more: 0,
        ids: [id]
      }
    }, token, fetchType.FETCH_TYPE_GET_URL2PARAMS);
    // 处理promise
    // return result;

    return result.then(resp => {   // 异步
      if (resp.ok){
        return resp.json()
      }
    });
  }
  // 获取专题列表
  getTopicList() {
    let { token } = this.props;

    let result = getSpecialTopicList(token);

    result.then(resp =>{
      if (resp.ok) {
        return resp.json()
      }
    }).then(topicList => {  // 异步
      // 将每个元素中的数组转为字符
        this.setState({
          topicList: Array.prototype.map.call(topicList, (item, index)=> {
          return Object.assign({},
            item, {
              key: item.id,
              rules: item.rules.join(','),
              region: item.region.join(','),
              subpage: {
                eventPageList: ['']
              }
            })
        })
      })

    }).catch(ex =>{
      console.log('专题列表获取错误', ex.message);
    })
  }



  // async/await 异步问题的终极方案
  async onExpand(expanded, record) {
    let id = record.id; 
    let data = cacheData.has(id) ? cacheData.get(id) : await this.getEventList(id);
    cacheData.set(id, data);
    let { topicList } = this.state;
    console.log('map cacheData', cacheData);

    this.setState({
      topicList: topicList.map((item, index)=>{
        if (item.id != id) {return item}
        else { return Object.assign({}, item, {subpage: data})}
      })
    })

  }

  ///////////////////////////////////////////////////////
  // 添加专题
  handleOk() {

  }
  // 取消
  handleCancel() {
    this.setState({
      visible: false
    })
  }
  render() {

    const columns = [{
      title: '专题名',
      dataIndex: 'name',
      key: 'name'
    },{
      title: '地域',
      key: 'region',
      dataIndex: 'region'
    },{
      title: '关键字',
      key: 'rules',
      dataIndex: 'rules'
    }];
    const { user, token } = this.props;
    return (
      <div className='clear-fix tableWrap'>
        <p className='section-header'>
          专题列表 
          <Button 
            type='primary'
            onClick={this.handleAddSpecial.bind(this)}
           className='table-right-btn'>添加专题</Button>
        </p>
        <Table
          rowKey="key"
          className="components-table-demo-nested table-style"
          columns={columns}
          onExpand={this.onExpand.bind(this)}
          expandedRowRender={this.expandedRowRender.bind(this)}
          dataSource={ this.state.topicList }/>

          <Modal
          visible={this.state.visible}
          title='添加专题'
          onOk={this.handleOk.bind(this) }
          onCancel={this.handleCancel.bind(this)}
          footer={null}>

          <IncreaseEvent
           token={token}
           user={user}
           onAdd={this.handleOk.bind(this)}
           onCancle={this.handleCancel.bind(this)}/>

          </Modal>
      </div>
    );
  }
}         // rowKey值 和 每行数据中的key值对应
          // onExpand={this.onExpand.bind(this)}

export default NestedTable;