/*
* 包含应用中所有接口请求函数的模块
* 可以有分别暴露和统一暴露
* 我们采用统一暴露
* */

import sendAjax from "./ajax";
import axios from 'axios'
import product from "../pages/product/product";



export default {
    reqLogin(username,password){
        return sendAjax('/login',{username,password},'POST')
    },
    reqWeather(){
        return (axios.get('https://www.tianqiapi.com/api/?version=v1&appid=XXXX&appsecret=$$$$$',))
    },

    //获取一级/二级分类列表
    //添加/更新一级/二级分类名称

    reqCategories (parentId){
        return (sendAjax('/manage/category/list',{parentId},'GET'))
    },

    addCategory (categoryName,parentId){
        return (sendAjax('/manage/category/add',{categoryName,parentId},'POST'))
    },

    updateCategory ({categoryName,categoryId}){
        return (sendAjax('/manage/category/update',{categoryName,categoryId},'POST'))
    },

    reqProducts(pageNum,pageSize){
        return (sendAjax('/manage/product/list',{pageNum,pageSize},'GET'))
    },

    //搜索商品分页列表,searchType时搜索的类型, productName/productDesc
    searchProducts({pageNum,pageSize,searchName,searchType}){
        return (sendAjax('/manage/product/search',{pageNum,pageSize,[searchType]:searchName}))
    },

    //获取一个分类
    reqCategory(categoryId){
        return (sendAjax('/manage/category/info',{categoryId}))
    },

    //改变商品状态(上下架操作)
    updateStatus(productId,status){
        return (sendAjax('/manage/product/updateStatus',{productId,status},'POST'))
    },

    deleteImg(name){
        return (sendAjax('/manage/img/delete',{name},'POST'))
    },

    //添加商品
    addOrUpdateProduct(product){
        return (sendAjax('/manage/product/' + (product._id?'update':'add'),product,'POST'))
    },
   /* //更新商品
    updateProduct(product){
        return (sendAjax('/manage/product/add',product,'POST'))
    },*/

   reqRoles(){
     return (sendAjax('/manage/role/list'))
   },

    addRole(roleName){
       //添加角色
        return (sendAjax('/manage/role/add',{roleName},'POST'))
    },

    updateRole(role){
       return (sendAjax('/manage/role/update',role,'POST'))
    },

    //获取用户列表
    reqUsers(){
       return (sendAjax('/manage/user/list'))
    },

    deleteUser(userId) {
       return (sendAjax('/manage/user/delete',{userId},'POST'))
    },

    addUser(user){
       return (sendAjax('/manage/user/add',user,'POST'))
    },
    //添加/更新用户
    addOrUpdateUser(user){
       return (sendAjax('/manage/user/'+(user._id ? 'update' : 'add'),user,'POST'))
    }
}