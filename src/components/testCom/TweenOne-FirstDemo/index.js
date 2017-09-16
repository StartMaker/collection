import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import TweenOne from 'rc-tween-one';
import { Button } from 'antd';

import './style.less';
class TestAnimating extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            paused: false,
            animation: {},
            stretching: false,
        }
        this.animation = [{
            repeat: 0, 
            width: 140, 
            duration: 1000 
        },{
            repeat: 0, 
            width: 100, 
            duration: 1000 
        }]
    }
    changeBoxMovingState() {
        let basicAn = {
            duration: 1000,
            repeat: 0, 
        };
        if (this.state.stretching) {
            this.setState({
            animation: Object.assign({}, basicAn, {width: 100}),
            stretching: false
            })
        } else {
            this.setState({
            animation: Object.assign({}, basicAn, {width: 140}),
            stretching: true
            })
        }
    }
    render(){
        return(
            <div>
            <span> 单元素动画 </span>
                <TweenOne
                animation={this.state.animation}
                paused={this.state.paused}
                style={{ left: '-20%' }}
                reserve={this.state.reverse}
                className="code-box-shape"/>
              <Button type='primary' onClick={this.changeBoxMovingState.bind(this)}>
              {
                !this.state.stretching ? '拓展' : '收缩' 
              }</Button>
            </div>

        )
    }
}

export default TestAnimating;