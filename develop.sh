#!/bin/sh
#安装模块
if [ ! -d "./node_modules" ]; then  
	npm install
fi
npm up lds-rc --save
#覆盖模块配置
cp -r -f ./node_modules_rewrite/react-scripts/* ./node_modules/react-scripts
#构建服务
npm run debug