import React from 'react';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PureRenderMixin from 'react-addons-pure-render-mixin'



import '../static/css/common.less'

let count = 0;
let timerPage ;
class App extends React.Component { 
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            initDone: false,
        }
    }

    componentDidMount() {

        this.setState({
            initDone: true
        })

    }

    render() { 
        return ( 
            <div>
            {   this.state.initDone?
                this.props.children:
                 <div>加载中...</div>
            }
            </div>
        ) 
    } 
}
export default App
            // <Affix offsetTop={50} style={{ position: 'absolute', top: '10%', left: '92%'}}>
            //     <Button type="primary" disabled={!!token?false:true} onClick={this.Rotation.bind(this)}>{!play?'演示':'暂停'}</Button>
            //     <Button refs='linkG'>
            //       <Anchor affix={false}>
            //             <Link href="#DataListContainer" title="dataList" />
            //       </Anchor>
            //      </Button>
            //      <Button refs='linkGHeader'>
            //       <Anchor affix={false}>
            //             <Link href="#header-container" title="header" />
            //       </Anchor>
            //      </Button>
            //     <Button >
            //         <a id='backHome' href='http://182.150.37.58:81/dist/headPage/index.html'>回到主页</a>
            //      </Button>

            // </Affix>
                // <Button><a href='http://182.150.37.58:81/dist/headPage/index.html'>回到主页</a></Button>

                // <Button type="primary" onClick={!!token?this.Rotation()[play?'clear':'start'].bind(this):''}>改变状态</Button>

// export default App;

// function mapDispatchToProps(dispatch){
//     return {
//         userinfoActions: bindActionCreators(userInfoActionsFormOtherFile, dispatch)
//     }
// } 
    // mapDispatchToProps

// <Link to='/'> Back Home</Link><br/>
// var obj = {a:1,b:2}
//  obj.c == null && console.log('123')
//  
//  等同于判断  obj.c === undefined //true  obj.c === null //false