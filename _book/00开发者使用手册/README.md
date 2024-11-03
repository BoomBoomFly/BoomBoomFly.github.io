# 开发者使用手册
> Author: CGC
> 
> Date: 2024.11.3

## 环境依赖
### Node & Npm
本项目基于 
![node](https://img.shields.io/badge/Node-v10.24.1-informational?style=flat&logo=data:image/svg%2bxml;base64,<BASE64_DATA>&color=7cabb1)
及
![npm](https://img.shields.io/badge/Npm-v6.14.12-informational?style=flat&logo=data:image/svg%2bxml;base64,<BASE64_DATA>&color=66c18c)
> 由于更高的 `node` 版本可能不支持 `gitbook` ，经尝试使用 `node` 版本为 `v10`，若您版本更高，请降低版本以使用

建议使用[node官网](https://nodejs.org/en/download/prebuilt-installer)安装，一般安装node后npm自动捆绑安装，所以只需要安装node即可

安装成功后，可以使用如下命令验证node和npm安装情况
```bash
# 查看node版本
node -v
# 查看npm版本
npm -v
```
### gitbook
使用如下命令，安装 `gitbook` 包
```bash
npm install -g gitbook-cli
```
> 注意：
> 若前一小节提到的 `node` 版本过高，这里可能会报错，降级版本即可

## 文档编辑及修改
请先克隆本项目
```bash
git clone https://github.com/BoomBoomFly/BoomBoomFly.github.io.git
```
### 文件构成
文件构成及作用大致如下
```
├───_book           // 构建用于部署的文件夹
│   ├───...
├───assert          // 存放外部资源如图片
│   ├───readmeAssert
│   ├───imgs
│   ├───...
├───node_modules
│   ├───...
├───.bookignore     
├───book.js         // 基本配置文件
├───package-lock.json
├───package.json
├───README.md       // 封面
├───SUMMARY.md      // 用于管理章节
│───...             // 章节文章
```
> Easy use: 除了上述有中文注释的部分，其余部分可以理解为对文章书写不重要，只是添加文章可以直接进入[文档编辑](#文档编辑)部分

### 修改配置
若需要修改例如 `书名`，`logo` 等，请在 `book.js` 中进行对应的修改

### 文档编辑
#### 修改封面
封面由根目录下的 `README.md` 文件渲染，修改 `README.md` 即可修改目录
#### 添加文章
1. 按照 *自己喜欢的方式* 攥写文章，请使用 `markdown` 语法，为了项目维护方便，请按照章节创建对应文件夹，例如 `00开发者使用手册` ，在里面添加自己的文章，在 `assert` 文件夹中添加外部依赖文件例如图片
2. 在 `SUMMARY.md` 添加章节索引（很简单，依葫芦画瓢即可）

### 插件安装
在添加文章中，可能会涉及到需要添加插件，使用例如如下命令进行插件安装
```bash
npm install gitbook-plugin-*
```
之后，插件包将安装至 `node_modules` 文件夹中，只需要在 `book.js` 文件中的 `plugins` 和 `pluginsConfig` 插入插件和修改插件配置

## 本地预览及部署
### 本地预览
使用
```bash
gitbook serve
# 或
npm run serve
```
之后在浏览器中打开 `http://localhost:4000` 进行本地预览
### 构建及部署
使用如下命令进行构建
```bash
gitbook build
# 或
npm run build
```
之后 **将工程push会github仓库** ，即可完成部署，
部署网址为 `https://boomboomfly.github.io/`
> 当然，你需要是组织成员才能进行对应修改，若为实验室新成员还未加入组织，请联系组织管理员~