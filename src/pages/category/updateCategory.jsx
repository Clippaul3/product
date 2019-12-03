import React,{Component} from  'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'

let Item = Form.Item
let Option = Select.Option

class UpdateCategory extends Component{

    static propTypes = {
        categoryName:PropTypes.string.isRequired,
        setForm : PropTypes.func.isRequired,

    }

    componentWillMount() {
        //将form对象通过setForm传递给父组件
        this.props.setForm(this.props.form)
    }

    render() {

        let {getFieldDecorator}  = this.props.form
        let {categoryName} = this.props

        return(
            <Form>
                <Item>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue:categoryName,
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
export default Form.create()(UpdateCategory)