import  React from 'react';
import { Link } from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Input, Icon, Tag, message } from 'antd';



import './style.less';
var formatTags = [];
class TagInput extends React.Component{
    constructor(props, context){
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            value: '',
            editable: false,
            tags: [],
        }
    }
    // 挂载组件之前
    componentWillMount(){
        let { initTags } = this.props;
        if (!initTags) {
            this.setState({editable:true})
        } else {
            this.setState({tags: [].concat(initTags)})
        }
    }
    // 删除tag
    handleDeleteTag(e){
        // e.preventDefault();
        let deleteObj =  e.target.previousSibling.innerText;
        let { tags } = this.state;
        tags = tags.filter((item, index)=> {
            return item != deleteObj;
        });
        this.setState({tags});
    }
    // 获取父级组件传过来的默认Tags
                    // <span className='event-tag-text'>{item}</span>
                    // <Icon type='close' tilte='delete this tag' size='small' onClick={e=>{this.handleDeleteTag(e)}}/>
    // 受控组件
    handleChangeValue(e) {
        let value = e.target.value;
        this.setState({value});
    }
    // 确认输入
    handleCheck() {
        // 隐藏输入框
        this.setState({editable: false});
        this.props.onChangeInputStyle(true);
        // 将输入内容推入标签栏
        this.handlePressEnter();
        // 将标签栏的内容传递给父组件
        this.props.handlePopValue(this.state.tags);
    }
    // 编辑标签
    handleEdit() {
        this.props.onChangeInputStyle(false);
        this.setState({editable: true, value: ''})
    }
    // 生成标签
    handlePressEnter() {
        let { value, tags } = this.state;
        if(!value){return}
        if(tags.indexOf(value) !=-1 ){
            message.error('输入重复');
            return;
        }
        tags.push(value);
        this.setState({
            tags,
            value: '',
        })
    }
    render(){
        const { editable, value, tags } = this.state;
        const { iconStyle, tagColor } = this.props;
        return(
            <div id='taginput-wrap'>
                <p>{!!tags ? tags.map((item, index) =>{
                        return (
                            <span className='event-tag-warp' key={index}>
                                <Tag closable onClose={e=>{this.handleDeleteTag(e)}} color={tagColor}>{item}</Tag>
                            </span>
                        )
                    }) : ''
                }</p>
                {
                    editable ? <p className='taginput-text-wrap'>
                    <Icon title='Add' type='check' className='taginput-edit-icon' onClick={this.handleCheck.bind(this)}/>
                    <Input
                    onPressEnter={this.handlePressEnter.bind(this)}
                    prefix={<Icon type={iconStyle} style={{ fontSize: 13 }} />}
                    value={value}
                    onChange={this.handleChangeValue.bind(this)} />
                     </p> : <Icon title='Add new region' className='taginput-edit-icon' type='edit' onClick={this.handleEdit.bind(this)} /> 
                }

            </div>

        )
    }
}

export default TagInput;