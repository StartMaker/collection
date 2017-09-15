import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Table } from 'antd';
import './style.less';


class TableWrap extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    handleTableChange(pagination, filters, sorter) {
        console.log('请求页数', pagination.current);
        this.props.clickOtherPageAction(pagination.current);
    }
    // componentWillUpdate(nextProps, nextState) {
    //     if (nextProps) {};
    // }
    render(){
        const { columns, data, sumPage, title } = this.props; 
        return(
            <div>
                <Table
                className='table-style'
                 pagination={{pageSize: 5,
                    total: sumPage*5,
                    showQuickJumper: true}}
                 columns={columns}
                 dataSource={data}
                 loading={this.props.loading}
                 onChange={this.handleTableChange.bind(this)}/> 
            </div>
        )
    }
}

export default TableWrap;