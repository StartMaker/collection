import React from 'react';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Affix, Button, Anchor } from 'antd';
// import PureRenderMixin from 'react-addons-pure-render-mixin';

// import LocalStore from '../util/localStore';
// import { CITYNAME } from '../config/localStoreKey';
// import * as userInfoActionsFormOtherFile from '../actions/userinfo.js';


//icon
// import '../static/css/style.less';
// import '../static/css/common.less';


// import 'antd/dist/antd.css'
import '../static/css/common.less'

const { Link } = Anchor;
let count = 0;
let timerPage ;
class App extends React.Component { 
    constructor(props, context) {
        super(props, context);
        // this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            initDone: false,
            play: false
        }
    }

    componentDidMount() {
        // let cityName = LocalStore.getItem(CITYNAME);
        // if (cityName == null) {
        //     cityName = '北京';
        // }
        // console.log(cityName);
        this.setState({
            initDone: true
        })

        // this.props.userinfoActions.update({
        //     cityName: cityName
        // })
    }
    componentWillUpdate(preProps, preNext) {
      // if (preProps) {};
      let preToken = preProps.userinfo.token;
      let thisToken = this.props.userinfo.token;
      if(preToken!=thisToken && !!preToken) {
        console.log('自动播放');
        this.Rotation();
      }
      // console.log('preProps.userinfo.token', preProps.userinfo.token);
      // console.log('this.props.userinfo.token', this.props.userinfo.token);
    }
    componentWillUnmount() {
      clearInterval(timerPage);  
    }
    Rotation() {
        let menuList = ['ana', 'handle', 'special', 'Topic'];
        let { play } = this.state;
        let linkG = document.querySelectorAll('.ant-anchor-link-title')[0];
        let linkGHeader = document.querySelectorAll('.ant-anchor-link-title')[1];
        let backHomeNode = document.querySelector('#backHome');
        console.log('linkG', linkG);
        if(play){
            // console.log('clear timer', timer);
            this.setState({play: false});
            clearInterval(timerPage); 
        } else {
            this.setState({play: true});
            clearInterval(timerPage);    
            timerPage = setInterval(()=>{
                count++;
                hashHistory.push(menuList[count%4]);
                setTimeout(()=>{
                  linkGHeader.click();
                }, 3000)
                setTimeout(()=>{
                  linkG.click();
                }, 7000)
                if (count===5) {
                  clearInterval(timerPage); 
                  backHomeNode.click();
                }          
            }, 10000);     
        }
    }
    render() { 
        let { token } = this.props.userinfo;
        let { play } = this.state;
        return ( 
            <div>
            {   this.state.initDone?
                this.props.children:
                 <div>加载中...</div>
            }
            <Affix offsetTop={50} style={{ position: 'absolute', top: '10%', left: '92%'}}>
                <Button type="primary" disabled={!!token?false:true} onClick={this.Rotation.bind(this)}>{!play?'演示':'暂停'}</Button>
                <Button refs='linkG'>
                  <Anchor affix={false}>
                        <Link href="#DataListContainer" title="dataList" />
                  </Anchor>
                 </Button>
                 <Button refs='linkGHeader'>
                  <Anchor affix={false}>
                        <Link href="#header-container" title="header" />
                  </Anchor>
                 </Button>
                <Button >
                    <a id='backHome' href='http://182.150.37.58:81/dist/headPage/index.html'>回到主页</a>
                 </Button>

            </Affix>
            </div>
        ) 
    } 
}
                // <Button><a href='http://182.150.37.58:81/dist/headPage/index.html'>回到主页</a></Button>

                // <Button type="primary" onClick={!!token?this.Rotation()[play?'clear':'start'].bind(this):''}>改变状态</Button>

// export default App;
function mapStateToProps(state){
    return {
        userinfo: state.userinfo
    }
}
// function mapDispatchToProps(dispatch){
//     return {
//         userinfoActions: bindActionCreators(userInfoActionsFormOtherFile, dispatch)
//     }
// } 
export default connect(
    mapStateToProps
)(App);
    // mapDispatchToProps

// <Link to='/'> Back Home</Link><br/>
// var obj = {a:1,b:2}
//  obj.c == null && console.log('123')
//  
//  等同于判断  obj.c === undefined //true  obj.c === null //false