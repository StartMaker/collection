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
    handleChoseAction(checked, id) {
        this.props.handleChoseAction(checked, id);
    }
    handleDeleteAction(id) {
        this.props.handleDeleteAction(id);
    }
    handleAddTopicAction() {
        this.props.handleAddTopicAction();
    }
    handleCheckValue(modifyTopicObj) {
        this.props.onCheckValueAction(modifyTopicObj);
    }
    render(){
        let { data, onUrls } = this.props;
        itemList.length = 0;
        return(
            <Card loading={false} title="专贴列表" noHovering extra={<Button onClick={this.handleAddTopicAction.bind(this)}>Add Topic</Button>}>
              {
                data.map((item, index)=>
                    <TopicItem data={item}
                        onUrls={onUrls}
                        onCheckValueAction={this.handleCheckValue.bind(this)}
                        key={index}
                        handleDelete={this.handleDeleteAction.bind(this)}
                        handleSwitch={this.handleChoseAction.bind(this)}/>
                )
              }
            </Card >

        )
    }
}

export default TopicItemWrap;