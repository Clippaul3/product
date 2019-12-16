import React, {Component} from 'react'
import {Form, Select, Input, Cascader} from 'antd'
import PropTypes from 'prop-types'
import api from "../../api";
import PicturesWall from "./pictures-wall";
import RichTextEdit from "./rich-text-edit";


let Item = Form.Item
let Option = Select.Option

/*
* 添加/修改用户的组件
* */

class StockForm extends Component {

    state = {
        options: [],
    }
    constructor(props) {
        super(props)

        //创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.rte = React.createRef()
    }

    static propTypes = {
        setForm: PropTypes.func.isRequired,//传递form对象的函数
        product: PropTypes.object.isRequired,//传递product对象
    }

    initOptions = async (categories) => {
        //根据categories生成options数组然后更新options状态
        let options = categories.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }))
        this.setState({options})
    }

    getCategories = async (parentId) => {
        //获取一二级分类列表并显示
        let result = await api.reqCategories(parentId)
        if (result.data.status === 0) {
            let categories = result.data.data
            //如果是一级分类列表
            if (parentId === '0') {
                this.initOptions(categories)
            } else {
                //二级列表
                return categories//返回二级列表,当前async函数返回的promise就会成功且value为categories
            }
        }
    }

    loadData = async (selectOptions) => {
        //当选择某一个列表项加载下一级列表的回调
        let targetOption = selectOptions[0]

        //显示loading效果
        targetOption.loading = true

        //根据选中的分类,请求获取下一级分类
        let subCategories = await this.getCategories(targetOption.value)

        targetOption.loading = false
        if (subCategories && subCategories.length > 0) {

            //生成一个二级列表的Options
            let cOptions = subCategories.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            //关联到当前options上
            targetOption.children = cOptions
        } else {
            //当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }

        this.setState({
            options: [...this.state.options]
        })
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    componentDidMount() {
        this.getCategories('0')
    }

    render() {
        let {getFieldDecorator} = this.props.form
        let {product} = this.props
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 16}
        }
        let {categoryId,pCategoryId,imgs,detail} = product
        console.log(product)
        let categoryIds = []
        //商品是一级分类
        if (pCategoryId === '0') {
            categoryIds.push(categoryId)
        } else {
            //商品是二级分类
            categoryIds.push(pCategoryId)
            categoryIds.push(categoryId)
        }
        return (
            <Form {...formItemLayout}>
                <Item label={'商品编号'}>
                    {
                        getFieldDecorator('_id', {
                            initialValue: product._id,
                            rules: [
                                {required: true, message: '不能为空🙅‍'}
                            ],
                        })(
                            <Input placeholder={'请输入商品名'} disabled={true}/>
                        )
                    }

                </Item>
                <Item label={'商品名称'}>
                    {
                        getFieldDecorator('product', {
                            initialValue: product.name,
                            rules: [
                                {required: true, message: '不能为空🙅‍'}
                            ],
                        })(
                            <Input placeholder={'请输入商品名'} disabled={true}/>
                        )
                    }

                </Item>
                <Item label={'商品描述'}>
                    {
                        getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [
                                {required: true, message: '不能为空🙅‍'}
                            ],
                        })(
                            <Input placeholder={'请输入商品名'} disabled={true}/>
                        )
                    }

                </Item>
                <Item label={'商品分类'}>
                    {
                        getFieldDecorator('categoryIds', {
                            initialValue: categoryIds,
                            rules: [
                                {required: true, message: '必须选择商品分类'},
                            ]
                        })(
                            <Cascader
                                options={this.state.options}
                                loadData={this.loadData}
                                disabled={true}
                            />
                        )
                    }

                </Item>
                <Item label={'价格'}>
                    {
                        getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [
                                {required: true, message: '不能为空🙅‍'}
                            ],
                        })(
                            <Input placeholder={'请输入商品名'} disabled={true}/>
                        )
                    }

                </Item>
                <Item label={'库存剩余'}>
                    {
                        getFieldDecorator('store', {
                            initialValue: product.store,
                            rules: [
                                {required: true, message: '不能为空🙅‍'}
                            ],
                        })(
                            <Input type={'number'} placeholder={'请输入商品名'} disabled={true}/>
                        )
                    }

                </Item>
                <Item label={'商品图片'}>
                    {
                        getFieldDecorator('imgs',{
                            initialValue:product.imgs
                        })(
                            <PicturesWall ref={this.pw} imgs={imgs}/>
                        )
                    }

                </Item>
                <Item label={'商品详情'} labelCol={{span: 2}} wrapperCol={{span: 20}}>
                    {
                        getFieldDecorator('detail',{
                            initialValue:product.detail
                        })(
                            <RichTextEdit ref={this.rte} detail={detail}/>
                        )
                    }

                </Item>
                <Item label={'进货量'}>
                    {
                        getFieldDecorator('stockNum', {
                            initialValue: '',
                            rules: [
                                {required: true, message: '不能为空🙅‍'}
                            ],
                        })(
                            <Input type={'number'} placeholder={'请输入商品名'} addonAfter={'件'}/>
                        )
                    }

                </Item>
            </Form>
        )
    }
}

export default Form.create()(StockForm)