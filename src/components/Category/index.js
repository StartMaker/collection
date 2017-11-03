import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {  Menu, Tabs } from 'antd';

const SubMenu = Menu.SubMenu;

import './style.less'
class Category extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    handleDiffPage(e) {
        this.props.changePage(e)
    }
    render(){
      const textStyle = {
        fontSize: 16,
      }
        return(
            <Menu id='category_container' style={textStyle} mode='horizontal'
                onClick={e=> { this.handleDiffPage(e)} } 
                selectedKeys={[this.props.current]} 
                theme='light'
                 style={{ lineHeight: '64px'}}>
                  <Menu.Item key='ana'>舆情监测</Menu.Item>
                  <Menu.Item key='handle'>舆情处置</Menu.Item>
                  <Menu.Item key='special'>专题事件</Menu.Item>
                  <Menu.Item key='topic'>专贴分析</Menu.Item>
            </Menu>

        )
    }
}

export default Category;