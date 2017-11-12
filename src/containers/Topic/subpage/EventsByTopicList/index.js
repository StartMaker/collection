import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Button, Table, Modal, message, Icon } from 'antd';

import Collection from '../../../DataList/dailyList/subpage';
import TableWrap from '../../../../components/TableWrap';
import getTopicEvents from '../../../../fetch/topicEvents';
import collect from '../../../../fetch/collect';
import format from '../../../../containers/DataExhibition/subpage/format';
import * as fetchType from '../../../../constants/fetchType';

import './style.less';
class EventsByTopicList extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
          data: [],
          currentPage: 1,
          sumPage: 1,
          currentCowData: {},
          loading: true,
          visible: false,
          selectedRowKeys: [],
          urls: [],
        }
    this.columns = [{
          title: '主题',
          dataIndex: 'theme',
          width: '20%',
            render: (text, record, index) => {
                return (
                    <a target='_blank' href={record.url}>{record.theme}</a>
                )
            } 
        }, {
            title: '主要观点',  // 可修改
            dataIndex: 'mainView',
            key: 'id',
            width: '35%',
            className: 'column-font',
        }, {
            title: '类别',    // 可修改
            dataIndex: 'postType',
        }, {
            title: '发帖时间',
            // dataIndex: 'postTime',
            render: (text, record) => {
              // console.log('時間对象', record);
              return (
                <span>{ format(record.postTime, 'MM-dd hh:mm') }</span>
                )
            } 
        }, {
            title: '归集',
            dataIndex: 'operation',
            render: (text, record, index) => {
                if (!!!record.collectionStatus) {
                    return (       
                        <Icon type='edit' className='table-edit-icon' onClick={e => {this.handleClickAction(record)} } />
                    )
                }
            }
        }]
    }
    componentDidMount() {
      // 默认全选 硬编码
      // // test 展示所用
      // console.log('this.state.data', this.state.data);

    
    }
    // 显示弹框
    handleClickAction(currentCowData) {
      this.setState({
        currentCowData,
        visible: true,
      })
    }
    // 根据id获取数据
    getDataList(ids) {
        let { token } = this.props;
        let result = getTopicEvents({ids}, token);
        result.then(resp =>{
            if (resp.ok) {
                return resp.json()
            } else {
                console.log('专贴列表获取错误：400');
            }
        }).then(data=>{
            console.log('getDataList', data);
            this.setState({
              data,
              loading: false,
            });
        })
    }
    // 取消弹窗
    handleModalCancelAction() {
      this.setState({
        visible: false
      })
    }
    // 归集动作
    handleConnectionAction(info) {
        const { user, token } = this.props;
        const id = info.id;
        delete info.id;

        this.setState({
            loading: true
        })
        let result = collect({
            url: id,
            body: Object.assign({}, {recorder: user, table: 'special'}, info )
        }, token, fetchType.FETCH_TYPE_POST_URL2PARAMS );
        // 归集结果
        result.then(resp => {
            setTimeout(() => {
                this.setState({
                    loading: false
                })
            }, 300)
            return resp.text();
        }).then(text =>{
            if (text=== '归集成功') {
                let { ids } = this.props;
                message.success(text);
                getDataList(ids);
            } else {
                message.error(`归集失败！${text}`);
            }
        }).catch(ex =>{
                console.log('服务器内部错误', ex.message);
            if (__DEV__) {
            }
        })
    }
    otherPageAction() {

    }
    componentWillUpdate(preProps, preState) {
      if (preProps.ids.length!=this.props.ids.length) {
        let ids = preProps.ids;
        this.getDataList(ids);
      }
    }
    updataUrls(newUrls) {
      this.setState({
        urls: newUrls
      })
      this.props.modifyUrls(newUrls);
    }
    // 选中时
    onSelectChange(selectedRowKeys, selectedRows=[]) {
      // console.log('selectedRowKeys', selectedRowKeys);
      console.log('selectedRows', selectedRows);
      console.log('this.state.data', this.state.data);

      if (selectedRowKeys.length <= 5) {
        // let urls = selectedRows.map((item, indxe)=>item.url);
        // 勾选动作
        this.setState({selectedRowKeys});
        // 更新选中折线
        this.updataUrls(selectedRows);
      } else {
        message.error('至多选择五条');
      }
    }
    render(){
      const { selectedRowKeys } = this.state; 
      const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange.bind(this),
      };
      const { currentCowData, loading, visible } = this.state;
        return(
            <div>
                <TableWrap
                rowSelection={rowSelection}
                {...this.state}
                columns={this.columns}
                clickOtherPageAction={this.otherPageAction.bind(this)}/>
                <Modal 
                 footer={null}
                 width='935px'
                 visible={visible}
                 title='待归集事件'
                 onOk={this.handleModalCancelAction.bind(this) }
                 onCancel={this.handleModalCancelAction.bind(this)}
                 >
                 <Collection 
                    loading= {loading}
                    data={[currentCowData]}
                    handleCancel={this.handleModalCancelAction.bind(this)}
                    handleConnection={this.handleConnectionAction.bind(this)} />
                </Modal>
            </div>

        )
    }
}

export default EventsByTopicList;