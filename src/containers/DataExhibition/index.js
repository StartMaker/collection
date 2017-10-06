import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'

import { DatePicker, Select, message } from 'antd';
import moment from 'moment';
import Chart from '../../components/Chart';
import DynamicChart from '../../components/DynamicChart';
import format from './subpage/format';

import getChartData from '../../fetch/chartData';
import getDynamicChartData from '../../fetch/chartTopicData';
const RangePicker = DatePicker.RangePicker;

import './style.less';
// <Chart  />
moment.locale('zh-cn');

class DataExhibition extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            data: false,
            isLoading: true,
            dynamicData: [],
            urls: [],
        }
    }
    getChartList(startTime, endTime) {  // 传入起止日期
        let params = {
            source: '西南石油大学',
            data: '双折线图',
            beginTime: startTime,
            endTime: endTime,
            table: this.props.tableType
        }
        let token = this.props.token;
        if (!!token) {
            let result = getChartData(params, false, this.props.token);
            result.then(resp => {
                if (resp.ok) {
                    return resp.json();
                } else {
                    message.error('参数不合法');
                }
            }).then(json => {
                // console.log('json', json)
                this.setState({
                    data: json,
                    isLoading: false
                })
            }).catch(ex => {
                if (__DEV__) {  // 在开发模式下
                    console.log('图表数据获取失败', ex.message);
                }
            })
        } else {
            console.error('图表获取数据时，token加载失败');
        }
    }
    // 动态图表
    getDynamicChart(urls=[]) {
        let { token } = this.props;
        if (!urls.length) {
            this.setState({dynamicData: []});
            return;
        }
        // console.log('getDynamicChart');
        let result = getDynamicChartData(urls, token);
        result.then(resp =>{
            if (resp.ok) {
                return resp.json();
            } else {
                message.error('没有该资源');
            }
        }).then(dynamicData => {
            // console.log('dynamic data', dynamicData);
            this.setState({dynamicData});
        }).catch(ex=>{
            console.log('折线选择过程出现错误');
        })
    }
    // 初始化拿到当前时间
    componentDidMount(){
        let startTime = format((new Date()).getTime()-60*24*60*60*1000, "MM/dd/yyyy");
        let endTime = format((new Date()).getTime(), "MM/dd/yyyy");
        let { dynamic } = this.props;
        if (!!dynamic) {
            this.getDynamicChart();
        } else {
            this.getChartList(startTime, endTime);
        }
    }
    // 动态刷新折线
    componentWillUpdate(preProps, preState) {
        let { dynamic } = this.props; 
        if(dynamic) {
            if (preProps.urls.length!==this.props.urls.length) {
                this.getDynamicChart(preProps.urls);
                this.setState({
                    urls: preProps.urls
                })
            }

        }
    }
    // 日期变化时 
    handleDateChange(dates, dateStrings) {
        // console.log('From: ', dates[0], 'To', dates[1]); 
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
        let startTime = format(dateStrings[0], "MM/dd/yyyy");
        let endTime = format(dateStrings[1], "MM/dd/yyyy");
        this.getChartList(startTime, endTime);
    }

    handleSelectChange(value) {
        console.log(value);
    }
    
    render(){
        const { dynamic } = this.props;
        const { dynamicData, data } = this.state;
        return(
            <div className='container-flex' id='DataExhibition-container'>
            <p className='section-header'>舆情趋势折线图</p>
            <div>
                <span className='section-data-source '>
                    来源：
                    <Select 
                    defaultValue='百度贴吧'
                    onChange={this.handleSelectChange.bind(this)}
                    >
                     <Option value="tieba">百度贴吧</Option>
                      <Option value="weixin" disabled>微信</Option>
                      <Option value="weibo" disabled>微博</Option>
                    </Select>
                </span>
                {
                    !dynamic ? <span>起止日期: 
                    <RangePicker 
                    defaultValue={[moment().subtract(60, 'days'), moment()]}
                    ranges={{Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
                    format='YYYY-MM-DD'
                    onChange={this.handleDateChange.bind(this)} /></span> : ''
                }
                
            </div>
            {
              !dynamic ? <Chart data={data} isLoading={this.state.isLoading}/> : 
                <DynamicChart dynamicData={dynamicData} />
            }
             

            </div>

        )
    }
}

export default DataExhibition;