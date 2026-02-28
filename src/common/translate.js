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
        en: "QRCode",
    },
    input_placeholder_add_dir: {
        zh: "输入文件夹路径",
        en: "Enter folder path",
    },
    runtime_error_alert: {
        zh: "请尝试“手动刷新🔁页面”或“使用人类浏览器打开页面”",
        en: "Please try \"manually refreshing 🔁 the page\" or \"opening the page using a human browser.\"",
    },
    runtime_cn_chat_alert: {
        zh: "请不要在「微信、QQ、钉钉、飞书、企业微信」中打开本网站。<br/>请使用外部浏览器打开。",
        en: "Please do not open this website within \" WeChat(weixin), QQ, DingTalk(dingding), Lark(Feishu), or Enterprise WeChat.\" . <br/>Please open with an external browser.",
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
            '<p>◉ 推荐“<i class="select-text">Safari、Chrome、火狐、Edge</i>”等浏览器。</p>',
        en: '<p>◉ The content is for educational purposes only.</p>' +
            '<p>◉ Beware of online gambling fraud.</p>' +
            '<p>◉ Recommend networks such as China Unicom and China Telecom.</p>' +
            '<p>◉ Recommend browsers such as “<i class="select-text">Safari、Chrome、Firefox、Edge</i>”.</p>',
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
        zh: "1/e的人感谢你",
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


    // =========
//
}
export default lang_dict;