import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Card, Button, Switch, Icon  } from 'antd';

import './style.less';

const gridStyle = {
  width: '90%',
  padding: 0,
  // textAlign: 'center',
};
/*
id
:
25
name
:
"test"
url
:
Array(3)
 */
class TopicItem extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render(){
        const { data } = this.props; 
        console.log('V', data);
        return(
            <Card.Grid id='TopicItem-wrap'>
                <Switch className='TopicItem-switch-btn' size='small'/>
                <Icon type='close' className='TopicItem-icon-delete'/>
                <p className='TopicItem-header'>{data.name}</p>
                <p className='TopicItem-url-container'>
                {
                    data.url.map((item, index)=><p key={index} className='TopicItem-url'>{item}</p>)
                }
                </p>
                    

            </Card.Grid>


        )
    }
}

export default TopicItem;