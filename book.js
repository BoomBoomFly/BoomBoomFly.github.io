module.exports = {
    // 常规信息
    title: "BoomBoomFly's Book",
    description: "无人机实验室技术及配置文档",
    author: "BoomBoomFly",
    language: "zh-cn",

    // 插件列表
    plugins: [
        // 主题
        "theme-d4t",

        "-lunr",
        "search",
        "search-pro",
        "code",

        "expandable-chapters",
        "back-to-top-button"
    ],

    // 插件配置
    pluginsConfig: {
        "code":{
            copyButtons: true,
        },
        "d4t":
        {
            "search-placeholder": "请输入关键字搜索",
            "logo": "assert/readmeAssert/logo.svg",
            "favicon": "assert/readmeAssert/favicon.ico"
        },
        "github":
        {
            "url": "https://github.com/BoomBoomFly"
        },
    },

    //模板变量
    variables:{

    },
};
