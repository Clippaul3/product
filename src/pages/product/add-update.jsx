import React, {Component} from 'react'
import {Card, Form, Icon, Input, Button, Cascader, Upload} from 'antd'
//产品的增改子路由
import api from '../../api'
import product from "./product";
import PicturesWall from "./pictures-wall";
import {instanceOf} from "prop-types";

let {Item} = Form
let {TextArea} = Input

class ProductAddUpdate extends Component {

    state = {
        options: [],
    }

    constructor(props){
        super(props)

        //创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
    }

    initOptions = async (categories) => {
        //根据categories生成options数组然后更新options状态
        let options = categories.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }))

        //如果是一个二级分类商品的更新
        let {isUpdate,product} = this
        let {pCategoryId,categoryId} = product
        if(isUpdate && pCategoryId != '0'){
            //获取对应的二级分类列表
            let subCategories = await this.getCategories(pCategoryId)
            //生成二级下拉列表options
            let childOptions = subCategories.map((c)=>({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            //找到当前商品对应的一级option对象
            let targetOption = options.find(option => option.value === pCategoryId)

            //关联到对应的一级option
            targetOption.children = childOptions
        }

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

    submit = () => {
        //进行整体表单验证,如果通过,才能发送请求
        this.props.form.validateFields((error, values) => {

            if (!error) {
                let imgs = this.pw.current.getImgs()
                console.log('submit imgs   '+imgs)
                console.log(Object.prototype.toString.call(imgs))
            }
        })
    }

    validatorPrice = (rule, value, callback) => {
        //验证价格
        if (value * 1 >= 0) {
            callback()
        } else {
            callback('价格必须不小于0')
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
        let product = this.props.location.state
        this.isUpdate = !!product//强制转换成boolean类型数据,是否是更新的标识
        this.product = product || {}//保存商品,使其不为undefined,阻止报错
    }

    componentDidMount() {

        this.getCategories('0')
    }

    render() {
        let {isUpdate, product} = this
        console.log(product)
        let {pCategoryId, categoryId,imgs} = product
        console.log('第一个'+imgs)
        //用来接收级联分类Id的数组
        let categoryIds = []
        if (isUpdate) {
            //商品是一级分类
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                //商品是二级分类
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        //指定item布局的配置对象
        const formItemLayout = {
            labelCol: {span: 2},//指定左侧标签宽度
            wrapperCol: {span: 9}//指定右侧包裹宽度
        }

        let title = (
            <span>
                <a onClick={() => this.props.history.goBack()}><Icon type={'arrow-left'} style={{fontSize: 20}}/></a>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        let {getFieldDecorator} = this.props.form

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label={'商品名称'}>
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [
                                    {required: true, message: '必须输入商品名称'}
                                ]
                            })(
                                <Input placeholder={'请输入商品名称'}/>
                            )
                        }
                    </Item>
                    <Item label={'商品描述'}>
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [
                                    {required: true, message: '必须输入商品描述'}
                                ]
                            })(
                                <TextArea placeholder={'请输入商品描述'} autoSize={{minRows: 3, maxRows: 10}}/>
                            )
                        }
                    </Item>
                    <Item label={'商品价格'}>
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    {required: true, message: '必须输入商品价格,且不小于0'},
                                    {validator: this.validatorPrice}
                                ]
                            })(
                                <Input type={'number'} placeholder={'请输入商品价格'} addonAfter={'元'}/>
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
                                />
                            )
                        }

                    </Item>
                    <Item label={'商品图片'}>
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label={'商品详情'}>
                        <Input type={'number'} placeholder={'请输入商品价格'} addonAfter={'元'}/>
                    </Item>
                    <Item>
                        <Button type={'primary'} onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)

/*
* 父组件调用子组件的方法:在父组件中通过ref得到子组件标签对象（也就是组件对象）,调用其方法
* */