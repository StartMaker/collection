import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Input, Icon  } from 'antd';

import './style.less';

class  EditableCell extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            ediable: this.props.ediable ||  false,  // 是否处在编辑状态
            value: this.props.value 
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
          this.setState({ editable: nextProps.editable });
          if (nextProps.editable) {
            this.cacheValue = this.state.value;
          }
        }
        if (nextProps.status && nextProps.status !== this.props.status) {
          if (nextProps.status === 'save') {
            this.props.onChange(this.state.value);
          } else if (nextProps.status === 'cancel') {
            this.setState({ value: this.cacheValue });
            this.props.onChange(this.cacheValue);
          }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.editable !== this.state.editable ||
               nextState.value !== this.state.value;
    }
    handleChange(e) {
        const value = e.target.value;
        this.setState({ value });
    }
    render() {
    const { value, editable } = this.state;
    return (
      <div>
        {
          editable ?
            <div>
              <Input
                value={value}
                onChange={e => this.handleChange(e)}
              />
            </div>
            :
            <div className="editable-row-text">
              {value.toString() || ' '}
            </div>
        }
      </div>
    );
  }
}

export default EditableCell ;