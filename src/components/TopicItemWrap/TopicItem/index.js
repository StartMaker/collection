import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Card, Button, Switch, Icon, Popconfirm } from 'antd';

import EditableInput from '../../EditableInput';
import addTopic from '../../../fetch/addTopic';
import './style.less';

const gridStyle = {
  width: '90%',
  padding: 0,
  marginLeft: 16,
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
        this.state = {
            urls: []
        }
    }
    componentDidMount() {
        const { data } = this.props; 
        this.setState({
            urls: data.url
        })
    }
    handleDeleteAction(...args) {
        this.props.handleDelete(args[0].id);
    }
    handleSwitchAction(checked, id) {
        this.props.handleSwitch(checked, id);
    }
    onCheckValue(index, value) {
        // console.log('...args', args);
        let { urls } = this.state;
        let { data } = this.props;
        urls = urls.map((item, itemIndex)=>{
                if (itemIndex===index) {
                    return value
                } else {return item}
            });
        this.setState({urls });
        this.props.onCheckValueAction({
            id: data.id,
            url: urls,
        })
        
    }

    render(){
        const { data, onUrls } = this.props; 
        // console.log('V', data);
        let switchDisabled = !!data.url.filter((item, index)=>{
            return onUrls.indexOf(item)>=0 ? true : false
        }).length ? true : false
        return(
            <Card.Grid id='TopicItem-wrap'>
                <Switch 
                    defaultChecked={true} 
                    className='TopicItem-switch-btn' 
                    disabled={switchDisabled}
                    size='small' 
                    onChange={this.handleSwitchAction.bind(this, data.id)}/>
                <Popconfirm title="Are you sure？" onConfirm={this.handleDeleteAction.bind(this, data)} okText="Yes" cancelText="No">
                    <Icon type='close' className='TopicItem-icon-delete'/>
                </Popconfirm>
                <p className='TopicItem-header'>{data.name}</p>
                <p className='TopicItem-url-container'>
                {
                    data.url.map((item, index)=>
                        <EditableInput 
                            key={index}
                            onChange={this.onCheckValue.bind(this, index)}
                            value={item}/>
                    )
                }
                </p>
                    

            </Card.Grid>


        )
    }
}

export default TopicItem;