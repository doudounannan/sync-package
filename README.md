# sync-package

在项目中使用 npm 做为 包管理器，安装发布 npm 包的正式组件，经常会遇到需要在项目中调试 node_modules 下面组件的窘境，比如说交互、样式还有其他。一般开发环境组件到生产环境组件要经过压缩、合并和打包等构建，修改构建后的代码，这无疑存在一定风险。该项目用于 *同步构建组件到项目中*，让您做到零风险调试，兼容 gulp + browserfy 和 webpack 打包。

PS: gulp + browserfy 旧打包下依赖由构建，大概10s左右，新版 webpack 直接拷贝，ms 级别 的同步。

## 安装

```bash
$ npm i -g sync-package-info
```

## 使用

可以在 命令行中 输入 **sync-package -h** 查看使用方法

```bash
Usage: sync-package [options]

  用于同步包信息


  Options:

    -V, --version        output the version number
    -s, --source <path>  包路径(绝对路径)<必须>
    -t, --target <path>  安装该包项目路径(绝对路径)<必须>
    -o, --output [path]  该包构建生产环境目录名[非必须]
    -h, --help           output usage information

  Examples:

    # 同步包信息
    $ sync-package -s /Users/XXX -t /Users/YYY
```

---

![webpack打包 同步](http://doudou-space.qiniudn.com/sync-package-new.gif)
![gulp + browserfy 打包 同步](http://doudou-space.qiniudn.com/sync-package-old.gif)