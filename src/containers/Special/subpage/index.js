import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Table, Badge, Menu, Dropdown, Icon, Button, message, Modal  } from 'antd';

import getSpecialTopicList from '../../../fetch/SpecialList/topicList';
import getSpecialEventList from '../../../fetch/SpecialList/eventList';
import * as fetchType from '../../../constants/fetchType';

import format from '../../DataExhibition/subpage/format';

import collect from '../../../fetch/collect';

import Collection from '../../DataList/dailyList/subpage';
import IncreaseEvent from './IncreaseEventWrap'
import './style.less';



var cacheData = new Map();
class NestedTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      topicList: [],
      addEventModalVisible: false,   // 添加专题弹窗
      collectModalVisible: false,    // 归集弹窗
      loading: false,                // 父表格加载状态
      nestedLoading: false,          // 子表格加载状态
      currentCowData: []             // 当前操作行
    }
  }
  // 折叠内容
  expandedRowRender(record) {

    // console.log('expandedRowRender: ', record);
    const columns = [{
      title: '主题',
      dataIndex: 'theme',
      key: 'theme',
      width: '19%',
      render: (text, record)=>{
        return (
          <a href={record.url}>{text}</a>
        )
      }
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
    },{
      title: '归集',
      key: 'operation',
      render: (text, record, index) => {
          if (!!!record.collectionStatus) {
              return (    
                  <Icon type='edit' className='table-edit-icon' onClick={e => {this.handleClickCollectionAction(record)} } />
              )
          }
      }
    }];
    return (
      <Table
        loading={this.state.nestedLoading}
        rowKey='id'
        columns={columns}
        onChange={this.handlePageChange.bind(this, record.id)}
        dataSource={!!record.subpage.eventPageList ? record.subpage.eventPageList : []}
        pagination={{total: record.subpage.pages*5, defaultPageSize: 5, size: "small"}}/>
    );
  };

  // 添加专题
  handleAddSpecial() {
    // message.error('正在开发中');
    this.setState({
      addEventModalVisible: true
    })
  }
  componentDidMount() {

  }
  // 测试换页
  async handlePageChange(...arg) {
    const [ id, pagination ] = [...arg];

    let data = await this.getEventList(id, pagination.current);
    let preCacheData = cacheData.get(id);
    data.eventPageList = preCacheData.eventPageList.concat(data.eventPageList);
    let { topicList } = this.state;

    this.setState({
      topicList: this.concatTopicList(topicList, data, id),
    })
    this.state.
    console.log('pagination', data);
  }
  // 点击归集按钮时
  handleClickCollectionAction(currentCowData) {
    this.setState({
      currentCowData,
      collectModalVisible: true,
    })
  }
  componentWillMount() {
    this.getTopicList();
  }
  // 对象链接
  concatTopicList(preArr, newSingleObj, id) {
    return preArr.map((item, index)=>{
      if (item.id!=id) {return item}
      else {
        return Object.assign({}, item, {
         subpage: {
           eventPageList: newSingleObj.eventPageList.concat(item.subpage.eventPageList),
           pages: item.subpage.pages
         }})
      }
    })
  }
  // 获取事件列表
  getEventList(id, page=1) {
    let { token } = this.props;
    // let data = [];
    this.setState({
      nestedLoading: true
    })

    let result = getSpecialEventList({
      url: page,  // 请求的页码
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
    this.setState({
      loading: true
    })

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
                eventPageList: [],
                pages: 0
              }
            })
        })
      },()=>{
        this.setState({
          loading: false
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
    if (!!data) {
      this.setState({
        nestedLoading: false
      })
    }
    cacheData.set(id, data);
    let { topicList } = this.state;
    // console.log('map cacheData', cacheData);
    data.eventPageList = data.eventPageList.map((item, index)=>{
      return Object.assign({}, item, { postTime: format(item.postTime, 'MM-dd hh:mm')})
    }) 
    console.log('data', data);
    this.setState({
      topicList: this.concatTopicList(topicList, data, id)
    })
  }
  // topicList.map((item, index)=>{
  //       if (item.id != id) {return item}
  //       else { return Object.assign({}, item, {subpage: data } )}
  //     })
  ///////////////////////////////////////////////////////
  // 添加专题
  handleOk() {

  }
  // 归集
  handleConnectAction(obj) {
    console.log('归集对象: ', obj);
    let { user, token } = this.props;
    let result = collect({
      url:obj.id,
      body: {
        recorder: user,
        mainView: obj.mainView,
        postType: obj.postType
      }
    }, token, fetchType.FETCH_TYPE_POST_URL2PARAMS);

    result.then(resp=>{
      if (resp.ok){
        return resp.text()
      }
    }).then(text => {
      message.success(text);
      this.onExpand();
    })
  }
  // 隐藏弹窗
  handleModalCancelAction() {
    this.setState({
      addEventModalVisible: false,
      collectModalVisible: false
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
          loading={this.state.loading}
          columns={columns}
          onExpand={this.onExpand.bind(this)}
          expandedRowRender={this.expandedRowRender.bind(this)}
          dataSource={ this.state.topicList }/>

        {/* 添加专题弹窗 */}
          <Modal
          visible={this.state.addEventModalVisible}
          title='添加专题'
          onOk={this.handleOk.bind(this) }
          onCancel={this.handleModalCancelAction.bind(this)}
          footer={null}>

            <IncreaseEvent
             token={token}
             user={user}
             onAdd={this.handleOk.bind(this)}
             onCancle={this.handleModalCancelAction.bind(this)}/>

          </Modal>
        {/* 归集弹窗 */}
          <Modal 
           footer={null}
           width='935px'
           visible={this.state.collectModalVisible}
           title='待归集事件'
           onOk={this.handleConnectAction.bind(this) }
           onCancel={this.handleModalCancelAction.bind(this)}
           >
                 { /* 归集 */} 
             <Collection 
                loading = {this.state.loading}
                data={[this.state.currentCowData]}
                handleCancel={this.handleModalCancelAction.bind(this)}
                handleConnection={this.handleConnectAction.bind(this)} />
           </Modal>
      </div>
    );
  }
}         // rowKey值 和 每行数据中的key值对应
          // onExpand={this.onExpand.bind(this)}

export default NestedTable;