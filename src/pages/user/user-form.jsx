import React,{Component} from  'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'


let Item = Form.Item
let Option = Select.Option

/*
* 添加/修改用户的组件
* */

class UserForm extends Component{

    static propTypes = {
        setForm:PropTypes.func.isRequired,//传递form对象的函数
        roles:PropTypes.array.isRequired,
        user:PropTypes.object
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        let {roles} = this.props
        let user = this.props.user || {}
        let {getFieldDecorator}  = this.props.form
        const formItemLayout = {
            labelCol:{span:4},
            wrapperCol:{span:16}
        }
        return(
            <Form {...formItemLayout}>
                <Item label={'用户名'} >
                    {
                        getFieldDecorator('username',{
                            initialValue:user.username,
                            rules:[
                                {required:true,message:'不能为空🙅‍'}
                            ],
                        })(
                            <Input placeholder={'请输入用户名'} />
                        )
                    }

                </Item>
                {
                    user._id ? null :(
                        <Item label={'密码'} >
                            {
                                getFieldDecorator('password',{
                                    initialValue:user.password,
                                    rules:[
                                        {required:true,message:'不能为空🙅‍'}
                                    ],
                                })(
                                    <Input type={'password'} placeholder={'请输入密码'} />
                                )
                            }

                        </Item>
                    )
                }

                <Item label={'手机号'} >
                    {
                        getFieldDecorator('phone',{
                            initialValue:user.phone,
                            rules:[
                                {required:true,message:'不能为空🙅‍'}
                            ],
                        })(
                            <Input placeholder={'请输入手机号'} />
                        )
                    }

                </Item>
                <Item label={'邮箱'} >
                    {
                        getFieldDecorator('email',{
                            initialValue:user.email,
                            rules:[
                                {required:true,message:'不能为空🙅‍'}
                            ],
                        })(
                            <Input placeholder={'请输入邮箱'} />
                        )
                    }

                </Item>
                <Item label={'角色'} >
                    {
                        getFieldDecorator('role_id',{
                            initialValue:user.role_id,
                            rules:[
                                {required:true,message:'不能为空🙅‍'}
                            ],
                        })(
                            <Select>
                                {
                                    roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                                }
                            </Select>
                        )
                    }

                </Item>
            </Form>
        )
    }
}
export default Form.create()(UserForm)