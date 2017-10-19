import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Table, Badge, Menu, Dropdown, Icon, Button, message, Modal  } from 'antd';

import getSpecialTopicList from '../../../fetch/SpecialList/topicList';
import getSpecialEventList from '../../../fetch/SpecialList/eventList';
import deleteSpecial from '../../../fetch/deleteSpecial';

import * as fetchType from '../../../constants/fetchType';

import format from '../../DataExhibition/subpage/format';

import collect from '../../../fetch/collect';

import Collection from '../../DataList/dailyList/subpage';
import IncreaseEvent from './IncreaseEventWrap'
import './style.less';

/*
cacheData 结构;
缓存子表格数据;
 id->
 [{
  page: ...,
  value: ...
  }, ... ]

 */

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
      currentCowData: [],            // 当前操作行
      selectedRowKeys: [],           // 当前选中行
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
          <a href={record.url} target='_blank'>{text}</a>
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
    // test 展示用代码

  }
  // 测试换页
  async handlePageChange(...arg) {

    const [ id, pagination ] = [...arg];

    // 拿到前几页的数据 / [obj, ...]
    let preCacheData = cacheData.get(id);
    let { topicList } = this.state;

    // 确认数据源 缓存或者fetch
    // console.log('page', pagination);
    let cacheItem = preCacheData.filter((item, index)=>{
      if(item.page===pagination.current){
        return item
      }
    });

    if ( !!cacheItem.length ) {
      console.log('从cache中读取数据');
      this.setState({
        topicList: this.concatTopicList(topicList, cacheItem[0].value, id),
      })
      return;
    }
      console.log('从fetch中读取数据');

    // 获取分页数据
    /*
      data:
     {
      eventPageList: ...,
      pages: ...
      }
     */
    let data = await this.getEventList(id, pagination.current);
    data.eventPageList = data.eventPageList.map((item, index)=>
      Object.assign({}, item, {
        parentTableId: id,  // 数据的双向绑定
      })
    )
    // 更新缓存
    preCacheData.push({page: pagination.current, value: data});
    cacheData.set(id, preCacheData);

    // 取消加载动画
    if (!!data) {
      this.setState({
        nestedLoading: false
      })
    }

    // 拼接数据并更新状态数据
    let concatedData = this.concatTopicList(topicList, data, id);
    this.setState({
      topicList: concatedData,
    })
    // console.log('data after connect', concatedData);
  }

  // 点击归集按钮时
  handleClickCollectionAction(currentCowData) {
    let { topicList } = this.state;
    // 更新状态
    this.setState({
      currentCowData,
      collectModalVisible: true,
    })
  }

  componentWillMount() {
    this.getTopicList();
  }
  // 对象更新
  concatTopicList(preArr, newSingleObj, id) {
    return preArr.map((item, index)=>{
      if (item.id!=id) {return item}
      else {
        return Object.assign({}, item, {
         subpage: {
           pages: newSingleObj.pages,
           eventPageList: newSingleObj.eventPageList,  // 替换
         }})
      }
    })
  }
           // eventPageList: item.subpage.eventPageList.concat(newSingleObj.eventPageList),

  // 获取事件列表 返回fetch成功后的promise对象
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
                pages: 0,
                currentPage: 1,
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
    // 收起时
    // console.log('触发展开按钮');
    if (!expanded) {return}

    let id = record.id; 
    let { topicList } = this.state;

    // 第一次打开时从fetch中载入数据 否则从缓存中拿数据
    let data = cacheData.has(id) ? cacheData.get(id)[0].value : await this.getEventList(id);

    // 取消加载
    this.setState({
      nestedLoading: false
    })
    if (!data) {
      message.error('没有相关数据');
      return;
    }
    // data.parentTableId = record.id;
    // 推入缓存
    cacheData.set(id, [{page: 1, value: data}]);

    // 转换时间戳
    console.log('data', data);
    data.eventPageList = data.eventPageList.map((item, index)=>{
      return Object.assign({}, item, { 
        postTime: format(item.postTime, 'MM-dd hh:mm'), 
        parentTableId: record.id,  // 数据的双向绑定
      })
    })
    // 更新数据
    this.setState({
      topicList: this.concatTopicList(topicList, data, id)
    })
  }

  // 添加专题
  handleOk() {

  }
  // 
  updataTopicList() {
    this.getTopicList();
  }
  // 归集
  handleConnectAction(obj) {
    console.log('归集对象: ', obj);
    let { user, token } = this.props;
    let { bindId, mainView, postType } = obj;

    // console.log('cacheData.get(bindId)', cacheData.get(bindId));
    // return;
    let result = collect({
      url:obj.id,
      body: {
        table: 'special',
        recorder: user,
        mainView,
        postType,
      }
    }, token, fetchType.FETCH_TYPE_POST_URL2PARAMS);


    result.then(resp=>{
      if (resp.ok){
        return resp.text()
      }
    }).then(text => {
      // this.getTopicList();
      let collectId = obj.id;
      let { topicList } = this.state;
      let updataCowData = topicList.map((ListItem, index)=>{
        return Object.assign({}, ListItem, 
          { 
            subpage: {
              eventPageList: ListItem.subpage.eventPageList.map((item, index)=>{
                if (item.id!==collectId) { return item }
                else { return Object.assign({}, item, {collectionStatus: 1})}
              }),
              pages: ListItem.subpage.pages
            }
          })
      })

      // 更新缓存
      cacheData.set(bindId, []);

      // 更新状态
      this.setState({
        topicList: updataCowData,
      })
      message.success(text);
    })
  }
  // 隐藏弹窗
  handleModalCancelAction() {
    this.setState({
      addEventModalVisible: false,
      collectModalVisible: false
    })
  }
  // 记录选择
  onSelectChange(selectedRowKeys) {
    this.setState({
      selectedRowKeys
    })
    console.log('selectedRowKeys', selectedRowKeys);
  }
  // 删除专题
  handleDelSpecial() {
    let { selectedRowKeys } = this.state;
    let { token } = this.props;
    console.log('要刪除的专题ID', selectedRowKeys);

    let result = deleteSpecial(selectedRowKeys, token);
    result.then(resp =>{
      if (resp.ok) {
        return resp.text()
      } else {
        message.error('删除专题过程发生错误');
      }
    }).then(text =>{
      message.success(text);
      this.getTopicList();
    }).catch(ex =>{
      console.log('删除专题过程发生错误', ex.message);
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
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };
    return (
      <div className='clear-fix tableWrap' id='DataListContainer'>
        <p className='section-header'>
          专题列表
          <Button 
            type='primary'
            disabled={!selectedRowKeys.length}
            onClick={this.handleDelSpecial.bind(this)}
           className='table-right-btn'>删除</Button>
          <Button 
            type='primary'
            onClick={this.handleAddSpecial.bind(this)}
           className='table-right-btn'>添加专题</Button>
        </p>
        <Table
          rowSelection={rowSelection}
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
             afterAdd={this.updataTopicList.bind(this)}
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
                table='special'
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