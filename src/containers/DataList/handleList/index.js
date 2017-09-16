import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { message, Popconfirm, Icon, Modal, Button, Radio } from 'antd';

import TableWrap from '../../../components/TableWrap';

import getHandleDataList from '../../../fetch/DataList/handleDataList';
// import getHandleDataSumPage from '../../../fetch/sumPage/handlePage';
// import collect from '../../../fetch/collect';

import * as fetchType from '../../../constants/fetchType';


// import Collection from './subpage';
import format from '../../DataExhibition/subpage/format'

import './style.less';

const RadioGroup = Radio.Group;

var cacheData = [];  // 缓存已请求的数据
var deleteIds = [];  // 保存要删除行的id

class HandleDataList extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            currentPage: 1,
            data: [],  
            sumPage: 0,
            visible: false,
            currentCowData: {},  // 选中的行info
            loading: false,    
            urlBody: {           // 筛选请求参数
                isHandled: 2,
                isFeedBack: 2,
                isAll: true,
                more: 0
            },
            selectedRowKeys: [], // 删除选择行的keys
            FeedBack: {          // 筛选反馈情况  
                value: 2
            },
            HandledCondition: {  // 筛选处置情况
                value: 2
            },
            radioDisable: {      // 单选逻辑
                handledCondition: {
                    done: false,
                    not: false
                },
                feedBack: {
                    done: false,
                    not: false
                }
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
    }
    // 记录反馈情况的变化
    handleFeedBackChange(e) {
        this.setState({
            FeedBack:{
                value: e.target.value
            }
        })
    }
    // 记录处置情况的变化
    handleHandledConditionChange(e) {
        this.setState({
            HandledCondition:{
                value: e.target.value
            }
        })
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
        }
    }
    // 获取指定页数的数据
    getDataListByPage(page, more=0, refresh=false) {
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
            loading: true
        })
        // fetch
        let { token } = this.props;
        let result = getHandleDataList({
            url: page,
            body: this.state.urlBody
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
    // 修改表单
    handleClickAction(record){
        // console.log(record);
        this.setState({
            visible: true,
            currentCowData: record
        })
    } 
    handleConnectAction() {
        console.log('connetion');
        this.setState({
            visible: false
        })
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
    // 归集
    handleConnectionAction(info) {
        const { user, token } = this.props;
        const id = info.id;
        delete info.id;

        this.setState({
            loading: true
        })
        let result = collect({
            url: id,
            body: Object.assign({}, {recorder: user}, info )
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
                message.success('归集成功！');
                this.getDataListByPage(this.state.currentPage, 0, true);
            } else {
                message.error(`归集失败！${text}`);
            }
        }).catch(ex =>{
                console.log('服务器内部错误', ex.message);
            if (__DEV__) {
            }
        })
    }
    // handleSelectChangeSelect(record, selected, selectedRows) {

    //     console.log('record, selected, selectedRows', record, selected, selectedRows)
    // }
    
    handleDeleteAction() {
        console.log('delete object', deleteIds);
    }
    render(){
        // 选择框
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.handleSelectChange.bind(this),
        }
        // 表头
        const { handledCondition, feedBack } = this.state.radioDisable;
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
                    <a href={record.url}>{record.theme}</a>
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
                <RadioGroup onChange={this.handleHandledConditionChange.bind(this)} value={this.state.HandledCondition.value}>
                    <Radio disabled={handledCondition.not} style={radioStyle} value={0}>未处置</Radio>
                    <Radio disabled={handledCondition.done} style={radioStyle} value={1}>已处置</Radio>
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
                <RadioGroup onChange={this.handleFeedBackChange.bind(this)} value={this.state.FeedBack.value}>
                    <Radio disabled={feedBack.done} style={radioStyle} value={0}>未反馈</Radio>
                    <Radio disabled={feedBack.done} style={radioStyle} value={1}>已反馈</Radio>
                    <Radio style={radioStyle} value={2}>全选</Radio>
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

        return(
            <div id='tableWrap' className='container-flex'>
                <p className='section-header'>
                    全部舆情事件
                    <Button type='primary' 
                    className='table-delete-btn'
                    disabled={!!this.state.selectedRowKeys.length ? false : true }
                    onClick={this.handleDeleteAction.bind(this)}>删除</Button>
                </p>
                <TableWrap
                {...this.state}
                rowSelection={rowSelection}
                columns={columns}
                clickOtherPageAction={this.otherPageAction.bind(this)}/>

            </div>

        )
    }
}

                // <Modal 
                //  footer={null}
                //  width='935px'
                //  visible={this.state.visible}
                //  title='待归集事件'
                //  onOk={this.handleConnectAction.bind(this) }
                //  onCancel={this.handleModalCancelAction.bind(this)}
                //  >
                //      { /* 归集 */} 
                //  <Collection 
                //     loading= {this.state.loading}
                //     data={[this.state.currentCowData]}
                //     handleCancel={this.handleModalCancelAction.bind(this)}
                //     handleConnection={this.handleConnectionAction.bind(this)} />
                //  </Modal>
export default HandleDataList;