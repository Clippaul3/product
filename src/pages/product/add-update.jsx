import React,{Component} from  'react'
import {Card,Form,Icon,Input,Button,Cascader,Upload} from 'antd'
//产品的增改子路由

let {Item} = Form
let {TextArea} = Input

export default class ProductAddUpdate extends Component{
    render() {
        //指定item布局的配置对象
        const formItemLayout = {
            labelCol:{span:2},//指定左侧标签宽度
            wrapperCol:{span:9}//指定右侧包裹宽度
        }

        let title = (
            <span>
                <a><Icon type={'arrow-left'} style={{fontSize:20}}/></a>
                <span>添加商品</span>
            </span>
        )

        return(
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label={'商品名称'}>
                        <Input placeholder={'请输入商品名称'} />
                    </Item>
                    <Item label={'商品描述'}>
                        <TextArea placeholder={'请输入商品描述'} autosize={{minRows:3,maxRows:10}} />
                    </Item>
                    <Item label={'商品价格'}>
                        <Input type={'number'} placeholder={'请输入商品价格'} addonAfter={'元'} />
                    </Item>
                </Form>
            </Card>
        )
    }
}