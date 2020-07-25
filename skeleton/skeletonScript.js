//增加一个全局变量，名字叫Skeleton
window.Skeleton = (function(){
    const SMALLEST_BASE64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const CLASS_NAME_PREFIX= 'sk-';
    const $$ = document.querySelectorAll.bind(document);
    const REMOVE_TAGS = ['title','meta','script'];
    const styleCache = new Map();
    function buttonHandler(element,options={}){
        //宽1px 高1的透明gif图
        const className = CLASS_NAME_PREFIX+'button';// sk-button
        const rule = `{
            color:${options.color} !important;
            background:${options.color} !important;
            border:none !important;
            box-shadow:none !important;
        }`
        addStyle(`.${className}`,rule);
        element.classList.add(className);
    }
    function imageHandler(element,options={}){
       const {width,height} = element.getBoundingClientRect();
        const attrs = {
            width,height,src:SMALLEST_BASE64
        }
        setAttributes(element,attrs);
        const className = CLASS_NAME_PREFIX+'image';// sk-image
        const rule = `{
            background:${options.color} !important;
        }`
        addStyle(`.${className}`,rule);
        element.classList.add(className);
    }
    function setAttributes(element,attrs){
        Object.keys(attrs).forEach(key=>element.setAttribute(key,attrs[key]));
    }
    function addStyle(selector,rule){
        if(!styleCache.has(selector)){//一个类名sk-button只会在缓存中出现一次
            styleCache.set(selector,rule);
        }
    }
    //转换原始元素为骨架DOM元素
    //我们在这此要遍历整个DOM元素树，获取生一个节点或者说元素，根据元素类型进行依次转换
    function genSkeleton(options){
        let rootElement = document.documentElement;
        ;(function traverse(options){
            let {button,image}= options;
            const buttons = [];//所有的按钮
            const images = [];   // 所有的图片
            ;(function preTraverse(element){
                if(element.children&& element.children.length>0){
                    //如果此元素有儿子，则称遍历儿子
                    Array.from(element.children).forEach(child=>preTraverse(child));
                }
                if(element.tagName == 'BUTTON'){
                    buttons.push(element);
                }else if(element.tagName == 'IMG'){
                    images.push(element);
                }
            })(rootElement);
            buttons.forEach(item=>buttonHandler(item,button));
            images.forEach(item=>imageHandler(item,image));
        })(options);
        let rules = '';
        for(const [selector,rule] of styleCache){
            // .sk-image .sk-button
            rules+=`${selector} ${rule}\n`;
        }
        console.log('rules',rules);
        const styleElement = document.createElement('style');
        styleElement.innerHTML= rules;
        document.head.appendChild(styleElement);
    }
    //获得骨架DOM元素的HTML字符串和样式style
    function getHtmlAndStyle(){
        const styles = Array.from($$('style')).map(style=>style.innerHTML || style.innerText);
        Array.from($$(REMOVE_TAGS.join(','))).forEach(element=>element.parentNode.removeChild(element));
        const html = document.body.innerHTML;
        return {html,styles};
    }
    return {genSkeleton,getHtmlAndStyle};
})();
