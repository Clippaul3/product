import React,{Component} from  'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'

let Item = Form.Item
let Option = Select.Option

class AddCategory extends Component{

    static propTypes = {
        categorys:PropTypes.array.isRequired,//一级分类数组
        parentId:PropTypes.string.isRequired,//父分类id
        setForm:PropTypes.func.isRequired,//传递form对象的函数
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {

        let {getFieldDecorator}  = this.props.form
        let {categorys,parentId} = this.props
        return(
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId',{
                            initialValue:parentId
                        })(
                            <Select>
                                <Option value={'0'}>一级分类</Option>
                                {
                                    categorys.map((c)=><Option value={c._id}>{c.name}</Option>)
                                }
                            </Select>
                        )
                    }

                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue:'',
                            rules:[
                                {required:true,message:'不能为空🙅‍'}
                            ],
                        })(
                            <Input placeholder={'请输入分类名称'} />
                        )
                    }

                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddCategory)