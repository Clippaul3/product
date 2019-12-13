import {Upload, Icon, Modal, message} from 'antd';
import React from 'react'
import api from '../../api'
import PropTypes from 'prop-types'
import {BASE_IMG_URL} from '../../utils/constant'

/*function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}*/

export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs: PropTypes.array
    }

    /*state = {
        previewVisible: false,//是否显示大图预览
        previewImage: '',//大图的地址
        fileList: [],
    };*/

    constructor(props) {
        super(props)

        let fileList = []

        //如果传入了imgs
        let {imgs} = this.props
        console.log(typeof imgs)
        console.log('props的' + imgs)
        console.log('1111' + imgs)
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img
            }))

        }

        this.state = {
            previewVisible: false,//是否显示大图预览
            previewImage: '',//大图的地址
            fileList//所有已上传图片的数据
        }
    }

    getImgs = () => {
        //获取所有已上传图片文件名的数组
        return this.state.fileList.map(file => file.name)
    }

    handleCancel = () => this.setState({previewVisible: false});

    handlePreview = file => {
        /*if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }*/
        console.log('preview')
        console.log(file)
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    /*
    * fileList是所有已上传图片的数组
    * file:当前操作的图片
    * */

    handleChange = async ({file, fileList}) => {
        console.log('handleChange', file, fileList)
        let {imgs} = this.props
        console.log(this.props.imgs)
        //一旦上传成功,将当前上传file的信息修正(name,url)
        //file.status === 'done' 时上传成功
        if (file.status === 'done') {
            let result = file.response//{status:0,data:{name:'xxx.jpg',url:""}}
            if (result.status === 0) {
                message.success('上传图片成功')
                let {name, url} = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        } else if (file.status === 'removed') {
            //删除图片
            let result = await api.deleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }

        //在操作过程中更新fileList状态
        this.setState({fileList})
    };

    componentDidMount() {
        console.log('pw的did')
    }

    render() {
        console.log(this.props.imgs)
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload"//上传图片的接口地址
                    accept={'image/*'}//只接受的格式
                    name={'image'}//请求参数名
                    listType="picture-card"//卡片样式
                    fileList={fileList}//所有已上传文件图片对象的数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 5 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}
