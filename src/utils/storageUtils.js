/*
* 进行local数据存储管理的工具模块
* */
import store from 'store'

export default {
    /*
    * 保存user
    * */

    saveUser(user){
        store.set('user',user)
    },

    /*
    * 取出user
    * */
    readUser(){
        return store.get('user') || {}
    },

    /*
    * 删除user
    * */
    deleteUser(){
        store.remove('user')
    }

}