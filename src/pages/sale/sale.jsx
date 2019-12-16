import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import {formateDate} from "../../utils/dateutils";
import api from '../../api'


export default class Sale extends Component {

    constructor(props) {
        super(props)

        this.state = {
            sale:[],//所有销售记录
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
                title: '商品分类',
                dataIndex: 'categoryId',
            },
            {
                title: '买家',
                dataIndex: 'buyer',
            },
            {
                title: '销售量',
                dataIndex: 'saleNum',
            },
            {
                title: '销售时间',
                dataIndex: 'saleDate',
                render: formateDate
            },
            {
                title: '销售人',
                dataIndex: 'saleMan',
                /*this.state.roles.find(role => role._id===role_id).name*/
                /*render:(role_id) =>this.roleNames[role_id]*/
            },
        ]
    }


    getSales = async () => {
        let result = await api.reqSales()
        console.log(result)
        console.log(result.data.status)
        console.log(result.data.data)
        if(result.data.status === 0){
            let {sale,categories} = result.data.data
            this.setState({
                sale,categories
            })
        }
    }


    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getSales()
    }

    render() {
        let {sale} = this.state
        return (
            <Card>
                <Table dataSource={sale} columns={this.columns}
                       bordered={true} rowKey={'_id'} pagination={{defaultPageSize: 7, showQuickJumper: true}}
                       loading={false}>

                </Table>

            </Card>
        )
    }
}