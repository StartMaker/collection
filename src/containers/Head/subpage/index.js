import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Menu, Icon, Button, Dropdown, DatePicker  } from 'antd';
import moment from 'moment';

moment.locale('zh-cn');
const SubMenu = Menu.SubMenu;
const { MonthPicker } = DatePicker;


import './style.less';



class User extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    DownLoad() {
        this.props.handleDownLoadReport();
    }
    Disconneted() {
        this.props.handleDisconneted();
    }
    RightCom() {
        this.props.handleRightCom();
    }
    mouthChange(data, dateString) {
      this.props.handleChangeReportDateAction(dateString.slice(0, 4), dateString.slice(5));
        // console.log('selected month', data, dateString); 
    }
    render(){
    const menu = (
        <Menu>
            <Menu.Item>
            <Icon type="disconnect" style={{ fontSize: 16, color: '#08c' }} />
            <span className='head-trigger' onClick={ this.Disconneted.bind(this) }> 注   销</span>
            </Menu.Item>
            <Menu.Item disabled={ this.props.privilege ? false : true}>
                <Icon type="usergroup-add" style={{ fontSize: 16, color: '#08c' }} />
                <span className='head-trigger' onClick={this.props.privilege?this.RightCom.bind(this) : '' }> 权限管理 </span>
            </Menu.Item>
        </Menu>
    )
        return(
            <div id='head-userinfo'>
                <p>
                    <Dropdown overlay={menu} placement="bottomLeft">
                        <span>
                            <Icon type="user" style={{ fontSize: 16, color: '#08c', paddingRight: 5 }} />
                             {this.props.role} {this.props.username}
                            <Icon type="down"  />
                        </span>
                    </Dropdown>
                    <span className='head-reporter'>
                      <MonthPicker
                        disabled={this.props.isDownLoadReport}
                        className='head-monthpicker' 
                        onChange={this.mouthChange.bind(this)} 
                        placeholder='Select month '
                        defaultValue={moment(new Date(), 'yyyy-MM')}/>
                      <Button
                        className='head-report-btn'
                        icon='exception' 
                        loading={this.props.isDownLoadReport}
                        onClick={this.DownLoad.bind(this)} >生成报表</Button>
                    </span>
                </p>
            </div>

        )
    }
}
// 


export default User