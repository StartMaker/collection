import  React from 'react';
import { Link, hashHistory } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../Head';
import DataExhibition from '../DataExhibition';

import { Button, Row, Col } from 'antd';
// // import getMockData from '../../fetch/easyMockTest';

import * as userInfoActionsFromOtherFile from '../../actions/userinfo.js';

import TopicList from './subpage/TopicList';
import EventsByTopicList from './subpage/EventsByTopicList';
// import DailyDataList from '../DataList/dailyList';
import './style.less'; 
// import TweenoneFourthDemo from '../../components/testCom/TweenoneFourthDemo';

class Topic extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            ids: [],  // 通过修改id的值，触发专贴事件的刷新
            selectedRows: [],
        }
    }
    componentDidMount() {
        if (this.props.userinfo.username == null ) { // 判断用户登录情况
            hashHistory.push('/');     
        }
    }
    handleMockTest() {
        let result = getMockData();
        result.then(resp => {
            if (resp.ok) {
                return resp.json();
            }
        }).then(json => {
            console.log('mock data', json);
        })
    }
    // ids 单一功能原则
    // 专贴选择
    modifyIdsAction(ids) {
    // 通过修改id的值，触发专贴事件的刷新
        // let { ids } = this.state;
        // console.log('newId', newID);
        this.setState({ids})
    }
    // 事件列表选择
    modifyUrlsAction(selectedRows) {
        // console.log('newUrls', newUrls);
        console.log('i am special');
        this.setState({selectedRows})
    }
    // 
    render(){
        // const { role, username } = this.props.userinfo;
        // console.log('this.props.userinfo', this.props.userinfo);
        const userinfo = this.props.userinfo;
        const role = userinfo.role;
        const username = userinfo.username;
        // 筛选出选中urls
        const urls = this.state.selectedRows.map((item, index)=>item.url);
        // console.log('username',username);
        // const testUrls = ["http://tieba.baidu.com/p/5335559380","http://tieba.baidu.com/p/5347033044","http://tieba.baidu.com/p/5345718981"];
        return(
            <div>
                <Header 
                    selectedRows={this.state.selectedRows|| []}
                    user= { username } 
                    role={ role } 
                    selectedKeys='topic'/> { /* 头部 */}
                <DataExhibition 
                    urls={urls} 
                    token={this.props.userinfo.token} dynamic={true} />  { /* 图表 */}
                <Row id='topicDataListContainer' gutter={16}>
                    <Col span={8} className="gutter-row">
                        <TopicList
                            onUrls={urls}
                            modifyIds={this.modifyIdsAction.bind(this)}
                            token={this.props.userinfo.token} />
                    </Col>
                    <Col span={16} className="gutter-row"> 
                        <EventsByTopicList
                            modifyUrls={this.modifyUrlsAction.bind(this)}
                            ids={this.state.ids}
                            token={this.props.userinfo.token}
                            user={ username }/>
                    </Col>
                </Row>
            </div>
        )
    }
}
                // <EventByTopicList />
                // <TweenoneFourthDemo/>
                // <DailyDataList token={this.props.userinfo.token} user= { username }/>  { /*  列表展示  */}
// easy mock test
// <Button onClick={ this.handleMockTest }> Click me to get mock data </Button>

// 连接redux

function mapStateToProps(state) {
    return {
        userinfo: state.userinfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoAction: bindActionCreators(userInfoActionsFromOtherFile, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Topic);