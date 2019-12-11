import React,{Component} from  'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'

let Item = Form.Item

class AddForm extends Component{

    static propTypes = {
        setForm:PropTypes.func.isRequired,//传递form对象的函数
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {

        let {getFieldDecorator}  = this.props.form
        const formItemLayout = {
            labelCol:{span:4},
            wrapperCol:{span:16}
        }
        return(
            <Form>
                <Item label={'角色名称'} {...formItemLayout}>
                    {
                        getFieldDecorator('roleName',{
                            initialValue:'',
                            rules:[
                                {required:true,message:'不能为空🙅‍'}
                            ],
                        })(
                            <Input placeholder={'请输入角色名称'} />
                        )
                    }

                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)