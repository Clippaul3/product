
/*
* 能发送ajax请求的函数模块
* 封装axios库
* 函数的返回值是一个promise对象
* */

import axios from 'axios'

export default function sendAjax(url,data={},method='GET') {
    if(method=='GET'){
        //发送get请求
        return axios.get(url,{
            /*通过配置对象传递参数*/
            params:data
        })
    }else{
        //发送post请求
        return axios.post(url,data)
    }
}