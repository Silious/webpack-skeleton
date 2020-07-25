const puppeteer = require('puppeteer');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const {sleep}= require('./utils');
class Skeleton {
    constructor(options) {
        this.options = options;
    }
    async initialize() {
        // 打开一个浏览器
        this.browser = await puppeteer.launch({ headless: false });// 无头
    }
    async newPage() {
        let { device } = this.options;
        let page = await this.browser.newPage();
        await page.emulate(puppeteer.devices[device]);
        return page;
    }
    async makeSkeleton(page) {
        const { defer = 5000 } = this.options;
        // 先读取脚本内容
        let scriptContent = await readFileSync(resolve(__dirname, 'skeletonScript.js'), 'utf8');
        // 通过addScriptTag方法向页面里注入这个脚本
        await page.addScriptTag({ content: scriptContent });
        await sleep(defer);
        // 脚本执行完成就是创建骨架屏的DOM架构
        // 在页面中执行此函数
        await page.evaluate((options) => {
            Skeleton.genSkeleton(options);
        }, this.options);
    }
    async genHTML(url) {
        // 生成骨架屏的DOM字符串
        let page = await this.newPage();
        let response = await page.goto(url, { waitUntil: 'networkidle2' });
        if (response && !response.ok()) {
            // 如果访问不成功
            throw new Error(`${response.status} on ${url}`);
        }
        // 创建骨架屏
        await this.makeSkeleton(page);
        const { html, styles } = await page.evaluate(() => Skeleton.getHtmlAndStyle());
        let result = `
            <style>${styles.join('\n')}</style>
            ${html}
        `;
        return result;
    }
    async destroy() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}
module.exports = Skeleton;
