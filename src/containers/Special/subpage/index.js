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
var initData = [];
class NestedTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      combineList: '',
      visible: false,
    }
  }
  // 折叠内容
  expandedRowRender(record) {
    console.log('expandedRowRender: ', record);
    const columns = [{
      title: '主题',
      dataIndex: 'theme',
      key: 'theme'
    },{
      title: '主要观点',
      dataIndex: 'mainView',
      key: 'mainView'
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
        rowKey='key'
        columns={columns}
        dataSource={!!record.subpage.eventPageList?record.subpage.eventPageList:[]}
        pagination={false}/>
    );
  };
  // 
  findId(arr, id) {
    let value = null;
    console.log('arr', arr);
    arr.forEach((item, index)=>{
      if (item.key===id) {
        value=item.value;
        console.log('item', item);
      }
    })
    return value;
  }
  // 添加专题
  handleAddSpecial() {
    // message.error('正在开发中');
    this.setState({
      visible: true
    })
  }
  componentDidMount() {
    // this.getTopicList();
    this.promiseOrderRun();
    // let it = this.dataRunOrder();
    // console.log(it.next());
  }
  componentWillMount() {
    // this.getTopicList();
    this.promiseOrderRun();
    // let it = this.dataRunOrder();
    // console.log(it.next());
  }
  // 获取事件列表
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
    // return result;
    result.then(resp => {   // 异步
      if (resp.ok){
        return resp.json()
      }
    }).then(json => {
      initData.push({
        key: id,
        value: json,
      });
    }).catch(ex => {
      console.log('专题事件获取出错', ex.message);
    })
  }
  // 处理返回的对象
  handleBingo(topicList) {
    // console.log('topicList before', topicList);
     topicList.forEach((item, index)=>{
          this.getEventList(item.id); // 异步
      });

     this.setState({
        combineList: topicList.map((item, index)=>{
            // console.log('item', item);
            // console.log(' findId(eventList, item.id)', this.findId(eventList, item.id));
            return Object.assign({}, item, {
              subpage: this.findId(initData, item.id)
            })
          })/**/
     })
      // this.setState({
      //   eventList: initData,
      //   topicList
      // }, () =>{
      //   // console.log('this.state.topicList', this.state.topicList);
      //   // console.log('this.state.eventList', eventList);
        
      //   this.setState({
          // combineList: topicList.map((item, index)=>{
          //   // console.log('item', item);
          //   // console.log(' findId(eventList, item.id)', this.findId(eventList, item.id));
          //   return Object.assign({}, item, {
          //     subpage: this.findId(eventList, item.id)
          //   })
      //     })/**/
      //   })/**/
      // })
  }
  // 获取专题列表
  getTopicList() {
    let { token } = this.props;
    let result = getSpecialTopicList(token);
    return result;
    // result.then(resp =>{
    //   if (resp.ok) {
    //     return resp.json()
    //   }
    // }).then(topicList => {  // 异步
    //   // 将每个元素中的数组转为字符
        // this.handleBingo(Array.prototype.map.call(topicList, (item, index)=> {
        //   return Object.assign({},
        //     item, {
        //       key: item.id,
        //       rules: item.rules.join(','),
        //       region: item.region.join(','),
        //     })
        // }))

    // }).catch(ex =>{
    //   console.log('专题列表获取错误', ex.message);
    // })
  }

  promiseOrderRun() {
    var combine = new Promise((resolve, reject)=>{
      this.getTopicList().then(resp=>{
        if (resp.ok) {
          return resp.json()
        }
      }).then(topicList=>{
        let ids = [];
        resolve(Array.prototype.map.call(topicList, (item, index)=> {
          this.getEventList(item.id);
          return Object.assign({},
            item, {
              key: item.id,
              rules: item.rules.join(','),
              region: item.region.join(','),
            })
        }), ids)
      })
    })

    combine.then((obj)=> {
      console.log('obj', obj, 'eventList', initData);
      let sample = obj.map((item, index)=>{
        // console.log('item', item);
        // console.log(' findId(eventList, item.id)', this.findId(eventList, item.id));
        return Object.assign({}, item, {
          subpage: !!this.findId(initData, item.id) ? this.findId(initData, item.id):['fxy']
        })
      });
      console.log('combineList local', sample);
      this.setState({combineList: sample}
        ,()=>{
        console.log('combineList', this.state.combineList);
      })

    })

  }
  // 测试拓展行
  expandedRowRenderTest(record) {
    console.log('expandedRowRenderTest: ', record);
    return (
      <p>{record.key}</p>
      )
  }
  onExpand(expanded, record) {
    console.log(expanded, record);
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
          dataSource={ this.state.combineList }/>
          <Modal
          visible={this.state.visible}
          title='添加专题'
          onOk={this.handleOk.bind(this) }
          onCancel={this.handleCancel.bind(this)}
          footer={null}>

          <IncreaseEvent onAdd={this.handleOk.bind(this)}
           onCancle={this.handleCancel.bind(this)}/>

          </Modal>
      </div>
    );
  }
}         // rowKey值 和 每行数据中的key值对应
          // onExpand={this.onExpand.bind(this)}

export default NestedTable;