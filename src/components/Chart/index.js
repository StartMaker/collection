import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markPoint';
import './style.less';

class Chart extends React.Component{
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
        const { data } = this.props;
        if(!!data) {
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
            let options = this.setOptions(data);
            myChart.setOption(options);
        }
    }
    setOptions(data) {
        var FLLOW = {
            x: [],
            y: []
        },
            POST = {
            x: [],
            y: []               
        };
        var { followCountPoints, postCountPoints } = data;
        // console.log(typeof(followCountPoints));
        // console.log(followCountPoints[2]);
        // console.log(Array.from(postCountPoints)[2] );

        followCountPoints.map((item, index) => {
            FLLOW.x.push(item.x.slice(-5));
            FLLOW.y.push(item.y);
        })
        postCountPoints.map((item, index) => {
            POST.x.push(item.x.slice(-5));
            POST.y.push(item.y);
        })

        console.log('Fllow', FLLOW, 'POST', POST);

        return {
            legend: {
                left:"2%",
                data:['发帖量','跟帖量'],
                show : true
            },
            grid: {
                top:"40px",
                bottom:'10%',
                left:'3%',
                right:'3%'
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
                data: FLLOW.x,
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
                // type: 'value',
                // min:0,
                // max:MaxY,
                // splitNumber:5,
                // axisLabel:{ 
                //     textStyle:{
                //         color:'#000',
                //         fontSize:12
                //     }
                // }
            },
            series:[{
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'}
                    ]
                },
                name:"跟帖量",
                type:'line',
                lineStyle:{normal:{color: '#145861',width:2} },
                itemStyle:{normal:{color: '#004c5d'}},
                data: FLLOW.y,
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                },
                areaStyle: {
                    normal: {  /* 蓝色 */
                        alpha :0.5,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 1,
                            color: '#f2f5f2'
                        }, {
                            offset: 0.5,
                            color: '#65c8d0'
                        },{
                            offset:0,
                            color: '#004c5d'
                        }
                        ])
                    }
                }            
                },{
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'}
                    ]
                },
                name:"发帖量",
                type:'line',
                lineStyle:{normal:{color: '#9c9c9c',width:2} },
                itemStyle:{normal:{color: '#572015'}},
                data: POST.y,
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                },
                areaStyle: {
                    normal: {
                        alpha :0.2,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 1,
                            color: '#fff'
                        },{
                            offset: 0.75,
                            color: '#ccc'
                        }, {
                            offset: 0.3,
                            color: '#999'                            
                        },
                            {
                            offset: 0,
                            color: '#7e7e7e'
                        }])
                    }
                }
            }]
        }
    }
    render(){
        return(
            <div>
            <div ref='chartContainer' style={{width: '100%', height: '256px'}}></div>
            </div>

        )
    }
}

export default Chart;