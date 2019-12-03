import React,{Component} from  'react'
import {Card,Icon,List} from 'antd'
import {BASE_IMG_URL} from '../../utils/constant'
import api from '../../api'

let Item = List.Item
//详情页

export default class Detail extends Component{

    state = {
        cname:'',//一级分类名称
        cname2:'',//二级分类名称
    }

    async componentDidMount() {
        //得到当前商品的分类ID
        let {pCategoryId,categoryId} = this.props.location.state
        if(pCategoryId === '0'){
            //一级分类下的商品
            let result = await api.reqCategory(categoryId)
            let cname = result.data.data.name
            this.setState({cname})
        }else{
            //二级分类下的商品,要查询两个
            /*let result = await api.reqCategory(categoryId)
            let result2 = await api.reqCategory(pCategoryId)
            let cname = result.data.data.name
            let cname2 = result2.data.data.name*/

            let results = await Promise.all([api.reqCategory(categoryId),api.reqCategory(pCategoryId)])
            let cname = results[0].data.data.name
            let cname2 = results[1].data.data.name

            this.setState({cname,cname2})
        }
    }

    render() {
        let title = (
            <span>
                <Icon type={'arrow-left'} onClick={()=>this.props.history.goBack()}/>
                <span>商品详情</span>
            </span>
        )

        let {name,desc,price,detail,imgs} = this.props.location.state

        return(
            <Card title={title} className={'product-detail'}>
                <List>
                    <Item>
                        <span className={'left-span'}>商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className={'left-span'}>商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className={'left-span'}>商品价格:</span>
                        <span>￥{price}</span>
                    </Item>
                    <Item>
                        <span className={'left-span'}>所属分类:</span>
                        <span>
                            {this.state.cname2}---->{this.state.cname}
                        </span>
                    </Item>
                    <Item>
                        <span className={'left-span'}>商品图片:</span>
                        <span>
                            {
                                imgs.map(img=>(
                                    <img key={img} className={'product-img'} src={BASE_IMG_URL+'default_boy_headpic.png'}/>
                                ))
                            }

                        </span>
                    </Item>
                    <Item>
                        <span className={'left-span'}>商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}>

                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}