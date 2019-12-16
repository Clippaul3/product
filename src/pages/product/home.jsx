import React, {Component} from 'react'
import {Card, Select, Input, Icon, Button, Table, message, Modal} from 'antd'
import api from '../../api'
import {PAGE_SIZE} from '../../utils/constant'
import StockForm from "./stock-form";
import memoryUtils from "../../utils/memoryUtils";
import ProductAddUpdate from './add-update'

let Option = Select.Option
//product的默认子路由组件

export default class ProductHome extends Component {

    state = {
        products: [],//商品数组
        total: 0,//商品总数量,
        searchName: '',//搜索的关键字
        searchType: 'productName',//默认的搜索类型
        isShowStock:false
    }

    updateStatus = async (productId, status) => {
        let result = await api.updateStatus(productId, status)
        if (result.data.status === 0) {
            message.success('状态切换成功')
            this.getProducts(this.pageNum)
        }
    }

    initColumns = () => {
        //初始化列数据
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) =>
                    '￥' + price
                //当前指定了对应的属性,传入的是对应的属性值
            },
            {
                title: '库存',
                dataIndex: 'store',
                render: (store) =>
                     store + '件'
                //当前指定了对应的属性,传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                render: (product) => {
                    console.log(product)
                    let {_id,status} = product
                    let newStatus = status === 1 ? 0 : 1
                    return (
                        <span>
                            <Button
                                type={'primary'}
                                onClick={() => this.updateStatus(_id, newStatus)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status ===1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 70,
                title: '操作',
                render: (product) => {
                    console.log(product)
                    this._id = product._id
                    return (
                        <span>
                            <a onClick={() => this.props.history.push('/admin/product/detail', product)}>详情</a>
                            <a onClick={()=>this.props.history.push('/admin/product/add-update',product)}>修改</a>
                            <a onClick={()=>this.showStock(product)}>进货</a>
                            <a>出货</a>
                        </span>
                    )
                }
            }
        ]
    }

    /*获取指定页码的列表数据显示*/
    getProducts = async (pageNum) => {
        this.pageNum = pageNum//保存页码
        let {searchName, searchType} = this.state
        let result
        if (searchName) {
            //如果搜索关键字有值,就要进行搜索分页
            result = await api.searchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
        } else {
            //一般分页
            result = await api.reqProducts(pageNum, PAGE_SIZE)
        }
        if (result.data.status === 0) {
            //取出分页数据,更新状态,显示分页列表
            console.log('Month')
            console.log(result)
            let {total, list} = result.data.data
            this.setState({
                total,
                products: list
            })
        }
    }

    getMonth = ()=>{
        this.month = new Date().getMonth() + 1
    }

    addStock = async()=>{
        //收集输入数据
        this.form.validateFields(async (error,values)=>{
            if(!error){
                let {product,desc,categoryIds,stockNum,price,store,imgs,detail,_id} = values
                store = store * 1
                let pCategoryId, categoryId
                if (categoryIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                }else{
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                let stockDate = new Date() * 1
                let dealMan = memoryUtils.user.username
                this.form.resetFields()
                let stock = {product,categoryId,pCategoryId,stockNum,stockDate,dealMan}
                stockNum = stockNum * 1
                let result = await api.addStock(stock)

                console.log(result)
                if(result.data.status === 0){
                    store = store + stockNum
                    let name = product
                    let product2 = {_id,name,desc,categoryId,pCategoryId,price,store,imgs,detail}
                    let result2 = await api.addOrUpdateProduct(product2)
                    console.log(result2)
                    if(result2.data.status === 0){
                        message.success('进货成功')
                        this.setState({isShowStock:false})
                        this.getProducts(1)
                    }
                }
            }
        })
    }
    showStock = (product)=>{
        this.setState({isShowStock:true})
        this.product = product//保存product
    }

    componentWillMount() {
        this.initColumns()
        this.getMonth()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        let {products, total, searchName, searchType,isShowStock} = this.state

        let title = (<span><Select value={searchType} style={{width: 140}}
                                   onChange={value => this.setState({searchType: value})}>
            <Option value={'productName'}>按名称搜索</Option>
            <Option value={'productDesc'}>按描述搜索</Option>
        </Select>
        <Input placeholder={'请输入关键字'} style={{width: 200, margin: '0 15px'}} value={searchName}
               onChange={event => this.setState({searchName: event.target.value})}/>
        <Button type={'primary'} onClick={() => this.getProducts(1)}>搜索</Button>
        </span>)
        let extra = (<Button type={'primary'} onClick={()=>this.props.history.push('/admin/product/add-update')}><Icon type={'plus'}/>添加商品</Button>)

        return (
            <Card title={title} extra={extra}>
                <Table rowKey={'_id'} dataSource={products} columns={this.columns} bordered={true}
                       pagination={{
                           defaultPageSize: PAGE_SIZE, showQuickJumper: true, total: total,
                           onChange: (pageNum) => {
                               this.getProducts(pageNum)
                           }
                       }}
                >
                </Table>
                <Modal title={'进货'} visible={isShowStock}
                       onOk={this.addStock}
                       onCancel={() => {
                           this.form.resetFields()
                           this.setState({isShowStock: false})
                       }}
                >
                    <StockForm setForm={form =>this.form = form} product={this.product}></StockForm>
                </Modal>
            </Card>
        )
    }
}