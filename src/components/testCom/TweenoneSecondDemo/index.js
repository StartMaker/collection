import  React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import QueueAnim from 'rc-queue-anim';
import { Button, Table } from 'antd';
import TweenOne from 'rc-tween-one';

class TestAnimating extends React.Component{
  constructor(props, context){
    super(props, context)
    this.state = {
      show: true,
      items: [
        <li key="0">{Date.now()}</li>,
        <li key="1">{Date.now()}</li>,
        <li key="2">{Date.now()}</li>
      ],
    }
  }
  onClick() {
    this.setState({
      show: !this.state.show,
    });
  }

  onAdd() {
    let items = this.state.items;
    items.push(<li key={Date.now()}>{Date.now()}</li>);
    this.setState({
      show: true,
      items,
    });
  }

  onRemove() {
    let items = this.state.items;
    items.splice(items.length - 1, 1);
    this.setState({
      show: true,
      items,
    });
  }

  render() {
    return (
      <div className="queue-demo">
        <p className="buttons">
          <Button type="primary" onClick={this.onClick.bind(this)}>切换</Button>
          <Button onClick={this.onAdd.bind(this)} style={{ marginLeft: 10 }}>添加</Button>
          <Button onClick={this.onRemove.bind(this)} style={{ marginLeft: 10 }}>删除</Button>
        </p>
        <div className="demo-content">
          <div className="demo-thead" key="a">
            <ul>
              <li />
              <li />
              <li />
            </ul>
          </div>
          <div className="demo-tbody" key="b">
            <QueueAnim component="ul" type={['right', 'left']} leaveReverse>
            <Table
            />
            </QueueAnim>
          </div>
        </div>
      </div>
    );
  }
}
              // {this.state.show ? this.state.items : null}

export default TestAnimating;
