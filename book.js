module.exports = {
    // 常规信息
    title: "集美大学无人机科创实验室相关技术及配置手册",
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
        "highlight",

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
    },

    //模板变量
    variables:{

    },
};
