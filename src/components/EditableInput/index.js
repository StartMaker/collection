/* 
* @Author: fxy
* @Date:   2017-09-12 13:33:18
* @Last Modified by:   anchen
* @Last Modified time: 2017-09-12 17:35:27
*/

import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Input, Icon  } from 'antd'

import './style.less';

class EditableInput extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            value: this.props.value,
            ediable: false
        }
    }
    handleChange(e) {
        const value = e.targe.value;
        this.setState({value})
    }
    check() {
        this.setState({ediable: false});
        if (this.props.onChange) {
          this.props.onChange(this.state.value);
        }
    }
    edit() {
        this.setState({ediable: true})
    }
    componentDidUpdate() {   // 开门
        this.setState({
            value: this.props.value
        })
    }
    render(){
        const { value, ediable } = this.state;
        return(
        <div className='editable-cell'>
            {
                ediable?
                <div className='editable-cell-input-wrapper'>
                    <Input 
                    value={value}
                    className='editable-input'
                    onChange={this.handleChange.bind(this)} 
                    onPressEnter={this.check.bind(this)} />
                    <Icon type='check' className='editable-cell-icon-check' onClick={this.check.bind(this)} />
                </div>
                :
                <div className='editable-cell-text-wrapper'>
                { value || '' }
                <Icon type='edit' className='editable-cell-icon editable-cell-icon-check' onClick={this.edit.bind(this)} />
                </div>
            }
        </div>
        )
    }
}

export default EditableInput;