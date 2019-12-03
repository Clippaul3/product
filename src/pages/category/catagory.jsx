import React, {Component} from 'react'
import {Card, Table, Button, Icon, message, Modal} from 'antd'
import categories from '../../api'
import AddCategory from "./addCategory";
import UpdateCategory from './updateCategory'

export default class Category extends Component {

    state = {
        categorys: [],//以及分类列表
        columns: [],
        loading: false,
        parentId: '0',//当前需要显示的分类列表的parentId
        parentName: '',//当前显示的名字
        subCategorys: [],
        showStatus: 0,//标识确认框添加或更新是否显示
    }

    getCategories = async (parentId) => {

        //在发请求前显示loading
        this.setState({loading: true})

        parentId = parentId || this.state.parentId

        let result = await categories.reqCategories(parentId)

        //请求完成恢复loading
        this.setState({loading: false})

        if (result.data.status === 0) {
            //取出分类列表数据 可能是1级或者2级
            let categorys = result.data.data//获取到数据
            //更新状态
            if (parentId === '0') {
                //更新一级分类列表
                this.setState({categorys})
            } else {
                //更新二级分类
                this.setState({subCategorys: categorys})
            }
        } else {
            message.error("没获取到")
        }
    }

    showSubCategorys = (category) => {
        console.log(category._id)
        //显示指定一级分类列表对象的二级列表
        //更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            //回调函数会在状态更新且重新render后执行
            console.log(this.state.parentId)
            //获取二级分类列表
            this.getCategories()
        })

    }

    showFirstCategorys = () => {
        /*显示一级分类列表*/
        this.setState({parentId: '0'}, () => this.getCategories())
    }

    /*显示添加确认框*/
    showAdd = ()=>{
        this.setState({showStatus:1})
    }

    /*显示更新确认框*/
    showUpdate = (category)=>{
        //保存分类对象
        this.category = category
        console.log(this.category.name)
        //更新状态
        this.setState({showStatus:2})
    }

    handleCancel = ()=>{
        this.setState({showStatus:0})
        //清除输入数据
        this.form.resetFields()
    }

    /*添加分类*/
    addCategory = ()=>{
        this.form.validateFields(async (err,values)=>{
            if(!err){
                //1.隐藏确认框
                this.setState({showStatus:0})
                //2.收集数据并提交添加分类请求
                let {parentId,categoryName} = this.form.getFieldsValue()
                this.form.resetFields()
                let result = await categories.addCategory(categoryName,parentId)
                //3.重新获取分类列表显示
                if(result.data.status === 0){
                    if(parentId === this.state.parentId){
                        this.getCategories()
                    }else if(parentId === '0'){
                        //重新获取一级分类列表,但不需要显示一级列表
                        this.getCategories()
                    }
                }
            }
        })
    }

    /*更新分类*/
    updateCategory = ()=>{
        /*
        * 1.关闭窗口
        * 2.发请求更新
        * 3.重新渲染页面
        * */
        //表单验证通过
        this.form.validateFields(async (err,values)=>{
            if(!err){
                this.setState({showStatus:0})
                //准备数据
                let categoryId = this.category._id
                let categoryName = values.categoryName
                //清除输入数据
                this.form.resetFields()
                let result = await categories.updateCategory({categoryId,categoryName})
                if(result.data.status === 0){
                    this.getCategories()
                }
            }
        })
    }

    componentWillMount() {
        const columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                width: '30%',
                dataIndex: '',
                key: 'cao',
                render: (category) => (<span ><a onClick={()=>this.showUpdate(category)}>修改分类</a>&nbsp;&nbsp;&nbsp;&nbsp;
                        {this.state.parentId === '0' ?
                            <a onClick={() => this.showSubCategorys(category)}>查看子分类</a> : ''}
                </span>
                ),
            }
        ]

        this.setState({columns})
        this.category = {}
    }


    /*
    * 发异步ajax请求
    * */
    componentDidMount() {

        this.getCategories()
    }

    render() {

        let {parentId, categorys, subCategorys, columns, loading, parentName, showStatus} = this.state

        //读取指定的分类

        let title = parentId === '0' ? '一级分类列表' : (
            <span><a onClick={this.showFirstCategorys}>一级分类列表</a>👉<span>{parentName}</span></span>)
        let extra = (<Button type="primary" onClick={this.showAdd}><Icon type="plus"/><span>添加</span></Button>)
        return (
            <Card title={title} extra={extra} style={{width: 1240, height: 621}}>
                <Table dataSource={parentId === '0' ? categorys : subCategorys} columns={columns}
                       bordered={true} rowKey={'_id'} pagination={{defaultPageSize: 7, showQuickJumper: true}}
                       loading={loading}>

                </Table>
                <Modal
                    title="添加分类"
                    visible={showStatus === 1 ? true : false}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddCategory categorys={categorys} parentId={parentId} setForm={(form)=>{this.form = form}}/>
                </Modal>

                <Modal
                    title="修改分类"
                    visible={showStatus === 2 ? true : false}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateCategory categoryName={this.category.name} setForm = {(form)=>{this.form = form}}/>
                </Modal>
            </Card>
        )
    }
}