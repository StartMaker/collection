import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Card, Button } from 'antd';

import TopicItem from './TopicItem';
import './style.less';

var itemList = [];
class TopicItemWrap extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    componentWillMount() {

    }

    handleChoseAction(info) {
        this.props.handleChoseAction(info);
    }
    handleDeleteAction(info) {
        this.props.handleDeleteAction(info);
    }
    render(){
        let { data } = this.props;
        itemList.length = 0;
        data.forEach((item, index)=>{
            itemList.push(
                <TopicItem data={item} 
                    onDelete={this.handleDeleteAction.bind(this)}
                    onChose={this.handleChoseAction.bind(this)}/>
            )
        })
        return(
            <Card loading={false} title="专贴列表" noHovering extra={<Button>Add Topic</Button>}>
              {
                data.map((item, index)=>
                    <TopicItem data={item} 
                        key={index}
                        onDelete={this.handleDeleteAction.bind(this)}
                        onChose={this.handleChoseAction.bind(this)}/>
                )
              }
            </Card >

        )
    }
}

export default TopicItemWrap;