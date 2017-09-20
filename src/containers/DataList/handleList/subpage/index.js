import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {  Icon, Input, Button, Table, message, Cascader, Select  } from 'antd';

import './style.less';

import EditableInput from '../../../../components/EditableInput';

// const 
// var initData = [];
const Option = Select.Option;
const handleOptions = [{
  value: '未处置',
  label: '未处置',
},{
  value: '学院',
  label: '学院',
  children: [{
    value: '石油与天然气工程学院',
    label: '石油与天然气工程学院'
  },{
    value: '地球科学与技术学院',
    label: '地球科学与技术学院'
  },{
    value: '机电工程学院',
    label: '机电工程学院'
  },{
    value: '化学化工学院',
    label: '化学化工学院'
  },{
    value: '材料科学与工程学院',
    label: '材料科学与工程学院'
  },{
    value: '计算机科学学院',
    label: '计算机科学学院'
  },{
    value: '电气信息学院',
    label: '电气信息学院'
  },{
    value: '土木工程与建筑学院',
    label: '土木工程与建筑学院'
  },{
    value: '理学院',
    label: '理学院'
  },{
    value: '法学院',
    label: '法学院'
  },{
    value: '经济管理学院/MBA教育中心',
    label: '经济管理学院/MBA教育中心'
  },{
    value: '马克思主义学院',
    label: '马克思主义学院'
  },{
    value: '外国语学院',
    label: '外国语学院'
  },{
    value: '育学院(体育工作委员会)',
    label: '育学院(体育工作委员会)'
  },{
    value: '艺术学院',
    label: '艺术学院'
  },{
  value: '南充校区',
  label: '南充校区',
  children: [{
    value: '工程学院',
    label: '工程学院'
  },{
    value: '信息学院',
    label: '信息学院'
  },{
    value: '财经学院',
    label: '财经学院'
  },{
    value: '基础教学部',
    label: '基础教学部'
  }]
}]
},{
  value: '党政管理',
  label: '党政管理',
  children: [{
    value: '党委办公室、校长办公室',
    label: '党委办公室、校长办公室'
  },{
    value: '纪监审办公室(纪委办公室、监察处、审计处)',
    label: '纪监审办公室(纪委办公室、监察处、审计处)'
  },{
    value: '组织部、党校',
    label: '组织部、党校'
  },{
    value: '机关党委',
    label: '机关党委'
  },{
    value: '宣传部、统战部',
    label: '宣传部、统战部'
  },{
    value: '学生工作部(研究生工作部)(处)',
    label: '学生工作部(研究生工作部)(处)'
  },{
    value: '保卫部(处)(武装部)',
    label: '保卫部(处)(武装部)'
  },{
    value: '工会',
    label: '工会'
  },{
    value: '团委',
    label: '团委'
  },{
    value: '发展规划处(高教研究室)',
    label: '发展规划处(高教研究室)'
  },{
    value: '人事处',
    label: '人事处'
  },{
    value: '教务处',
    label: '教务处'
  },{
    value: '科研处',
    label: '科研处'
  },{
    value: '研究生院',
    label: '研究生院'
  },{
    value: '教学评估处(教师教学发展中心)',
    label: '教学评估处(教师教学发展中心)'
  },{
    value: '招生就业处(大学生职业规划与就业指导中心)',
    label: '招生就业处(大学生职业规划与就业指导中心)'
  },{
    value: '大学生创新创业中心(创新创业学院、大学生创新创业俱乐部)',
    label: '大学生创新创业中心(创新创业学院、大学生创新创业俱乐部)'
  },{
    value: '财务处',
    label: '财务处'
  },{
    value: '国际合作与交流处',
    label: '国际合作与交流处'
  },{
    value: '国有资产管理处',
    label: '国有资产管理处'
  },{
    value: '实验室与设备管理处',
    label: '实验室与设备管理处'
  },{
    value: '基建处',
    label: '基建处'
  },{
    value: '离退休工作处关心下一代工作委员会',
    label: '离退休工作处关心下一代工作委员会'
  },{
    value: '校友工作处',
    label: '校友工作处'
  }]
},{
  value: '直属单位',
  label: '直属单位',
  children: [{
    value: '油气藏地质及开发工程国家重点实验室',
    label: '油气藏地质及开发工程国家重点实验室'
  },{
    value: '新能源和非常规油气研究院',
    label: '新能源和非常规油气研究院'
  },{
    value: '光伏产业技术研究院',
    label: '光伏产业技术研究院'
  },{
    value: '国家大学科技园管理办公室',
    label: '国家大学科技园管理办公室'
  },{
    value: '学报中心',
    label: '学报中心'
  },{
    value: '图书馆',
    label: '图书馆'
  },{
    value: '档案馆',
    label: '档案馆'
  },{
    value: '现代教育技术中心',
    label: '现代教育技术中心'
  },{
    value: '工程训练中心',
    label: '工程训练中心'
  },{
    value: '继续教育与网络学院',
    label: '继续教育与网络学院'
  },{
    value: '科技产业集团有限公司',
    label: '科技产业集团有限公司'
  },{
    value: '后勤服务总公司',
    label: '后勤服务总公司'
  },{
    value: '校医院',
    label: '校医院'
  }]
}];


