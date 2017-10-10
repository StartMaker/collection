import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {  Icon, Input, Button, Table, message } from 'antd';

import './style.less';

import EditableInput from '../../../../components/EditableInput';

// const 
// var initData = [];
class Collection extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
         this.state= {
            mainView: '',
            postType: '',
            id: '',
            connectable: true,
            loading: false
         }
        this.columns = [{
          title: '主题',
          dataIndex: 'theme'
        },{
          title: '主要观点',
          dataIndex: 'mainView',
          width: '40%',
          render: (text, record, index) =>{ 
            // console.log('text, record, index', text, record, index);
            // const initMainView = text;
            // this.initDataAction('mainView', text);
            return (
            <EditableInput  
            value={this.state.mainView}
            onChange={this.handleChangeMainView.bind(this)} />
            )
          }
        },{
          title: '更贴量',
          dataIndex: 'followCount',
          width: '8%',
        },{
          title: '类别',
          dataIndex: 'postType',
          width: '20%',
          render: (text, record, index) => {
            // const initPostType = text; 
            // this.initDataAction('postType', text);
            return (
            <EditableInput  
            value={this.state.postType}
            onChange={this.handleChangeType.bind(this)} />
            )
          }
        },{
          title: '发帖时间',
          dataIndex: 'postTime',
          width: '8%',
        },{
          title: '来源',
          dataIndex: 'source',
          width: '8%',
        }]
    }
    // initDataAction(key, value) {
    //     initData.length > 1 ? " " : initData.push({ [ key ]: value}); // es6 对象变量名拓展
    // }
    //  初始化state
    initState(state) {  
        const { mainView, postType, id } = !!state ? state.data[0] : this.props.data[0];
        this.setState({
            mainView,
            postType,
            id
        })  
    }
    // 第一次挂载时加载初始化state
    componentDidMount() {
        this.initState();
    }
    // 每次postType改变时就记录
    handleChangeType(postType) {
      console.log('postType', postType);
      this.setState({
        postType,
        connectable: false // 允许归集
      });
    }
    // 每次mainView改变时就记录
    handleChangeMainView(mainView){
      console.log('mainView', mainView);

      this.setState({
        mainView,
        connectable: false // 允许归集
      });
    }
    // 隐藏弹窗
    handleCancelAction() {  
      this.props.handleCancel()
    }
    // 归集
    handleConnectionAction() {  
      this.setState({
        loading: true
      });
      let { table } = this.props;
      let bindId = this.props.data[0].parentTableId || '' ;
      const { mainView, postType, id } = this.state; 
      this.props.handleConnection({
        mainView,
        postType,
        id,
        table,
        bindId // 数据的双向绑定
      });

      
        // this.handleCancelAction();
    }
    componentWillUpdate(nextProps, nextState) {
      if (this.props.data !== nextProps.data) {
        this.setState({
            connectable: true,
        })
        this.initState(nextProps);
      }
    }
    render(){
       const { theme, mainView, source, postType, followCount, postTime } = this.props.data;
       const data =  this.props.data;
        return(
            <div>
            <Table 
            size="small"
            pagination={false}
            bordered
            dataSource={data}
            columns={this.columns}>
            </Table>
            <div className='connect-btn-container'>
                <Button onClick={this.handleCancelAction.bind(this)}>取消</Button>
                <Button 
                    loading={this.props.loading} 
                    type='primary' 
                    disabled={this.state.connectable} 
                    onClick={this.handleConnectionAction.bind(this)}>归集</Button>
            </div>
            </div>

        )
    }
}
export default Collection;