import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Card, Modal, message } from 'antd';

import TopicItemWrap from '../../../../components/TopicItemWrap'
import getTopicList from '../../../../fetch/topicList'
import addTopic from '../../../../fetch/addTopic'
import deleteTopic from '../../../../fetch/deleteTopic'
import modifyTopic from '../../../../fetch/modifyTopic'
import IncreaseTopic from '../IncreaseTopic';

import './style.less';


class TopicList extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
          data: [],
          ids: [],
          visible: false,
        }
    }
    componentWillMount() {
      this.getTopicListAction();
    }
    componentDidMount() {
      
    }
    // 获取专贴列表
    getTopicListAction(cacheID) {
      let { token } = this.props;
      let result = getTopicList('', token);
      // let ids = [];
      result.then(resp=>{
        if(resp.ok){
          return resp.json();
        }
      }).then(data=>{
        this.setState({data});
        console.log('datadatadata', data);
        if (!cacheID) {
          updateIds(data.map((item, index)=>item.id))
        } else {
          // 刷新逻辑
          //  ??? 
          cacheID.concat(data[data.length].id);
          updateIds(cacheID.concat(data[data.length].id));
        }
      })
    }
    // 删除专贴
    handleDelete(id) {
      console.log('删除对象的id：', id);
      let { token } = this.props;
      let result = deleteTopic({ids: [].concat(id)}, token);
      result.then(resp =>{
        if (resp.ok) {
          return resp.text()
        } else {
          message.error('delete topic ocurred an error');
        }
      }).then(text =>{
        message.success(text);
        this.getTopicListAction();
      }).catch(ex =>{
        console.log('删除对象时发生了一个错误', ex.message);
      })

    }
    // 根据用户选择更新ids
    handleChose(targetIds, checked) {
      // console.log(x);
       let { ids } = this.state;
       let newIds = checked ? ids.concat(targetIds) : ids.filter((item, index)=>item!==targetIds ? true : false);

        updateIds(newIds);
      // this.props.onChoseTopic(checked, id);
    }
    // 更新ids
    updateIds(newIDs) {
      this.setState({
          ids: newIds
      });
      // 向上传递ids
      this.props.modifyIds(newIds);
    }
    handleAddTopicModal() {
      this.setState({
        visible: true
      })
      // console.log('???')
    }
    handleOk() {
      this.setState({
        visible: false
      })
    }
    handleModalCancelAction() {
      this.setState({
        visible: false
      })
    }
     // 修改专贴事件
    handleCheckValue(modifyTopicObj) {
      console.log('modifyTopicObj', modifyTopicObj);
      let { token } = this.props;
      // console.log('')
      // this.handleAddTopicRequestAction(modifyTopicObj, true);
      let result = modifyTopic(modifyTopicObj, token);
      result.then(resp=>{
        if (resp.ok) {
          return resp.text()
        } 
      }).then(text=>{
        message.success(text);
      }).catch(ex =>{
        console.log('add topic ocurred an error ', ex.message)
      })
    }
    // 添加专贴
    handleAddTopicRequestAction(value) {
      let { topicName } = value;
      let { token } = this.props;

      let urls = [];
      // delete value.topicName;
      for(let [ keys, value ] of Object.entries(value)){
        console.log('keys', keys);
        if (keys.indexOf('url')==0) {
          urls.push(`http://tieba.baidu.com/p/${value}`);
        }
      }

      console.log('handleAddTopicRequestAction', urls);

      let result = addTopic({
        name: topicName,
        url: urls
      }, token);
      result.then(resp =>{
        if (resp.ok) {
          return resp.text()
        }
      }).then(text =>{
        if (text=='添加成功') {
          message.success(text);
          this.getTopicListAction();
        } else {
          message.error('添加失败');
        }
      }).catch(ex =>{
        console.log('add topic ocurred an error ', ex.message)
      })
    }
    render(){
      const { data } = this.state;
      const { token } = this.props;
        return(
            <div id='TopicList-wrap'>
              <TopicItemWrap 
                handleAddTopicAction = {this.handleAddTopicModal.bind(this)}
                handleDeleteAction = {this.handleDelete.bind(this)} 
                handleChoseAction = {this.handleChose.bind(this)}
                onCheckValueAction = {this.handleCheckValue.bind(this)}
                data={data} />

              <Modal
                visible={this.state.visible}
                title='添加专贴'
                onOk={this.handleOk.bind(this) }
                onCancel={this.handleModalCancelAction.bind(this)}
                footer={null}>

                  <IncreaseTopic
                   token={token}
                   onAdd={this.handleAddTopicRequestAction.bind(this)}
                   onOk={this.handleOk.bind(this)}

                   onCancle={this.handleModalCancelAction.bind(this)}/>

              </Modal>


            </div>

        )
    }
}
                   // afterAdd={this.updataTopicList.bind(this)}

export default TopicList;