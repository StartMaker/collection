import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { message, Popconfirm, Icon, Modal, Button, Radio } from 'antd';

import TableWrap from '../../../components/TableWrap';

import getHandleDataList from '../../../fetch/DataList/handleDataList';
// import getHandleDataSumPage from '../../../fetch/sumPage/handlePage';
import Handle from '../../../fetch/handle';

import deleteEvent from '../../../fetch/deleteEvent';

import * as fetchType from '../../../constants/fetchType';


import Handled from './subpage';
import format from '../../DataExhibition/subpage/format'

import './style.less';

const RadioGroup = Radio.Group;


// ensure there is no unnecessary rendering for some this.state that is not for components immediatly

var cacheData = [];  // 缓存已请求的数据
var deleteIds = [];  // 保存要删除行的id
var urlBody = {       // 筛选请求参数
    isHandled: 2,
    isFeedBack: 2,
    isAll: true,
};

class HandleDataList extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            visible: false,  // 弹窗显示
            currentPage: 1,
            data: [],  
            sumPage: 0,
            more: 0,
            currentCowData: {},  // 选中的行info
            loading: false,    
            selectedRowKeys: [], // 删除选择行的keys
            isHandled: {   // 筛选处置情况
                value: 2
            },
            isFeedBack: {  // 筛选反馈情况 
                value: 2
            }
        };
    }
    componentDidMount() {
        this.getDataListByPage(1);
        // this.getDailyDataSumPageAction();
    }
    componentWillMount() {
        if(!!!this.state.data) {
            this.setState({
                loading: true
            })
        }
        // 从缓存中读取用户筛选信息
        if (!!cacheData.length) {
            console.log('从缓存中读取用户筛选信息', cacheData);
            this.setState({
                isHandled: {
                    value: cacheData.filterCondition.isHandled.value || 2
                },
                isFeedBack: {
                    value: cacheData.filterCondition.isFeedBack.value || 2
                }
            })
        }
    }
    // 处理筛选
    handleFilter({ key, value }) {
        let isAll = value == 2 ? true : false;
        if (isAll) {
            this.setState({
                isHandled: {value: 2},
                isFeedBack: {value: 2}
            })
        }
        cacheData = [];
        // this,setState 没有办法保证是同步的操作
        // 解决办法:
        // 1.取消不是直接关联组件的状态数据
        // 2.使用this.setState的回调函数
        this.setState({
            [key]: {
                value: value
            }
        });
        urlBody = Object.assign({}, urlBody, {
            [key]: value,
            isAll
        })
        this.getDataListByPage(1);
    }
    // 记录反馈情况的变化
    handleFeedBackChange(e) {  
        this.handleFilter({key: 'isFeedBack', value: e.target.value});
    }
    // 记录处置情况的变化
    handleHandledConditionChange(e) {
        this.handleFilter({key: 'isHandled', value: e.target.value});
    }

    // 改变删除选择框
    handleSelectChange(selectedRowKeys) {
        deleteIds = [];
        selectedRowKeys.forEach((item, index) => {
            deleteIds.push(this.state.data[item].id);
        })
        this.setState({selectedRowKeys});
    }
    // 判断缓存中是否有当前请求数据 返回缓存位置，否则返回-1
    checkCache(page) {
        let index = -1;
        cacheData.forEach((item, itemIndex) => {
            if (item.page === page) {
                index = itemIndex;
                console.log('cache数组位置：', index);
            }
        })
        return index;
    }
    // 将fetch到的数据加入缓存 相同页数覆盖
    pushCache(page, json, sumPage=0) {
        let isIn = false;
        let { isHandled, isFeedBack } = this.state;
        // 覆盖相同页码的数据
        cacheData=cacheData.map((item, index) => {
            if (item.page != page){
                return item
            } else {
                isIn = true;
                console.log('更新缓存');
                return {
                    page: item.page, 
                    json
                }
            }
        })
        if (!!sumPage) {
            cacheData.sumPage = sumPage;
        }
        // 推入缓存
        if (!isIn) {
            cacheData.push({
                page,
                json,
            })
            // 保存当前筛选条件
            cacheData.filterCondition = {
                isHandled,
                isFeedBack
            }
        }
        console.log('cacheData', cacheData);
    }
    // 获取指定页数的数据
    getDataListByPage(page, refresh=false) {
        //  从缓存中读取数据
        let cacheIndex = this.checkCache(page);
        if (cacheIndex >= 0 && !refresh) {
            this.setState({
                sumPage: cacheData.sumPage,
                currentPage: page,
                data: cacheData[cacheIndex].json
            })
            console.log('cache', cacheData);
            return;
        }            
        // 加载中
        this.setState({ 
            loading: true,
            selectedRowKeys: [] // 清空选择
        })
        // fetch
        let { more } = this.state;
        let { token } = this.props;
        let result = getHandleDataList({
            url: page,
            body: Object.assign({}, urlBody, { more: more}),
        }, token, fetchType.FETCH_TYPE_GET_URL2PARAMS);
        // 处理返回的promise对象
        result.then(resp => {
            if (resp.ok) {
                return resp.json()
            }
        }).then(json => {
            let data = json.eventPageList;
            // 格式化时间
            data.map((item, index) => {
                item.collectedTime = format(item.collectedTime, 'yyyy-MM-dd hh:mm');
                item.handledTime = format(item.handledTime, 'yyyy-MM-dd hh:mm');
            })
             // 推入缓存
            this.pushCache(page, data, json.pages); 
            // 结束加载 保存数据
            this.setState({
                currentPage: page,
                data: data, 
                sumPage: json.pages,
                loading: false 
            })
        }).catch(ex => {
            console.log('获取列表数据出错', ex.message);
            if (__DEV__) {
            }
        })
    }
    // 换页
    otherPageAction(page){
        this.getDataListByPage(page);
    }
    // 处置动作
    handleHandleAction(obj) {
        const { handledCondition, feedbackCondition, id, detail } = obj;
        console.log(obj);
        let { token, user } = this.props;
        let result = Handle({
            body: {
                eventHandler: user,
                feedbackCondition,
                handledCondition: handledCondition.join('/'),
                id,
                detail
            },
            url: id
        }, token, fetchType.FETCH_TYPE_POST_URL2BODY);
        // 处理返回的promise
        result.then(resp => {
            if (resp.ok) {
                return resp.text()
            } else {
                message.error('处置过程中发生错误, 请稍后再试');
            }
        }).then(text => {
            message.success(text);
            this.getDataListByPage(this.state.currentPage, 0, true);
        }).catch(ex => {
            console.log(ex.message);
        })
        // this.setState({
        //     visible: false
        // })
    }
    handleModalCancelAction() {
        console.log('cancel');
        this.setState({
            visible: false
        })
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextState.currentCowData !== this.state.currentCowData) {
            this.setState({
                loading: false
            })        
        }
    }
    // handleSelectChangeSelect(record, selected, selectedRows) {

    //     console.log('record, selected, selectedRows', record, selected, selectedRows)
    // }

    // 删除动作
    handleDeleteAction() {
        let { token } = this.props;
        let result = deleteEvent(deleteIds, token)
        result.then(resp =>{
            if(resp.ok) {
                return resp.text()
            } else {
                message.error('删除过程中发生错误');
            }
        }).then(text => {
            this.getDataListByPage(this.state.currentPage, 0, true);
            message.success(text);
        }).catch(ex => {
            console.log(ex.message);
        })
        console.log('delete object', deleteIds);
    }
    handleDoubleClickRowAction(info) {
        // console.log('double click in ', info);
        this.setState({
            visible: true,
            currentCowData: info
        })
    }
    onShowSizeChange(current, size) {
        this.setState({
            more: (size - 5),
        }, () => {
            cacheData = [];
            this.getDataListByPage(this.state.currentPage);
        })
    }
    render(){
        // 选择框
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.handleSelectChange.bind(this),
        }
        // 表头
        const radioStyle = {
            display: 'block', 
            height: '30px', 
            lineHeight: '30px'
        }
        const columns = [{
            title: '主题',
            dataIndex: 'theme',
            width: '20%',
            render: (text, record, index) => {
                return (
                    <a target='_blank' href={record.url}>{record.theme}</a>
                )
            }
        },{
            title: '主要观点',  // 可修改
            dataIndex: 'mainView',
            key: 'id',
            width: '30%',
            className: 'column-font',
        },{
            title: '类别',    // 可修改
            dataIndex: 'postType',
        },{
            title: '处置情况',
            dataIndex: 'handledCondition',
            filterDropdown: (
                <div id='handled-filter-wrap'>
                <RadioGroup onChange={this.handleHandledConditionChange.bind(this)} value={this.state.isHandled.value}>
                    <Radio disabled={this.state.isFeedBack.value==1? true :false} style={radioStyle} value={0}>未处置</Radio>
                    <Radio style={radioStyle} value={1}>已处置</Radio>
                    <Radio style={radioStyle} value={2}>全选</Radio>
                  </RadioGroup>
                </div>
            ),
            filterIcon: <Icon type="filter" />,
        },{
            title: '反馈情况',
            dataIndex: 'feedbackCondition',
            filterDropdown: (
                <div id='handled-filter-wrap'>
                <RadioGroup onChange={this.handleFeedBackChange.bind(this)} value={this.state.isFeedBack.value}>
                    <Radio style={radioStyle} value={0}>未反馈</Radio>
                    <Radio disabled={this.state.isHandled.value==0? true :false} style={radioStyle} value={1}>已反馈</Radio>
                  </RadioGroup>
                </div>
            ),
            filterIcon: <Icon type="filter" />,
        },{
            title: '归集人',
            dataIndex: 'recorder',
        },{
            title: '归集时间',
            dataIndex: 'collectedTime',
        },{
            title: '处置人',
            dataIndex: 'eventHandler',
        },{
            title: '处置时间',
            dataIndex: 'handledTime',
        },{
            title: '具体处置',
            dataIndex: 'detail',
        }];
        let { more, sumPage } = this.state;
        const currentSize = 5 + more;
        return(
            <div className='container-flex tableWrap'>
                <p className='section-header'>
                    全部舆情事件
                    <Button type='primary' 
                    className='table-right-btn'
                    disabled={!!this.state.selectedRowKeys.length ? false : true }
                    onClick={this.handleDeleteAction.bind(this)}>删除</Button>
                </p>

                <TableWrap
                handleDoubleClickRow={ this.handleDoubleClickRowAction.bind(this) }
                {...this.state}
                onShowSizeChange={this.onShowSizeChange.bind(this)}
                pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '15', '20'],
                    total: sumPage * currentSize,
                    pageSize: currentSize,
                }}
                rowSelection={rowSelection}
                columns={columns}
                clickOtherPageAction={this.otherPageAction.bind(this)}/>

                <Modal 
                 footer={null}
                 width='935px'
                 visible={this.state.visible}
                 title='待处置事件'
                 onOk={this.handleHandleAction.bind(this) }
                 onCancel={this.handleModalCancelAction.bind(this)}
                    >
                     { /* 处置 */} 
                 <Handled 
                    loading= {this.state.loading}
                    data={[this.state.currentCowData]}
                    handleCancel={this.handleModalCancelAction.bind(this)}
                    handleHandle={this.handleHandleAction.bind(this)}
                    />
                     
                 </Modal>
            </div>

        )
    }
}
// handleConnection={this.handleConnectionAction.bind(this)} 
export default HandleDataList;