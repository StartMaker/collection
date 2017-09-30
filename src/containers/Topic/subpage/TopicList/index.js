import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Card } from 'antd';

import TopicItemWrap from '../../../../components/TopicItemWrap';
import getTopicList from '../../../../fetch/topicList';

import './style.less';


class TopicList extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
          data: []
        }
    }
    componentWillMount() {
      this.getTopicListAction();
    }
    getTopicListAction() {
      let { token } = this.props;
      let result = getTopicList('', token);
      result.then(resp=>{
        if(resp.ok){
          return resp.json();
        }
      }).then(data=>{

        this.setState({data});

      })
    }
    render(){
      const { data } = this.state;
        return(
            <div id='TopicList-wrap'>
              <TopicItemWrap data={data} />
            </div>

        )
    }
}

export default TopicList;