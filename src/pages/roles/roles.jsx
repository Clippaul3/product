import React,{Component} from  'react'
import {Card,Table,Icon,Button,Modal,message} from 'antd'
import api from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from "../../utils/memoryUtils";
import {formateDate} from '../../utils/dateutils'
import storageUtils from "../../utils/storageUtils";

export default class Roles extends Component{

    state = {
        roles:[],
        role:{},//选中的role
        isShowAdd:false,
        isShowAuth:false,
    }

    constructor(props){
        super(props)

        this.auth = React.createRef()
    }

    initColumns = ()=>{
        this.columns = [
            {
                title:'角色名称',
                dataIndex:'name',
                key:'name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                key:'create_time',
                render:formateDate
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                key:'auth_time',
                render:formateDate
            },
            {
                title:'授权人',
                dataIndex:'auth_name',
                key:'auth_name'
            },
        ]
    }

    onRow = (role)=>{

        return {
            onClick:event =>{
                //点击行
                this.setState({role})
            }
        }

    }

    getRoles = async ()=>{
        let result = await api.reqRoles()
        console.log(result)
        if(result.data.status === 0){
            let roles = result.data.data
            this.setState({roles})
        }
    }

    addRole = ()=>{
        //添加角色
        //表单验证
        this.form.validateFields(async (error,values)=>{
            if(!error){
                //收集输入数据
                let {roleName} = values
                this.form.resetFields()
                let result = await api.addRole(roleName)
                if(result.data.status === 0){
                    message.success('添加角色成功')
                    let role = result.data.data
                    //更新roles状态
                    //let {roles} = this.state
                    let roles = [...this.state.roles]
                    roles.push(role)
                    this.setState({roles})
                }else{
                    message.error('添加角色失败')
                }
                this.setState({isShowAdd:false})
            }
        })
    }

    updateRole = async ()=>{
        //更新角色
        let role = this.state.role
        //得到最新的menus
        let menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_name = memoryUtils.user.username

        //请求更新
        let result = await api.updateRole(role)

        if(result.data.status === 0){
            message.success('设置角色权限成功')
            //如果当前更新的自己角色的权限,强制退出
            if(role._id === memoryUtils.user.role_id){
                memoryUtils.user = {}
                storageUtils.deleteUser()
                this.props.history.replace('/login')
                message.info('当前角色权限更新,请重新登录')
            }else{
                this.getRoles()
            }
        }
        this.setState({isShowAuth:false})
    }

    handleCancel = ()=>{
        this.form.resetFields()
        this.setState({isShowAdd:false})
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {

        let {roles,role,isShowAdd,isShowAuth} = this.state

        let title = (
            <span>
                <Button type={'primary'} onClick={()=>this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;
                <Button type={'primary'} disabled={!role._id} onClick={()=>this.setState({isShowAuth: true})}>设置角色权限</Button>
            </span>
        )

        return(
            <Card title={title}>
                <Table
                bordered
                rowKey={'_id'}
                dataSource={roles}
                columns={this.columns}
                pagination={{defaultPageSize:5,showQuickJumper:true}}
                rowSelection={{type:'radio',selectedRowKeys:[role._id]}}
                onRow={this.onRow}
                >

                </Table>

                <Modal
                    title="添加角色"
                    visible={isShowAdd ? true : false}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddForm  setForm={(form)=>{this.form = form}}/>
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={()=>this.setState({isShowAuth: false})}
                >
                    <AuthForm role={role} ref={this.auth} />
                </Modal>
            </Card>
        )
    }
}