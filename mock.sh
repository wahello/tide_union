#!/bin/sh
#安装模块
if [ ! -d "./node_modules" ]; then  
	npm install
fi
npm up lds-rc --save
#覆盖模块配置
cp -r -f ./node_modules_rewrite/* ./node_modules
#构建服务
npm run start