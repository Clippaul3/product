const {override,fixBabelImports,addLessLoader} = require('customize-cra')

module.exports = override(
    //对antd实现按需打包:根据import来打包,(使用babel-plugin-import,修改package.json的scripts)
    fixBabelImports('import',{
        libraryName:'antd',
        libraryDirectory:'es',
        style:true
    }),
    //使用lessLoader对源码中的less变量进行重新指定
    addLessLoader({
        javascriptEnabled:true,
        modifyVars:{'@primary-color':'hotpink'}
    })
);