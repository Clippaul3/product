import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import {formateDate} from "../../utils/dateutils";
import api from '../../api'
import {PAGE_SIZE} from "../../utils/constant";

export default class Stock extends Component {

    constructor(props) {
        super(props)

        this.state = {
            stocks:[],//所有进货列表
            categories:[],//所有分类
        }
    }

    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'product',
            },
            {
                title: '种类',
                dataIndex: 'categoryId',
                render:(categoryId) =>this.categoryNames[categoryId]
            },
            {
                title: '进货量',
                dataIndex: 'stockNum',
            },
            {
                title: '进货时间',
                dataIndex: 'stockDate',
                render: formateDate
            },
            {
                title: '处理人',
                dataIndex: 'dealMan',
                /*this.state.roles.find(role => role._id===role_id).name*/
                /*render:(role_id) =>this.roleNames[role_id]*/
            },
        ]
    }

    initCategoryNames = (categories)=>{
        //根据categories数组生成categories对应的种类名称
        let categoryNames = categories.reduce((pre,category)=>{
            pre[category._id] = category.name
            return pre
        })
        this.categoryNames = categoryNames
        console.log(categoryNames)
    }


    getStocks = async () => {
        let result = await api.reqStock()
        console.log(result)
        if(result.data.status === 0){
            let {stocks,categories} = result.data.data
            this.initCategoryNames(categories)
            this.setState({
                stocks,categories
            })
        }
    }


    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getStocks()
    }

    render() {
        let {stocks} = this.state

        return (
            <Card>
                <Table dataSource={stocks} columns={this.columns}
                       bordered={true} rowKey={'_id'}
                       pagination={{
                           defaultPageSize: 7, showQuickJumper: true
                           }}
                       loading={false}>


                </Table>
            </Card>
        )
    }
}