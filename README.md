#### 骨架屏实现思路

1. 监听打包完成的事件
2. 当webpack编译完成后，我们可以启动一个服务，通过pub去访问这个生成的页面，抓取内容
3. 将抓取到的元素用对用标签替代，生成骨架屏元素
4. 将骨架屏元素替换到root中的占位符
5. 用户访问的时候首先呈现的是骨架屏页面
6. js加载完后会重新render掉root

#### 实际的页面

![image-20200725182312450](https://tva1.sinaimg.cn/large/007S8ZIlgy1gh3e41lpovj30p60oegsg.jpg)

#### 骨架屏页面

![image-20200725182400314](https://tva1.sinaimg.cn/large/007S8ZIlgy1gh3e4v54uzj30ry0tgmxk.jpg)
