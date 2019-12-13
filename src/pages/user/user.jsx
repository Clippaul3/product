import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import {formateDate} from "../../utils/dateutils";
import api from '../../api'
import UserForm from "./user-form";

export default class User extends Component {

    constructor(props) {
        super(props)

        this.state = {
            users: [],//所有用户列表
            isShow: false,
            roles:[],//所有角色的列表
        }
    }

    initColumns = () => {
        this.columns = [
            {
                title: '名字',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                /*this.state.roles.find(role => role._id===role_id).name*/
                render:(role_id) =>this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <a onClick={()=>this.showUpdate(user)}>修改</a>&nbsp;
                        <a onClick={()=>this.deleteUser(user)}>删除</a>
                    </span>
                )
            }
        ]
    }

    initRoleNames = (roles)=>{
        //根据roles数组生成包含所有角色名的对象,属性名用角色id值
        let roleNames = roles.reduce((pre,role)=>{
            pre[role._id] = role.name
            return pre
        },{})
        //保存
        this.roleNames = roleNames
    }

    getUsers = async () => {
        let result = await api.reqUsers()
        console.log(result)
        if(result.data.status === 0){
            let {users,roles} = result.data.data
            this.initRoleNames(roles)
            this.setState({
                users,roles
            })
        }
    }

    addOrUpdateUser = async () => {
        //收集输入数据
        let user = this.form.getFieldsValue()
        this.form.resetFields()
        //如果是更新需要给user指定_id属性
        if(this.user){
            user._id = this.user._id
        }

        let result = await api.addOrUpdateUser(user)
        console.log(result)
        if(result.data.status === 0){
            message.success((this.user ? '修改' : '创建')+'用户成功')

            this.getUsers()
        }
        this.setState({isShow:false})
    }

    deleteUser = (user)=>{
        Modal.confirm({
            title:`确定删除${user.username}吗?`,
            content:'点击确定删除,点击取消返回',
            onOk: async ()=>{
                let result = await api.deleteUser(user._id)
                if(result.data.status === 0){
                    message.success(`删除${user.username}成功!`)
                    this.getUsers()
                }
            }
        })
    }

    showUpdate = (user)=>{
        this.user = user//保存user
        this.setState({isShow:true})
    }

    showAdd = ()=>{
        //显示添加界面
        this.user = null//去除前面残留的user
        this.setState({isShow:true})
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {
        let title = (<Button type={'primary'} onClick={this.showAdd}>添加用户</Button>)
        let {users, isShow,roles} = this.state
        let user = this.user || {}
        return (
            <Card title={title}>
                <Table dataSource={users} columns={this.columns}
                       bordered={true} rowKey={'_id'} pagination={{defaultPageSize: 7, showQuickJumper: true}}
                       loading={false}>

                </Table>
                <Modal
                    title= {(user._id ? '修改':'添加') + '用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({isShow: false})
                    }}
                >
                    <UserForm setForm={form =>this.form = form}
                    roles={roles} user={user}/>
                </Modal>

            </Card>
        )
    }
}