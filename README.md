<p align="center">
  <a href="http://apidoc.hefantv.com">
    <img width="251" src="https://i.imgur.com/UeQhrLo.png">
  </a>
</p>


 [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/react) [![Coverage Status](https://img.shields.io/coveralls/facebook/react/master.svg?style=flat)](https://coveralls.io/github/facebook/react?branch=master) [![CircleCI Status](https://circleci.com/gh/facebook/react.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/facebook/react) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request)

# API Doc
api文档管理、测试系统


## 特性
* 接口文档管理
* 状态码管理
* 数据字典管理
* 接口测试
* 接口mock功能

## 支持环境

* 现代浏览器和IE9及以上

## 技术方案

* 前端 react + redux + es6 + webpack2
* 后端 express + es6 + mongodb + pm2 

## 环境安装
安装node开发环境，版本大于6.9.2, 最好安装[淘宝npm镜像](http://npm.taobao.org/) `npm install -g cnpm --registry=https://registry.npm.taobao.org`  


```
cnpm install 
```
## 开发环境运行

修改web配置文件

```
server: {
        port: 3000,
        host: "http://localhost",
    },
    db: {
        //mongodb 配置
        DB_DEV: {
            url: 'mongodb://dbname:dbpwd@ip:port/db', //修改数据库配置 dbname 数据库账号 dbpwd 数据库密码
            options: {
            }
        },
        DB_TEST: {
            url: 'mongodb://dbname:dbpwd@ip:port/db',
            options: {
            }
        },
        DB_PRO: {
            url: 'mongodb://dbname:dbpwd@ip:port/db',
            options: {
            }
        }
    }
```

前端

```
npm run dev
```

sever

```
npm run server
```

## 生产环境发布

```
npm run pro
pm2 restart ./pm/ecosystem.json --env production
```

## 技术架构

[TOC]

bin ---前端构建程序

config ---前端构建，运行配置

controls  --- server端控制器

html  ---server 模板目录

logs  ---server 日志目录

models ---server 数据模型

nconf  ---server配置

pm  --- server生产环境服务管理

public ---server Web访问根目录

routes --- server 路由

src  ---front 源文件目录
 
   - actions  --- redux action
   - api  --- 接口管理
   - assets  --- 资源
   - common  --- 通用文件
   - components --- 组件库
   - constants  ---常量配置
   - containers  --- 容器
   - less  --- 样式文件
   - lib  --- 公用库
   - middleware  ---中间件
   - pages  ---页面
   - plugins  --- 插件
   - reducers  --- redux reducers
   - routes  --- react 路由
   - service  --- 基础服务
   - store  --- redux 存储
   - test  --- 测试单元
   - utils  --- 工具目录
   - App.js  --- 主程序

static --- server 静态目录


## 链接

* [使用文档](http://gitlab.hefantv.com/trunk/hefantv_api_s/blob/dev/help.md "使用文档")
* [技术细节说明](http://gitlab.hefantv.com/trunk/hefantv_api_s/blob/dev/DOC_technique.md "技术细节说明")