# Conda 环境管理及常用指令
> Author: CGC

## 创建环境
```
conda create -n name python=3.x
```
> name为环境名\
> 3.x为指定python版本

## 删除环境
```
conda remove -n name --all
```

## 激活环境
```
conda activate name
```

## 关闭环境 返回默认环境
```
conda deactivate name
```

## 查看当前有哪些环境
```
conda info -e
```
*或*
```
conda env list
```
# conda包管理
## 查看当前环境的包
```
conda list
```

## 安装指定package到当前环境
```
conda install package
```
> package 为所需包名字 可在后加入`==`指定版本或输入url指定安装源

*也可以使用pip等进行安装*

## 安装package到指定的环境
```
conda install -n name package
```

## 更新package
```
conda update -n name package
```

## 移除package
```
conda remove -n name package
```
*或*
```
conda uninstall package
```

# conda版本
## 更新conda版本
```
conda update conda
```

## 更新python版本
```
conda update python
```
> 假设当前环境是python 3.6 执行命令后conda会将python升级为3.6.x系列的当前最新版本