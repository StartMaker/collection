import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'

import { DatePicker, Select, message } from 'antd';
import moment from 'moment';
import Chart from '../../components/Chart';

import format from './subpage/format';

import getChartData from '../../fetch/chartData';
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
            isLoading: true
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
    componentDidMount(){
        let startTime = format((new Date()).getTime()-60*24*60*60*1000, "MM/dd/yyyy");
        let endTime = format((new Date()).getTime(), "MM/dd/yyyy");
        this.getChartList(startTime, endTime);
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
                     <Option value="jack">百度贴吧</Option>
                      <Option value="lucy" disabled>微信</Option>
                      <Option value="disabled" disabled>微博</Option>
                    </Select>
                </span>
                
                起止日期： 
                <RangePicker 
                    defaultValue={[moment().subtract(60, 'days'), moment()]}
                    ranges={{Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
                    format='YYYY-MM-DD'
                    onChange={this.handleDateChange.bind(this)} />
            </div>

             <Chart  data={this.state.data} isLoading={this.state.isLoading}/>

            </div>

        )
    }
}

export default DataExhibition;