// 翻译表
const lang_dict = {
    test: { // 示例
        zh: "测试", // 简体中文（包含繁体）
        en: "Test", // 英文
        jp: "", // 日语
        fr: "", // 法语
        de: "", // 德语
        ru: "", // 俄语或乌克兰语
        es: "", // 西班牙语
        ko: "", // 韩语或朝鲜语
        vi: "", // 越南语
    },
    _null: { // 必须
        zh: " -空- ",
        en: " -Empty- ",
        jp: " -Null- ",
        fr: " -Null- ",
        de: " -Null- ",
        ru: " -Null- ",
        es: " -Null- ",
        ko: " -Null- ",
        vi: " -Null- ",
    },
    // =========
    // 托盘
    show_window: {
        zh: "显示视窗",
        en: "Show Window",
    },
    exit_app: {
        zh: "退出程序",
        en: "Exit App",
    },
    about_app: {
        zh: "关于程序",
        en: "About App",
    },
    // 主菜单
    _404: {
        zh: "404 页面不存在",
        en: "404 Not Found",
    },
    Example: {
        zh: "例子",
        en: "Example",
    },
    Home: {
        zh: "主页",
        en: "Home",
    },
    Settings: {
        zh: "设置",
        en: "Settings",
    },
    About: {
        zh: "关于",
        en: "About",
    },
    User: {
        zh: "我的",
        en: "Me",
    },
    user_tips: {
        zh: "设置",
        en: "Settings",
    },
    user_need_login: {
        zh: "请登录...",
        en: "Please login...",
    },
    ThemeModel: {
        zh: "主题",
        en: "Themes",
    },
    //
    PureHome: {
        zh: "主页",
        en: "PureHome",
    },
    Search: {
        zh: "🔍 搜索",
        en: "🔍 Search",
    },
    Link: {
        zh: "链签",
        en: "Link",
    },
    Info: {
        zh: "查看信息",
        en: "Info",
    },
    JYP: {
        zh: "教育片",
        en: "Educational film",
    },
    Calculator: {
        zh: "科学计算器",
        en: "Scientific Calculator",
    },
    Calc: {
        zh: "计算器",
        en: "Calc",
    },
    Divination: {
        zh: "祀测",
        en: "Divine",
    },
    //
    url_timeout: {
        zh: "链接过期",
        en: "URL Timeout",
    },
    url_timeout_null: {
        zh: "链接参数错误",
        en: "URL Error",
    },
    //
    reload_window: {
        zh: "重载页面",
        en: "Reload Page",
    },
    reload_window_btn: {
        zh: "重 载",
        en: "Reload",
    },
    //
    btn_cancel: {
        zh: "取消",
        en: "Cancel",
    },
    btn_save: {
        zh: "保存",
        en: "Save",
    },
    btn_ok: {
        zh: "是的",
        en: "OK",
    },
    btn_update: {
        zh: "更新",
        en: "Update",
    },
    a_click_tip_see_detail: {
        zh: "点击查看详情",
        en: "See Details",
    },
    a_click_tip_back_home: {
        zh: "返回主页",
        en: "Back Home Page",
    },
    //
    confirm_change_language_tip: {
        zh: "切换语言 ？（页面将会刷新.）",
        en: "Change language ？（The page will refresh.）",
        jp: "言語を切り替えますか？（ページが更新されます.）",
        fr: "Changer de langue? (la page sera actualisée.)",
        de: "Sprache wechseln?  (Die Seite wird aktualisiert.)",
        ru: "Переключить язык? (Страница будет обновлена.)",
        es: "¿Cambiar de idioma? (la página se actualizará).",
        ko: "언어 전환?페이지가 새로 고쳐집니다.",
        vi: "Đổi ngôn ngữ? (Trang sẽ được làm mới.)",
    },
    //
    sys_default: {
        zh: "跟随系统",
        en: "Same system",
    },
    app_info: {
        zh: "软件信息",
        en: "App Information",
    },
    theme_model_light: {
        zh: "亮",
        en: "Light",
    },
    theme_model_dark: {
        zh: "暗",
        en: "Dark",
    },
    //
    playing: {
        zh: "正在播放",
        en: "Playing",
    },
    play_paused: {
        zh: "已暂停。",
        en: "Paused.",
    },
    play_add_new_fir: {
        zh: "添加本地文件夹",
        en: "Add a new local folder",
    },
    play_update_play_list: {
        zh: "更新播放列表",
        en: "Update play list",
    },
    updated: {
        zh: "已更新",
        en: "Updated",
    },
    saved: {
        zh: "已保存",
        en: "Saved",
    },
    added: {
        zh: "已添加",
        en: "Added",
    },
    input_null: {
        zh: "输入为空",
        en: "Input is empty",
    },
    null_content: {
        zh: "空内容",
        en: "Content is empty",
    },
    error: {
        zh: "出错",
        en: "Error",
    },
    find_btn: {
        zh: "查 找",
        en: "Find",
    },
    search_btn: {
        zh: "搜 索",
        en: "Search",
    },
    input_placeholder_find: {
        zh: "输入查找...",
        en: "Find...",
    },
    input_placeholder_search: {
        zh: "输入关键词...",
        en: "Search keywords...",
    },
    remove: {
        zh: "移除",
        en: "Remove",
    },
    clear: {
        zh: "清除",
        en: "Clear",
    },
    remove_help_1:{
        zh: "移除该文件夹（不会从本机删除该文件夹）",
        en: "Remove the folder (The folder will not be deleted from the local machine)",
    },
    remove_help_2:{
        zh: "清除搜索历史？",
        en: "Clear search history?",
    },
    del: {
        zh: "删除",
        en: "Del",
    },
    edit: {
        zh: "编辑",
        en: "Edit",
    },
    share: {
        zh: "分享",
        en: "Share",
    },
    qr: {
        zh: "二维码",
        en: "QR Code",
    },
    make_qr: {
        zh: "生成二维码",
        en: "Make QR",
    },
    copied: {
        zh: "已复制",
        en: "Copied",
    },
    copied_error: {
        zh: "复制时出现错误",
        en: "An error occurred during copying",
    },
    input_placeholder_add_dir: {
        zh: "输入文件夹路径",
        en: "Enter folder path",
    },
    runtime_error_alert: {
        zh: "⚠️ 请尝试“手动刷新🔁页面”或“使用人类浏览器打开页面”",
        en: "⚠️ Please try \"manually refreshing 🔁 the page\" or \"opening the page using a human browser.\"",
    },
    runtime_cn_chat_alert: {
        zh: "😊 请不要在「微信、QQ、钉钉、飞书、支付宝、企业微信」中打开本网站。<br/>请使用外部浏览器打开。",
        en: "😊 Please do not open this website within \" WeChat(weixin), QQ, DingTalk(dingding), Lark(feishu), AliPay(zhifubao), or Enterprise WeChat.\" . <br/>Please open with an external browser.",
    },
    support_min_js_alert: {
        zh: "🔴 不支持最低js运行时要求，一般2024年之后的发布的操作系统或浏览器内核才符合条件。",
        en: "🔴 Do not support the minimum JavaScript runtime requirements, which are typically supported by operating systems or browser kernels released after 2024.",
    },
    support_min_os_alert: {
        zh: "🔴 不支持最低操作系统要求，一般2023年之后的发布的操作系统才符合条件。",
        en: "🔴 Do not support the minimum operating systems requirements, which are typically supported by operating systems released after 2023.",
    },
    //
    search_del_history: {
        zh: "清除历史",
        en: "Clear",
    },
    search_clear_input: {
        zh: "重新输入",
        en: "Rewrite",
    },
    search_enter_input: {
        zh: "🔍&nbsp;搜 索",
        en: "Search",
    },
    search_opening_page: {
        zh: "正在打开",
        en: "Opening",
    },
    search_res_show: {
        zh: "内容",
        en: "The result",
    },
    //
    link_news: {
        zh: "新闻",
        en: "News",
    },
    link_subscribe: {
        zh: "订阅",
        en: "Subscriptions",
    },
    link_tools: {
        zh: "工具",
        en: "Tools",
    },
    link_docs: {
        zh: "文档",
        en: "Docs",
    },
    link_download: {
        zh: "下载",
        en: "Download",
    },
    //
    mp_title: {
        zh: "教育片",
        en: "Educational Film",
    },
    mp_notice: {
        zh: "提醒",
        en: "Notice",
    },
    mp_notice_txt: {
        zh: '<p>◉ 内容仅供教育学习。</p>' +
            '<p>◉ 谨防网络赌博诈骗。</p>' +
            '<p>◉ 推荐“联通、电信”等网络。</p>' +
            '<p>◉ 白名单浏览器：<i class="select-text"> <span class="wtlb">' +
            '苹果 iPhone/iPad：' +
            '<a class="a-url font-blue" href="https://apps.apple.com/us/app/adblock-for-safari/id1402042596">Safari（可屏蔽广告）</a>、' +
            '<a class="a-url font-blue" href="https://www.microsoft.com/en-us/edge/download">Edge（可屏蔽广告）</a>、' +
            '</br>安卓/鸿蒙：' +
            '<a class="a-url font-blue" href="https://www.downkuai.com/android/157308.html">三星浏览器（国际服可屏蔽广告）</a>、' +
            '<a class="a-url font-blue" href="https://www.downkuai.com/android/109376.html">火狐浏览器（国际服可屏蔽广告）</a>、' +
            '</br>电脑 Win/Mac：' +
            '<a class="a-url font-blue" href="https://www.firefox.com/zh-CN/download/">火狐浏览器（国际服可屏蔽广告）</a>。' +
            '</span></i></p>',
        en: '<p>◉ The content is for educational purposes only.</p>' +
            '<p>◉ Beware of online gambling fraud.</p>' +
            '<p>◉ Recommend networks such as China Unicom and China Telecom.</p>' +
            '<p>◉ Whitelist browser: <i class="select-text"> <span class="wtlb">' +
            'Apple iPhone/iPad: ' +
            '<a class="a-url font-blue" href="https://apps.apple.com/us/app/adblock-for-safari/id1402042596">Safari (Ad-blocking)</a>, ' +
            '<a class="a-url font-blue" href="https://www.microsoft.com/en-us/edge/download">Edge (Ad-blocking)</a>, ' +
            '</br>Android/鸿蒙: ' +
            '<a class="a-url font-blue" href="https://www.downkuai.com/android/157308.html">SamsungBrowser (International server can block ads)</a>, ' +
            '<a class="a-url font-blue" href="https://www.downkuai.com/android/109376.html">Firefox (International server can block ads)</a>, ' +
            '</br>Desktop Win/Mac: ' +
            '<a class="a-url font-blue" href="https://www.firefox.com/zh-CN/download/">Firefox (International server can block ads)</a>.' +
            '</span></i></p>',
    },
    mp_so: {
        zh: "查找",
        en: "Find",
    },
    mp_chigua: {
        zh: "吃瓜",
        en: "Rumors",
    },
    mp_fabu: {
        zh: "1/e的人类感谢你",
        en: "1/e People thanks you",
    },
    mp_dongman: {
        zh: "影视/动漫",
        en: "TV/Cartoon",
    },
    mp_lieqi: {
        zh: "猎奇",
        en: "Special",
    },
    //
    calculator_history_null: {
        zh: "历史为空",
        en: "History is null",
    },
    calculator_clear_history: {
        zh: "清除全部历史记录？",
        en: "Clear all history?",
    },
    rewrite:{
        zh: "重写",
        en: "Rewrite",
    },
    calculator_rewrite: {
        zh: "重写表达式？",
        en: "Rewrite the expression?",
    },
    save: {
        zh: "保存",
        en: "Save",
    },
    textarea_placeholder: {
        zh: "输入内容 ...",
        en: "Input content ...",
    },
    text_to_qr_btn: {
        zh: "文本转成二维码",
        en: "Text to QR",
    },


    // =========
//
}
export default lang_dict;