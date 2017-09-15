import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { message, Popconfirm, Icon, Modal  } from 'antd';

import TableWrap from '../../../components/TableWrap';
import getDailyDataList from '../../../fetch/dailyDataList';
import getDailyDataSumPage from '../../../fetch/sumPage/dailyPage';
import collect from '../../../fetch/collect';

import * as fetchType from '../../../constants/fetchType';


import Collection from './subpage';
import format from '../../DataExhibition/subpage/format'

import './style.less';


var cacheData = [];  // 缓存已请求的数据

class DailyDataList extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            data: [],  
            sumPage: 0,
            visible: false,
            currentCowData: {},
            loading: false
        };
        // 表头
        this.columns = [{
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
            width: '35%',
            className: 'column-font',
        },{
            title: '更贴量',
            dataIndex: 'followCount',
        },{
            title: '类别',    // 可修改
            dataIndex: 'postType',
        },{
            title: '最后更贴时间',
            dataIndex: 'lastFollowTime',
        },{
            title: '发帖时间',
            dataIndex: 'postTime',
        },{
            title: '来源',
            dataIndex: 'source',
        },{
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
        this.getDataListByPage(1);
        this.getDailyDataSumPageAction();
    }
    componentWillMount() {
        if(!!!this.state.data) {
            this.setState({
                loading: true
            })
        }
    }   
    // 获取总页数
    getDailyDataSumPageAction(more=0) {
        let { token } = this.props;
        let result = getDailyDataSumPage({
            more: more
        }, token, fetchType.FETCH_TYPE_GET_URL)
        result.then(resp =>{
            if (resp.ok) {
                return resp.text();
            }
        }).then(text => {
            this.setState({
                sumPage: text
            })
        }).catch(ex => {
            console.log(ex.message);
        })
    }
    // 判断缓存中是否有当前请求数据 返回缓存位置，否则返回0
    checkCache(page) {
        let index = 0;
        cacheData.forEach((item, itemIndex) => {
            if (item.page === page) {
                index = itemIndex;
            }
        })
        return index;
    }
    // 获取指定页数的数据
    getDataListByPage(page, more=0) {
        //  从缓存中读取数据
        if (!!this.checkCache(page)) {
            this.setState({
                data: cacheData[this.checkCache(page)].json
            })
            console.log('cache');
            return;
        }
        this.setState({ // 加载中
            loading: true
        })
        // fetch
        let { token } = this.props;
        let result = getDailyDataList({
            url: page,
            body: {
                more: more
            }
        }, token, fetchType.FETCH_TYPE_GET_URL2PARAMS);
        // 处理返回的promise对象
        result.then(resp => {
            if (resp.ok) {
                return resp.json()
            }
        }).then(json => {
            // console.log('json', json);
            cacheData.push({
                page,
                json,
            })
            json.map((item, index) => {
                item.lastFollowTime = format(item.lastFollowTime, 'yyyy-MM-dd mm:ss');
                item.postTime = format(item.postTime, 'yyyy-MM-dd mm:ss');
            })
            this.setState({
                data: json,  // 保存数据
                loading: false  // 结束加载
            })
            // console.log('fetch', cacheData);
        }).catch(ex => {
            if (__DEV__) {
                console.log('获取列表数据出错', ex.message);
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
            } else {
                message.error(`归集失败！${text}`);
            }
        }).catch(ex =>{
            if (__DEV__) {
                console.log('服务器内部错误', ex.message);
            }
        })
    }
    render(){
        return(
            <div id='tableWrap' className='container-flex'>
                <p className='section-header'>全部舆情事件</p>
                <TableWrap
                {...this.state}
                columns={this.columns}
                clickOtherPageAction={this.otherPageAction.bind(this)}/>

                <Modal 
                 footer={null}
                 width='935px'
                 visible={this.state.visible}
                 title='待归集事件'
                 onOk={this.handleConnectAction.bind(this) }
                 onCancel={this.handleModalCancelAction.bind(this)}
                 >

                 <Collection 
                    loading= {this.state.loading}
                    data={[this.state.currentCowData]}
                    handleCancel={this.handleModalCancelAction.bind(this)}
                    handleConnection={this.handleConnectionAction.bind(this)} />
                 </Modal>
            </div>

        )
    }
}

export default DailyDataList;