class Handled extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
         this.state = {
            handledCondition: [],
            feedbackCondition: '',
            detail: '',
            id: '',
            Operable: true,
            loading: false,
         }
    }
    // 保存处置情况
    handleChangeHandleOption(handledCondition) {
      this.setState({
        handledCondition: handledCondition,
        Operable: handledCondition[0]==='未处置' ? true : false
      })
    }
    // 保存反馈情况
    handleChangeFeedbackOption(feedbackCondition) {
      this.setState({
        feedbackCondition: feedbackCondition
      })
    }

    //  初始化state
    initState(state) {
        const { handledCondition, feedbackCondition, id, detail } = !!state ? state.data[0] : this.props.data[0];
        this.setState({
            handledCondition: Array.isArray.call(handledCondition) ? handledCondition : handledCondition.split('/'),
            feedbackCondition,
            id,
            detail,
        }, ()=>{
          let OperableFlag = this.state.handledCondition[0];
          this.setState({
            Operable: OperableFlag==='未处置' ? true : false
          })
        })
    }
    // 第一次挂载时加载初始化state
    componentDidMount() {
        this.initState();
    }
    // 每次重新渲染都初始化state
    // componentDidUpdate() { 
    //     this.initState();
    // }
    // 每次detail改变时就记录
    handleDetailChange(detail) {
      this.setState({detail});
        // this.setState({ // 允许归集
        //     Operable: false
        // })
    }
    // 隐藏弹窗
    handleCancelAction() {  
      this.props.handleCancel()
    }
    // 处置
    handleHandleAction() {  
      this.setState({
        loading: true
      });
      const { handledCondition, feedbackCondition, id, detail } = this.state;

      this.props.handleHandle({
        handledCondition,
        feedbackCondition,
        id,
        detail
      });
      this.handleCancelAction();
    }
    componentWillUpdate(nextProps, nextState) {
      if (this.props.data !== nextProps.data) {
        this.setState({
            Operable: true,
        })
        this.initState(nextProps);
      }
    }
    render(){
       // const { theme, mainView, source, postType, followCount, postTime } = this.props.data;
       // console.log('handled render', data);
       const columns = [{
          title: '主题',
          dataIndex: 'theme'
        },{
          title: '处置情况',
          dataIndex: 'handledCondition',
          width: '25%',
          render: (text, record, index) =>{ 
            // console.log('text, record, index', text, record, index);
            // const initMainView = text;
            // this.initDataAction('mainView', text);
            // console.log('this.state.handledCondition', new Array(this.state.handledCondition));
            return (
            <Cascader 
            showSearch
            style={{ width: 200 }}
            options={handleOptions}
            onChange={this.handleChangeHandleOption.bind(this)} 
            value={this.state.handledCondition}/>
            )
          }
        },{
          title: '反馈情况',
          width: '25%',
          dataIndex: 'feedbackCondition',
          render: (text, record, index) =>{ 
            return (
            <Select style={{ width: 200 }}
            onChange={this.handleChangeFeedbackOption.bind(this)} 
            value={[this.state.feedbackCondition]}>
              <Option value="未反馈">未反馈</Option>
              <Option value="已反馈">已反馈</Option>
            </Select>
            )
          }
        },{
          title: '具体处置',
          width: '25%',
          render: (text, record, index) => {
            return (
              <EditableInput 
               value={this.state.detail}
               onChange={this.handleDetailChange.bind(this)} />
            )
          }
        }]


        return(
            <div>
            <Table 
            size="small"
            pagination={false}
            bordered
            dataSource={this.props.data}
            columns={columns}>
            </Table> 
            <div className='connect-btn-container'>
                <Button onClick={this.handleCancelAction.bind(this)}>取消</Button>
                <Button 
                    loading={this.props.loading} 
                    type='primary' 
                    disabled={this.state.Operable} 
                    onClick={this.handleHandleAction.bind(this)}>处置</Button> 
            </div>
            </div>

        )
    }
}
export default Handled;