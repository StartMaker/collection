import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Table } from 'antd';
import PropTypes from 'prop-types';

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
    handleDoubleClickRowAction(info) {
        if ( this.props.handleDoubleClickRow ) {
            this.props.handleDoubleClickRow(info);
        }
    }
    onShowSizeChange(...args) {
        this.props.onShowSizeChange(...args);
    }
    render(){
        const { columns, data, loading, rowSelection, pagination } = this.props; 

        return(
            <div id='DataListContainer'>
                <Table
                rowKey='uid'
                onRowDoubleClick={ this.handleDoubleClickRowAction.bind(this) }
                rowSelection={rowSelection||''}  
                className='table-style'
                pagination={Object.assign(pagination, {onShowSizeChange: this.onShowSizeChange.bind(this)}) }
                 columns={columns}
                 dataSource={data}
                 loading={loading}
                 onChange={this.handleTableChange.bind(this)}/> 
            </div>
        )
    }
}
TableWrap.defaultProps = {
    data: [],
    pagination: {},
}
TableWrap.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array,
    title: PropTypes.string,
    loading: PropTypes.bool,
    rowSelection: PropTypes.object,
}
export default TableWrap;