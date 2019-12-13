import React, {Component} from 'react'
import {Form, Input, Tree} from 'antd'
import PropTypes from 'prop-types'
import menulist from '../../config/menuConfig'

let Item = Form.Item
let {TreeNode} = Tree

export default class AuthForm extends Component {

    static propTypes = {
        role: PropTypes.object
    }


    constructor(props){
        super(props)
        //根据传入角色的menus
        let {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    getTreeNodes = (menulist)=>{
        return menulist.reduce((pre,item) =>{
            pre.push(<TreeNode title={item.title} key={item.key} >
                {
                    item.children ? this.getTreeNodes(item.children) : null
                }
            </TreeNode>)
            return pre
        },[])
    }

    onCheck = (checkedKeys)=>{
        //选中某个node的时候的回调函数
        this.setState({checkedKeys})
    }

    getMenus = ()=>{
        //为父组件获取最新Menus的方法
        return this.state.checkedKeys
    }

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menulist)
    }

    //根据新传入的role来更新checkedKeys状态,willReceiveProps
    componentWillReceiveProps(nextProps) {
        let menus = nextProps.role.menus
        this.setState({checkedKeys:menus})
    }

    render() {
        let {role} = this.props
        let {checkedKeys} = this.state
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 16}
        }
        return (
            <div>
                <Item label={'角色名称'} {...formItemLayout}>
                    <Input value={role.name} disabled/>
                </Item>

                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {
                            this.treeNodes
                        }
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}