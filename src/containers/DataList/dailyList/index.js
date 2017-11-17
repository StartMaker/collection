import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { message, Popconfirm, Icon, Modal  } from 'antd';

import TableWrap from '../../../components/TableWrap';
import getDailyDataList from '../../../fetch/DataList/dailyDataList';
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
            currentPage: 1,
            data: [],  
            sumPage: 0,
            visible: false,
            currentCowData: {},
            loading: false,
            more: 0,
        };
        // 表头
        this.columns = [{
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
            width: '35%',
            className: 'column-font',
        },{
            title: '跟贴量',
            dataIndex: 'followCount',
        },{
            title: '类别',    // 可修改
            dataIndex: 'postType',
        },{
            title: '最后跟贴时间',
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
        //  获取列表信息
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
    getDailyDataSumPageAction() {
        let { more } = this.state;
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
                sumPage: parseInt(text, 10)
            })
        }).catch(ex => {
            console.log(ex.message);
        })
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
    pushCache(page, json) {
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
        // 推入缓存
        if (!isIn) {
            cacheData.push({
                page,
                json,
            })
        }
    }
    // 获取指定页数的数据
    getDataListByPage(page, refresh=false) {
        //  从缓存中读取数据
        let cacheIndex = this.checkCache(page);
        if (cacheIndex >= 0 && !refresh) {
            this.setState({
                currentPage: page,
                data: cacheData[cacheIndex].json
            })
            console.log('cache');
            return;
        }
        let { more } = this.state;
        // 加载中
        this.setState({ 
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
            // 格式化时间
            json.map((item, index) => {
                item.lastFollowTime = format(item.lastFollowTime, 'yyyy-MM-dd hh:mm');
                item.postTime = format(item.postTime, 'yyyy-MM-dd hh:mm');
            })
             // 推入缓存
            this.pushCache(page,json); 
            // 结束加载 保存数据
            this.setState({
                currentPage: page,
                data: json, 
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
                this.getDataListByPage(this.state.currentPage, true);
            } else {
                message.error(`归集失败！${text}`);
            }
        }).catch(ex =>{
                console.log('服务器内部错误', ex.message);
            if (__DEV__) {
            }
        })
    }
    onShowSizeChange(current, size) {
        console.log('current, size',current, size);

        this.setState({more: (size - 5)}, ()=> {
            cacheData = [];
            this.getDataListByPage(this.state.currentPage);
            this.getDailyDataSumPageAction();
        });
    }
    render(){
        const { sumPage, more } = this.state;
        const currentSize = 5 + more;
        return(
            <div className='container-flex tableWrap'>
                <p className='section-header'>全部舆情事件</p>
                <TableWrap
                {...this.state}
                onShowSizeChange={this.onShowSizeChange.bind(this)}
                pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '15', '20'],
                    total: sumPage * currentSize ,
                    pageSize: currentSize,
                }}
                columns={this.columns}
                clickOtherPageAction={this.otherPageAction.bind(this)}/>

                <Modal 
                 footer={null}
                 width='935px'
                 visible={this.state.visible}
                 title='待归集事件'
                 onOk={this.handleModalCancelAction.bind(this) }
                 onCancel={this.handleModalCancelAction.bind(this)}
                 >
                     { /* 归集 */} 
                 <Collection
                    table='daily'
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