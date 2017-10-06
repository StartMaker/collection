import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'


// echarts 组件载入
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';

import format from '../../containers/DataExhibition/subpage/format';
import './style.less';



/*
 注意点：
  【无法统一】x轴的数据，需要将其【未给定】的值填充为0
  无法统一: 勾选情况不一。
  未给定: x轴返回值中只有y轴大于零的点才有值 
 */

class DynamicChart extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    componentDidMount() {
        this.initLine();
    }
    componentDidUpdate() {
        this.initLine();
    }
    
    initLine() {
        const { dynamicData } = this.props;
        if(!!dynamicData) {
            let myChart = echarts.init(this.refs.chartContainer);
            window.onresize = function () {
                myChart.resize();  //echarts 图表自适应
            }
            if (this.props.isLoading) {
                myChart.showLoading({
                    text: '数据获取中',
                    maskColor:'#4c4c4c',
                    textColor:'#fff'
                })
            } else {
                myChart.hideLoading();
            }
            let options = this.setOptions(dynamicData);
            // console.log(' options.series', options.series);
            myChart.setOption(options, true);
        }
    }
    // 填充x轴
    fullXaxis(x, y, xAxis) {
      let newY = [];
      let count = 0;
      x = x.map((item, index)=>(new Date(item).getTime()))
          .sort((pre, next)=>pre-next)
          .map((item, index)=>format(item, 'MM-dd'));
      
      // console.log('x, y, xAxis', x, y, xAxis);

      xAxis.forEach((item, index)=>{
        if(item===x[count]) {
          newY.push(y[count++]);
        } else {
          newY.push(0);
        }
      })
      return newY;
    }
    // 初始serers
    initSingleSeries(obj, xAxis) {
      let {x, y, name, lineColor} = obj;
      let initSingleSeriesOption = {
          markPoint: {
              data: [
                  {type: 'max', name: '最大值'}
                  ]
          },
          name: "默认值",  // 关键字段
          type: 'line',
          // lineStyle:{normal:{color: '#145861',width:2} },
          // itemStyle:{normal:{color: '#004c5d'}},
          lineStyle: {normal:{color: '#000',width:2} }, // 关键字段
          itemStyle: {normal:{color: '#000'}},  // 关键字段
          data: [],  // 关键字段
          markLine: {
              data: [
                  {type: 'average', name: '平均值'}
              ]
          }       
        };
        // console.log('obj, xAxis', obj, xAxis);

        // console.log('fullXaxis(x, y, xAxis)', this.fullXaxis(x, y, xAxis));
        return Object.assign({}, initSingleSeriesOption, {data: this.fullXaxis(x, y, xAxis), name,
          lineStyle:{normal:{color: lineColor,width:2} }, // 关键字段
          itemStyle:{normal:{color: lineColor}},  // 关键字段})
      })
    }

    // 配置参数
    setOptions(data) {
        let initOptions = {
            legend: {
                right:"15%",
                top: '2%',
                data:['发帖量','跟帖量'],
                show : true
            },
            grid: {
                top:"40px",
                bottom:'10%',
                left:'3%',
                right:'1%'
            },
            tooltip: {
                show:true,
                trigger: 'axis'
            },
            toolbox: {
                right:"2%",
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    magicType: {
                        show: true, 
                        type: ['stack', 'tiled', 'bar','line']
                    },
                    saveAsImage: {
                        show: true
                    }
                }
            },
            xAxis: {
                type: 'category',
                data: [],
                boundaryGap : true,
                axisLine: { lineStyle: { color: '#777' } },
                //interval:2,
                axisTick:{    //x轴刻度
                    interval:0
                },
                // min: 0,
                // max: 21,
                axisLabel:{ //x轴标签
                    //interval:2,
                    textStyle:{
                        color:'#000',
                        fontSize:12
                    }
                },
                axisPointer: {
                    show: true
                }
            },
            yAxis: {
            },
            series:[]
        }
        let xAxis = [];

        let colors = ['#af56d7', '#32a0fc', '#00b541', '#f67a40', '#fa3339'];

        // console.log('setOptions(data)', data);

        // 转换数据结构
        let commenData = data.map((item, index)=>{
          return Object.assign({}, {
            name: item.theme,
            x: item.chartPoint.map((item, index)=>{
              return item.x;
            }),
            y: item.chartPoint.map((item, index)=>{
              return item.y;
            }),
            lineColor: colors[index],
          })
        })

        // console.log('commenData', commenData);


        if (!!commenData.length) {

          commenData.forEach((item, index)=>{
            item.x.forEach((itemTime, index)=>{
              xAxis.push( (new Date(itemTime)).getTime() ); 
            })
          })
          // 整理
          initOptions.xAxis.data = Array.prototype
          .filter.call(xAxis, (item, index, arr) =>arr.indexOf(item) == index )// 去重
          .sort((pre, next)=>pre-next)  // 排序
          .map((item, index)=>format(item, 'MM-dd')) // 格式化

          commenData.forEach((item, index)=>{
            initOptions.series.push(this.initSingleSeries(item, initOptions.xAxis.data));
            // 拼接
          })
        }


        
        return initOptions;
    }
    render(){
        return(
            <div>
            <div id='chart-container' ref='chartContainer' style={{width: '100%', height: '256px'}}></div>
            </div>
        )
    }
}

export default DynamicChart;