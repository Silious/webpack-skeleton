
const PLUGIN_NAME = 'SkeletonPlugin'; // 插件的名字
const Server = require('./Server');
const Skeleton = require('./Skeleton');
const { resolve } = require('path');
const { readFileSync, writeFileSync } = require('fs-extra');

class SkeletonPlugin {
    constructor(options) {
        this.options = options;
    }
    // 代表webpack编译对象
    apply(compile) {
        // compile身上会有很多的钩子，我们可以通过tap来注册这些钩子函数的监听
        // 当这个钩子触发的时候，会调用我们的监听函数
        // done 整个编译流程走完了，dist目录下的文件都生成了就可以触发done的回调执行了
        compile.hooks.done.tap(PLUGIN_NAME, async () => {
            await this.startServer(); // 启动一个http服务器
            this.skeleton = new Skeleton(this.options);
            await this.skeleton.initialize(); // 启动一个无头浏览器
            // 生成骨架屏的html和style
            const skeletonHTML = await this.skeleton.genHTML(this.options.origin);
            const originPath = resolve(this.options.staticDir, 'index.html');
            const originHTML = await readFileSync(originPath, 'utf8');
            const finalHTML = originHTML.replace('<!-- shell-->', skeletonHTML);
            await writeFileSync(originPath, finalHTML);
            await this.skeleton.destroy();// 销毁无头浏览器
            // 生成骨架屏内容
            await this.server.close();//关闭服务器
        })
    }
    async startServer() {
        this.server = new Server(this.options);// 创建服务
        await this.server.listen();// 启动这个服务器
    }
}
module.exports = SkeletonPlugin;
