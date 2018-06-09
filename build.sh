#!/bin/sh
#安装模块
if [ ! -d "./node_modules" ]; then  
	npm install
fi
npm up lds-rc --save
#覆盖模块配置
cp -r -f ./node_modules_rewrite/react-scripts/* ./node_modules/react-scripts
#构建生成
npm run build
#清理打包文件
rm -rf ./pack/*.zip
#构建打包文件
for file in ./pack/*
do
    if test -d $file
    then
        zip -q -j -r $file.zip $file/*
    fi
done
#发布
scp -r ./pack root@192.168.6.116:/usr/local/application/smarthome_web