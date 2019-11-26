import React,{Component} from  'react'
import logo1 from './images/sxc.jpg'
import './login.css'
import {Form, Button, Icon, Checkbox, Input,message} from 'antd'
import FormItem from "antd/es/form/FormItem";
import ajax from '../../api/index'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {Redirect} from 'react-router-dom'

class Login extends Component{

    handleSubmit = (e)=>{
        e.preventDefault()
        //获取form对象
        let {form} = this.props

        //对所有表单字段进行验证
        form.validateFields(async (errors, values) => {
            if(!errors){
                //校验成功,提交登录的ajax请求
                let {username,password} = values
                try{
                    let response = await ajax.reqLogin(username,password)
                    let result = response.data
                    if(result.status === 0){
                        //登录成功
                        message.success('成功登录')

                        let user = result.data
                        //保存user
                        memoryUtils.user = user
                        //保存到local
                        storageUtils.saveUser(user)
                        //跳转到管理界面
                        this.props.history.replace('/admin')
                    }else{
                        //登录失败
                        message.error(result.msg)
                    }
                    e.preventDefault()
                }catch (e) {
                    message.error('错了')
                    e.preventDefault()
                }

                e.preventDefault()
            }else{
                /*自动提示失败并且阻止提交的默认行为*/
                //阻止页面提交
                e.preventDefault()
            }
        })


    }

    render() {
        //判断用户是否登录,若已登录,自动跳转登录界面
        let {user} = memoryUtils
        if(user && user._id){
            return <Redirect to={'/admin'}/>
        }

        let {form} = this.props
        let {getFieldDecorator} = form
        return(
            <div className={'loginPage'}>
                <div className={'login_head_div'}>
                    <header className={'login_head'}>
                        <img src={logo1} alt={''}/>
                        <h1>"儒雅随和"后台仓库管理系统--基于React的后台管理系统</h1>
                    </header>
                </div>
                <div className={'login_content'}>
                    <h1>用户登录</h1>
                    <Form onSubmit={this.handleSubmit} className={'login_form'}>
                        <Form.Item>
                            {
                                getFieldDecorator('username',{
                                    rules:[
                                        {required:true,message:'必须输入哦亲'},
                                        {max:20,message: '最大长度不能超过20个字符哦'},
                                        {min:4,message:'最少四位哦'},
                                        {pattern:/^[a-zA-Z0-9_@.]+$/ , message:'有非法字符哦'}
                                        ]
                                })(
                                    <Input
                                        prefix={<Icon type={'reddit'} style={{color:'hotpink'}}/>}
                                        placeholder={'请输入您的用户名哦'}
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password',{
                                    rules:[
                                        {required:true,message:'必须输入哦亲'},
                                        {max:20,message: '最大长度不能超过20个字符哦'},
                                        {min:4,message:'最少四位哦'},
                                        {pattern:/^[a-zA-Z0-9_/@#$%^&*()?.]+$/ , message:'有非法字符哦'}
                                    ]
                                }
                                )(
                                    <Input
                                        prefix={<Icon type={"eye-invisible"} style={{color:'hotpink'}}/>}
                                        type={'password'}
                                        placeholder={'请输入您的密码哟'}
                                        onChange={''}
                                    />
                                )
                            }

                        </Form.Item>
                        <Form.Item>
                            <Button type={'primary'} htmlType={'submit'} className={'login-button'}>
                                登录冲冲冲!!
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}

const  WrapLoginPage = Form.create()(Login)
export default WrapLoginPage