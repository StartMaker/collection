import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Table, Badge, Menu, Dropdown, Icon, Button, message  } from 'antd';

import getSpecialTopicList from '../../../fetch/SpecialList/topicList';
import getSpecialEventList from '../../../fetch/SpecialList/eventList';
import * as fetchType from '../../../constants/fetchType';


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
var initData = '';
class NestedTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      topicList: ''
    }
  }
  // 折叠内容
  expandedRowRender() {
    const columns = [
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Status', key: 'state', render: () => <span><Badge status="success" />Finished</span> },
      { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <span className={'table-operation'}>
            <a href="#">Pause</a>
            <a href="#">Stop</a>
            <Dropdown overlay={menu}>
              <a href="#">
                More <Icon type="down" />
              </a>
            </Dropdown>
          </span>
        ),
      },
    ];

    const data = [];
    for (let i = 0; i < 4; ++i) {
      data.push({
        key: i,
        date: '2014-12-24 23:12:00',
        name: 'This is production name',
        upgradeNum: 'Upgraded: 56',
      });
    }
    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}/>
    );
  };
  // 添加专题
  handleAddSpecial() {
    message.error('正在开发中');
  }
  componentWillMount() {
    this.getTopicList();
  }
  getEventList(id) {
    let { token } = this.props;
    let result = getSpecialEventList({
      url: 1,
      body: {
        more: 0,
        ids: [id]
      }
    }, token, fetchType.FETCH_TYPE_GET_URL2PARAMS);
    // 处理promise
    result.then(resp =>{
      if (resp.ok){
        return resp.json()
      }
    }).then(json =>{
      initData = json;
    }).catch(ex =>{
      console.log('专题事件获取出错', ex.message);
    })
  }
  // 获取专题列表
  getTopicList() {
    let { token } = this.props;
    let _self = this;
    let result = getSpecialTopicList(token);
    result.then(resp =>{
      if (resp.ok) {
        return resp.json()
      }
    }).then(topicList => {
      topicList = topicList.map((item, index)=>{
        _self.getEventList(item.id);
        return Object.assign({},
          item, 
          { 
            key: item.id,
            rules: item.rules.join(','), 
            region: item.region.join(','),
            subpage: initData
          })
      });
      console.log('topicList', topicList);

      this.setState({topicList})
    }).catch(ex =>{
      console.log('专题列表获取错误', ex.message);
    })
  }
  // 测试拓展行
  expandedRowRenderTest(record) {
    console.log('record: ', record);
    return (
      <p>{record.key}</p>
      )
  }
  onExpand(expanded, record) {
    console.log(expanded, record);
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
  // const columns = [
  //     { title: 'Name', dataIndex: 'name', key: 'name' },
  //     { title: 'Platform', dataIndex: 'id', key: 'platform' },
  //     { title: 'Version', dataIndex: 'version', key: 'version' },
  //     { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  //     { title: 'Creator', dataIndex: 'creator', key: 'creator' },
  //     { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
  //     { title: 'Action', key: 'operation', render: () => <a href="#">Publish</a> },
  //   ];
  //   const data = [];
  //   for (let i = 0; i < 3; ++i) {
  //     data.push({
  //       key: i,
  //       name: 'Screem',
  //       platform: 'iOS',
  //       version: '10.3.4.5654',
  //       upgradeNum: 500,
  //       creator: 'Jack',
  //       createdAt: '2014-12-24 23:12:00',
  //     });
  //   }
    // const data = [];
    // data.push({
    //   extend: "这是第1",
    //   id: 102,
    //   name: "橙色高温预警",
    //   region: "西南石油大学,正因村,成都,新都",
    //   rules: "太热,西瓜,高温,避暑,冲凉,中暑",
    // })
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
          expandedRowRender={this.expandedRowRenderTest.bind(this)}
          dataSource={ this.state.topicList }/>
      </div>
    );
  }
}         // rowKey值 和 每行数据中的key值对应
          // onExpand={this.onExpand.bind(this)}

export default NestedTable;