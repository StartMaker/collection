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
    // handleDoubleClickRowAction(info) {
    //     this.props
    // }
    // componentWillUpdate(nextProps, nextState) {
    //     if (nextProps) {};
    // }
    handleDoubleClickRowAction(info) {
        if ( this.props.handleDoubleClickRow ) {
            this.props.handleDoubleClickRow(info);
        }

    }
    render(){
        const { columns, data, sumPage, title, loading, rowSelection  } = this.props; 
        return(
            <div>
                <Table
                rowKey='uid'
                rowSelection={this.props.rowSelection || null}
                onRowDoubleClick={ this.handleDoubleClickRowAction.bind(this) }
                rowSelection={rowSelection||''}  
                className='table-style'
                 pagination={{pageSize: 5,
                    total: sumPage*5,
                    showQuickJumper: true}}
                 columns={columns}
                 dataSource={data}
                 loading={loading}
                 onChange={this.handleTableChange.bind(this)}/> 
            </div>
        )
    }
}

export default TableWrap;