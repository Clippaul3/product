/*
* 包含应用中所有接口请求函数的模块
* 可以有分别暴露和统一暴露
* 我们采用统一暴露
* */

import sendAjax from "./ajax";



export default {
    reqLogin(username,password){
        return sendAjax('/login',{username,password},'POST')
    },
    reqAddAdmin(user){
        return sendAjax('/manage/user/add',user,'POST')
    }
}