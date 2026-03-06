<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import {afterNavigate} from "$app/navigation";
    import {onMount} from "svelte";
    import {browser_ok, runtime_ok} from "../../common/middleware.svelte";
    import {browser} from "$app/environment";
    import config from "../../config";
    import btn_click_mp3 from "../../common/btn_click_mp3";


    // 本页面参数
    let route = $state(func.get_route());
    const audio = new Audio(btn_click_mp3);


    // 本页面函数：Svelte的HTML组件onXXX=中正确调用：={()=>def.xxx()}
    const def = {
        play_btn_click_mp3: function(){
            // init
            audio.pause();
            audio.currentTime = 0;
            //
            audio.volume = 0.8;
            //
            audio.play()
                .then(() => {})
                .catch(error => console.log('播放失败:', error));
            //
            audio.addEventListener('ended', () => {
                //
            });
        },
        init_calculator: function(){
            let that = this;
            //
            if (browser){
                let currentExpr = '';
                let lastResult = '0';
                let justCalculated = false;
                let lastError = '';

                // 从localStorage加载历史记录，最多50条
                const MAX_HISTORY = 60;
                let history = [];
                const STORAGE_KEY = config.app.app_class + 'calculator_history';

                // 保留小数点位数
                const result_fixed_len = 10;

                const exprEl = document.getElementById('expression');
                const resultEl = document.getElementById('result');
                const errorEl = document.getElementById('errorMessage');
                const historyList = document.getElementById('historyList');
                const clearHistoryBtn = document.getElementById('clearHistoryBtn');

                // 从localStorage加载历史
                function loadHistory() {
                    try {
                        const saved = localStorage.getItem(STORAGE_KEY);
                        if (saved) {
                            history = JSON.parse(saved);
                            // 确保不超过最大限制
                            if (history.length > MAX_HISTORY) {
                                history = history.slice(0, MAX_HISTORY);
                            }
                        } else {
                            history = [];
                        }
                    } catch (e) {
                        console.warn('加载历史记录失败:', e);
                        history = [];
                    }
                }

                // 保存历史到localStorage
                function saveHistory() {
                    try {
                        // 只保存最新的x条
                        const toSave = history.slice(0, MAX_HISTORY);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
                    } catch (e) {
                        console.warn('保存历史记录失败:', e);
                    }
                }

                function updateDisplay() {
                    exprEl.innerText = currentExpr || '0';
                    resultEl.innerText = lastResult;
                    errorEl.innerText = lastError;
                }

                function clearError() {
                    exprEl.innerText = '0';
                    resultEl.innerText = '0';
                    lastError = '';
                    errorEl.innerText = '';
                }

                function renderHistory() {
                    if (history.length === 0) {
                        historyList.innerHTML = '<li class="empty-history" style="text-align: center; font-size: 16px; line-height: 70px;opacity: 0.6;"> ✨ '+func.get_translate("Calculator")+' ✨ </li>';
                        return;
                    }

                    const frag = document.createDocumentFragment();
                    // 显示最新的记录（数组前面是最新的）
                    history.slice(0, MAX_HISTORY).forEach((item, index) => {
                        const li = document.createElement('li');
                        li.className = 'history-item click font-blue';
                        li.setAttribute('data-expr', item.expr);
                        li.setAttribute('data-value', item.value);
                        //
                        li.innerHTML = " <span style='opacity: 0.4;color: white;'>#"+(history.length-index)+"</span> ";
                        // 表达式
                        const exprSpan = document.createElement('span');
                        exprSpan.className = 'history-expr';
                        exprSpan.innerText = item.expr;
                        // 值
                        const valSpan = document.createElement('span');
                        valSpan.className = 'history-value';
                        valSpan.innerText = " = " + item.value;
                        //
                        li.appendChild(exprSpan);
                        li.appendChild(valSpan);
                        //
                        li.addEventListener('click', (e) => {
                            e.stopPropagation();
                            //
                            that.play_btn_click_mp3();
                            //
                            const expr = li.getAttribute('data-expr');
                            const val = li.getAttribute('data-value');
                            if (expr && val) {
                                currentExpr = expr;
                                lastResult = val;
                                justCalculated = true;
                                clearError();
                                updateDisplay();
                            }
                        });
                        //
                        frag.appendChild(li);
                    });

                    historyList.innerHTML = '';
                    historyList.appendChild(frag);
                }

                function addHistory(expr, value) {
                    if (!expr || expr.trim() === '' || value === undefined || value === null) return;

                    // 格式化数值
                    let valStr = typeof value === 'number' ? value.toString() : value;

                    // 检查是否与最新的历史记录重复（连续重复）
                    if (history.length > 0 && history[0].expr === expr && history[0].value === valStr) {
                        // 连续重复，不添加
                        // console.log("连续重复的计算，不添加到历史记录");
                        return;
                    }

                    // 添加到历史记录开头（最新的在前面）
                    history.unshift({ expr: expr, value: valStr });

                    // 限制最大数量
                    if (history.length > MAX_HISTORY) {
                        history = history.slice(0, MAX_HISTORY);
                    }

                    // 保存到localStorage
                    saveHistory();

                    // 重新渲染
                    renderHistory();
                }

                // 清除历史
                clearHistoryBtn.addEventListener('click', (e) => {
                    e.stopPropagation();

                    // 如果没有历史记录，直接返回
                    if (history.length === 0) {
                        return;
                    }

                    // 显示确认弹窗
                    if (confirm('⚠️ '+func.get_translate("calculator_clear_history"))) {
                        clearError();
                        //
                        history = [];
                        saveHistory();
                        renderHistory();
                    }

                });

                // 检查括号是否匹配
                function checkParentheses(expr) {
                    let stack = [];
                    for (let i = 0; i < expr.length; i++) {
                        if (expr[i] === '(') {
                            stack.push('(');
                        } else if (expr[i] === ')') {
                            if (stack.length === 0) {
                                return false;
                            }
                            stack.pop();
                        }
                    }
                    return stack.length === 0;
                }

                // 将阶乘函数添加到Math对象
                function factorialN(n) { // [0, n)
                    // 处理负数和非整数的情况
                    if (n < 0) {
                        return Infinity; // 使用 Infinity 而不是字符串
                    }
                    if (!Number.isInteger(n)) {
                        return Infinity;
                    }
                    // 阶乘
                    let result = 1;
                    for (let i = 1; i <= n; i++) {
                        result *= i;
                    }
                    return result;
                }
                Math.factorial = factorialN;

                // 预处理表达式
                function preprocessExpression(expr) {
                    if (!expr || expr.trim() === '') return '';

                    let processed = expr.replace(/×/g, '*')
                        .replace(/÷/g, '/')
                        .replace(/−/g, '-')
                        .replace(/\^/g, '**');

                    // 替换数学常数，使用更精确的正则避免误匹配
                    processed = processed.replace(/(^|[^a-zA-Z])π($|[^a-zA-Z])/g, '$1Math.PI$2');
                    processed = processed.replace(/(^|[^a-zA-Z])e($|[^a-zA-Z])/g, '$1Math.E$2');

                    // 处理百分比
                    processed = processed.replace(/(\d+(\.\d*)?|\.\d+)%/g, '$1*0.01');

                    // 先处理阶乘操作符
                    processed = processed.replace(/(\d+|\))\s*!/g, function(match) {
                        const num = match.replace('!', '').trim();
                        return `Math.factorial(${num})`;
                    });

                    // 然后处理省略乘号的情况
                    // 数字后面跟左括号
                    processed = processed.replace(/(\d)\(/g, '$1*(');
                    // 右括号后面跟数字
                    processed = processed.replace(/\)(\d)/g, ')*$1');
                    // 右括号后面跟左括号
                    processed = processed.replace(/\)\(/g, ')*(');

                    // 数字后面跟函数名
                    const funcNames = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt'];
                    funcNames.forEach(func => {
                        // 确保不会匹配到已经处理过的表达式
                        const regex = new RegExp('(\\d)(' + func + '\\()', 'g');
                        processed = processed.replace(regex, '$1*$2');
                    });

                    // 右括号后面跟函数名
                    funcNames.forEach(func => {
                        const regex = new RegExp('(\\))(' + func + '\\()', 'g');
                        processed = processed.replace(regex, '$1*$2');
                    });

                    // 最后处理函数名替换，使用单词边界确保完整匹配
                    const funcMap = {
                        'sin': 'Math.sin',
                        'cos': 'Math.cos',
                        'tan': 'Math.tan',
                        'asin': 'Math.asin',
                        'acos': 'Math.acos',
                        'atan': 'Math.atan',
                        'log': 'Math.log10',
                        'ln': 'Math.log',
                        'sqrt': 'Math.sqrt',
                    };

                    for (let [key, value] of Object.entries(funcMap)) {
                        // 使用单词边界确保只匹配完整的函数名
                        const regex = new RegExp('\\b' + key + '\\s*\\(', 'g');
                        processed = processed.replace(regex, value + '(');
                    }

                    processed = processed.replace(/1\/x/g, '1/');

                    return processed;
                }

                // 安全的表达式求值
                function safeEvaluate(expr) {
                    if (!expr || expr.trim() === '') {
                        return { value: '0', error: null };
                    }

                    if (!checkParentheses(expr)) {
                        return { value: null, error: 'Not Match "()".' };
                    }

                    try {
                        const processedExpr = preprocessExpression(expr);

                        // console.log('原始表达式:', expr);
                        // console.log('处理后表达式:', processedExpr);

                        if (processedExpr.includes('Function') ||
                            processedExpr.includes('eval') ||
                            processedExpr.includes('setTimeout') ||
                            processedExpr.includes('setInterval')) {
                            return { value: null, error: 'Unsafe Input.' };
                        }

                        const func = new Function('Math', 'return (' + processedExpr + ')');
                        let result = func(Math);

                        // console.log('计算结果=', result, typeof result);

                        if (typeof result !== 'number') { // 表达式错误
                            return { value: null, error: 'Math Error.' };
                        }
                        if (isNaN(result)) { // 参数超范围
                            return { value: null, error: 'Math out of range.' };
                        }
                        if (result === Infinity){ // 结果无解
                            return { value: '∞', error: null };
                        }

                        //
                        result = parseFloat(result.toFixed(result_fixed_len));
                        if (Number.isInteger(result)) {
                            result = Math.round(result);
                        }
                        return { value: result.toString(), error: null };
                    } catch (e) {
                        // console.error('计算错误:', e);
                        // console.error('错误信息:', e.message);
                        // console.error('当前表达式:', expr);
                        // console.error('处理后表达式:', preprocessExpression(expr));

                        if (e.message.includes('Unexpected token')) {
                            return { value: null, error: 'Input Error.' };
                        } else if (e.message.includes('is not defined')) {
                            // 提取未定义的变量名
                            const match = e.message.match(/(\w+) is not defined/);
                            const varName = match ? match[1] : 'unknown';
                            return { value: null, error: `Undefined: ${varName}` };
                        } else if (e.message.includes('Division by zero')) {
                            return { value: null, error: '"/0" Error.' };
                        } else {
                            return { value: null, error: 'Calc Error.' };
                        }
                    }
                }

                function handleAction(action, btnText) {
                    const rawChar = btnText || action;

                    clearError();

                    if (justCalculated) {
                        if (!'+-*/÷×^()'.includes(action) &&
                            action !== 'DEL' &&
                            action !== 'R' &&
                            action !== 'clear_history' &&
                            action !== ')' &&
                            action !== '(' &&
                            action !== '='
                        ) {
                            currentExpr = '';
                        }
                        justCalculated = false;
                    }

                    // 重写 或 清空历史，都会触发“重新输入”
                    if (action === 'R' || action === 'clear_history'){
                        currentExpr = '';
                        lastResult = '0';
                        justCalculated = false;
                        updateDisplay();
                        return;
                    }

                    if (action === 'DEL') {
                        if (currentExpr.length > 0) {
                            currentExpr = currentExpr.slice(0, -1);
                            if (currentExpr === '') {
                                lastResult = '0';
                            } else {
                                // const result = safeEvaluate(currentExpr);
                                // if (result.error) {
                                //     lastError = result.error;
                                // } else if (result.value !== null) {
                                //     lastResult = result.value;
                                // }
                            }
                        }
                        updateDisplay();
                        return;
                    }

                    if (action === '=') {
                        if (currentExpr === '') {
                            lastResult = '0';
                            updateDisplay();
                            return;
                        }

                        const result = safeEvaluate(currentExpr);
                        if (result.error) {
                            lastError = result.error;
                            lastResult = lastError;
                        } else if (result.value !== null) {
                            addHistory(currentExpr, result.value);
                            lastResult = result.value;
                            justCalculated = true;
                        }

                        updateDisplay();
                        return;
                    }

                    let insertStr = rawChar;

                    if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt'].includes(action)) {
                        insertStr = action + '(';
                    } else if (action === 'pi') {
                        insertStr = 'π';
                    } else if (action === 'e') {
                        insertStr = 'e';
                    } else if (action === 'reciprocal') {
                        if (currentExpr === '' || /[+\-*/÷×^(]$/.test(currentExpr)) {
                            insertStr = '1/(';
                        } else {
                            insertStr = '/(1)';
                        }
                    } else if (action === 'pow') {
                        insertStr = '^';
                    } else if (action === '%') {
                        insertStr = '%';
                    } else if (action === 'n!') {
                        insertStr = '!';
                    } else if (action === '(') {
                        insertStr = '(';
                    } else if (action === ')') {
                        insertStr = ')';
                    }

                    currentExpr += insertStr;

                    if (currentExpr.trim() !== '') {
                        // const result = safeEvaluate(currentExpr);
                        // if (result.error) {
                        //     // 不立即显示错误
                        // } else if (result.value !== null) {
                        //     lastResult = result.value;
                        // }
                    } else {
                        lastResult = '0';
                    }

                    updateDisplay();
                }

                // 绑定按钮事件
                document.querySelectorAll('.btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        //
                        that.play_btn_click_mp3();
                        //
                        const action = btn.getAttribute('data-action');
                        const btnText = btn.innerText;
                        handleAction(action, btnText);
                    });
                });

                // 键盘支持
                document.addEventListener('keydown', (e) => {
                    const key = e.key;
                    const target = e.target;

                    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                        return;
                    }

                    if (key.match(/[0-9]|\.|\+|\-|\*|\/|\(|\)|\^|=/)) {
                        e.preventDefault();
                    }

                    if (key >= '0' && key <= '9') {
                        handleAction(key, key);
                    } else if (key === '.') {
                        handleAction('.', '.');
                    } else if (key === '+') {
                        handleAction('+', '+');
                    } else if (key === '-') {
                        handleAction('-', '−');
                    } else if (key === '*') {
                        handleAction('*', '×');
                    } else if (key === '/') {
                        handleAction('/', '÷');
                    } else if (key === '(') {
                        handleAction('(', '(');
                    } else if (key === ')') {
                        handleAction(')', ')');
                    } else if (key === '^') {
                        handleAction('pow', '^');
                    } else if (key === '=' || key === 'Enter') {
                        e.preventDefault();
                        handleAction('=', '=');
                    } else if (key === 'Escape') {
                        e.preventDefault();
                        handleAction('R', 'Rewrite');
                    } else if (key === 'Backspace' || key === 'Delete') {
                        e.preventDefault();
                        handleAction('DEL', 'Del');
                    } else if (key === 'P') {
                        handleAction('pi', 'π');
                    } else if (key === 'E') {
                        handleAction('e', 'e');
                    } else if (key === 'S') {
                        handleAction('sin', 'sin');
                    } else if (key === 'C') {
                        handleAction('cos', 'cos');
                    } else if (key === 'T') {
                        handleAction('tan', 'tan');
                    } else if (key === 'N') {
                        handleAction('n!', 'n!');
                    }
                });

                // 初始化
                loadHistory();
                renderHistory();
                updateDisplay();
            }else{
                console.log("Sever===");
            }
        },
    };


    // 页面函数执行的入口，实时更新数据
    function page_start(){
        func.console_log("page_start=", route);
        func.loading_hide(); // 避免其他页面跳转到本页面时出现loading图
        // 开始
        func.title(func.get_translate("Calculator"));
        def.init_calculator();
    }

    // 标签处于切换显示状态
    function page_show(){
        func.console_log("page_show=", route);
        // show
    }

    // 标签处于切换隐藏状态
    function page_hide(){
        func.console_log("page_hide=", route);
        // hide
    }


    // 刷新页面数据
    afterNavigate(() => {
        if (!runtime_ok() || !browser_ok()){return;} // 系统基础条件检测
        //
        page_start();
    });


    // 页面装载完成后，只运行一次
    // addEventListener专用函数
    onMount(() => {
        if (!runtime_ok() || !browser_ok()){return;} // 系统基础条件检测
        // 监测页面标签是否处于显示
        if (browser){
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) { // onHide
                    page_show();
                } else { // onShow
                    page_hide();
                }
            });
        }
    });


</script>

<div class="page-div calc-box select-none">
    <div class="calculator">
        <div class="display-area">
            <!-- 历史记录 -->
            <div class="history-section">
                <div class="history-items-container" id="historyContainer">
                    <ul class="history-list" id="historyList"></ul>
                </div>
            </div>
            <!--计算过程-->
            <div class="calc-section">
                <div class="expression select-text" id="expression">0</div>
                <div class="result select-text" id="result">0</div>
                <div class="error-message hide" id="errorMessage"></div>
            </div>
        </div>

        <div class="buttons">
            <!--1-->
            <!--        <button class="btn function" data-action="reciprocal">1/x</button>-->
            <button class="btn function" data-action="pi">π</button>
            <button class="btn function" data-action="e">e</button>
            <button class="btn clear_history" title="Clear all history" data-action="clear_history" id="clearHistoryBtn">Clear</button>
            <button class="btn rewrite" data-action="R" title="Rewrite">Rewrite</button>
            <button class="btn del" data-action="DEL" title="Del">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M19 3a3 3 0 0 1 2.995 2.824L22 6v12a3 3 0 0 1-2.824 2.995L19 21H8.108a3 3 0 0 1-2.436-1.25l-.108-.16l-4.08-6.53a2 2 0 0 1-.087-1.967l.086-.153l4.081-6.53a3 3 0 0 1 2.351-1.404L8.108 3zm0 2H8.108a1 1 0 0 0-.773.366l-.075.104L3.18 12l4.08 6.53a1 1 0 0 0 .72.462l.128.008H19a1 1 0 0 0 .993-.883L20 18V6a1 1 0 0 0-.883-.993zm-8.121 3.464l2.12 2.122l2.122-2.122a1 1 0 1 1 1.414 1.415L14.415 12l2.12 2.121a1 1 0 0 1-1.414 1.415L13 13.414l-2.121 2.122a1 1 0 1 1-1.415-1.415L11.586 12L9.464 9.879a1 1 0 0 1 1.415-1.415"/></g></svg>
            </button>
            <!--2-->
            <button class="btn function" data-action="sin">sin</button>
            <button class="btn function" data-action="cos">cos</button>
            <button class="btn function" data-action="tan">tan</button>
            <button class="btn function" data-action="log">log</button>
            <button class="btn function" data-action="ln">ln</button>
            <!--3-->
            <button class="btn function" data-action="asin">asin</button>
            <button class="btn function" data-action="acos">acos</button>
            <button class="btn function" data-action="atan">atan</button>
            <button class="btn function" data-action="n!">n!</button>
            <button class="btn function" data-action="pow">x^y</button>
<!--            <button class="btn function" data-action="sqrt">√</button>-->
            <!--4-->
            <button class="btn" data-action="7">7</button>
            <button class="btn" data-action="8">8</button>
            <button class="btn" data-action="9">9</button>
            <button class="btn operator" data-action="(">(</button>
            <button class="btn operator" data-action=")">)</button>
            <!--5-->
            <button class="btn" data-action="4">4</button>
            <button class="btn" data-action="5">5</button>
            <button class="btn" data-action="6">6</button>
            <button class="btn operator" data-action="*">×</button>
            <button class="btn operator" data-action="/">/</button>
            <!--6-->
            <button class="btn" data-action="1">1</button>
            <button class="btn" data-action="2">2</button>
            <button class="btn" data-action="3">3</button>
            <button class="btn operator" data-action="+">+</button>
            <button class="btn operator" data-action="-">−</button>
            <!--7-->
            <button class="btn zero" data-action="0">0</button>
            <button class="btn" data-action=".">.</button>
            <button class="btn" data-action="%">%</button>
            <button class="btn equals" data-action="=" title="=">=<span style="font-weight: 400;font-size: 14px;">(Save)</span></button>
        </div>
    </div>
</div>

<style>
    .calc-box{
        padding: 0 0;
        margin: 0 auto;
    }

    .calculator {
        font-family: 'Segoe UI', Roboto, system-ui, sans-serif;
        max-width: 520px;
        min-width: 280px;
        width: 100%;
        height: 100%;
        min-height: 640px;
        /**/
        /*position: fixed;*/
        /*z-index: 1;*/
        /*left: 0;*/
        /*right: 0;*/
        /*top: 0;*/
        /*bottom: 0;*/
        /**/
        margin: auto auto;
        padding: 10px 10px;
        transition: all 0.1s;
        user-select: none;
        background-color: var(--color-surface-950);
        color: white;
    }

    .display-area {
        border-radius: 20px;
        padding: 0 10px;
        border: 1px solid rgba(180,180,180, 0.9);
        /*background-color: #314a5c;*/
    }

    .history-section {
        padding: 10px 0;
        border-bottom: 1px solid rgba(180,180,180, 0.9);
    }

    .history-items-container {
        height: 70px; /* 大约2条记录的高度 */
        overflow-y: auto;
        transition: max-height 0.1s ease;
        scrollbar-width: thin;
        scrollbar-color: #5f9ea0 #1d2a32;
    }

    .history-items-container::-webkit-scrollbar {
        width: 6px;
    }

    .history-items-container::-webkit-scrollbar-track {
        background: #1d2a32;
        border-radius: 20px;
    }

    .history-items-container::-webkit-scrollbar-thumb {
        background: #5f9ea0;
        border-radius: 20px;
    }

    .history-items-container::-webkit-scrollbar-thumb:hover {
        background: #7fb8ba;
    }

    .history-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding-right: 10px;
        font-weight: 400;
        text-align: left;
    }

    /*.history-item {*/
    /*    background: #263b47;*/
    /*    border-radius: 30px;*/
    /*    padding: 6px 14px;*/
    /*    color: #d5e8f5;*/
    /*    font-size: 0.9rem;*/
    /*    display: flex;*/
    /*    justify-content: space-between;*/
    /*    align-items: center;*/
    /*    border-left: 4px solid #5f9ea0;*/
    /*    box-shadow: 0 2px 5px #14212b;*/
    /*    cursor: pointer;*/
    /*    transition: 0.1s;*/
    /*    word-break: break-word;*/
    /*}*/

    /*.history-item:hover {*/
    /*    background: #2f4858;*/
    /*    border-left-color: #9fc5e8;*/
    /*    transform: translateX(2px);*/
    /*}*/

    /*.history-expr {*/
    /*    font-weight: 300;*/
    /*    color: #bfd9f0;*/
    /*    font-size: 0.85rem;*/
    /*}*/

    /*.history-value {*/
    /*    font-weight: 600;*/
    /*    margin-left: 12px;*/
    /*    font-size: 0.9rem;*/
    /*}*/

    /*.empty-history {*/
    /*    color: #667f8f;*/
    /*    text-align: center;*/
    /*    padding: 8px;*/
    /*    font-size: 18px;*/
    /*    font-style: italic;*/
    /*}*/

    .expression {
        font-size: 18px;
        font-weight: 300;
        text-align: right;
        word-wrap: break-word;
        word-break: break-all;
        border-bottom: 1px dashed rgba(180,180,180, 0.6);
        padding: 10px 0;
        /**/
        height: 80px;
        overflow-y: auto;
    }
    .result {
        font-size: 18px;
        font-weight: 600;
        text-align: right;
        word-wrap: break-word;
        word-break: break-all;
        line-height: 1.2;
        text-shadow: 0 2px 4px black;
        padding: 10px 0;
    }
    .error-message {
        color: #ffa07a;
        font-size: 16px;
        text-align: right;
        min-height: 20px;
    }

    .buttons {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 11px 10px;
        box-shadow: none;
        /**/
        background: transparent;
        -webkit-tap-highlight-color: transparent;
        margin-top: 20px;
        margin-bottom: 10px;
    }
    .btn {
        background-color: #314a5c;
        padding: 13px 5px;
        border-radius: 20px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        border: 1px solid rgba(180,180,180, 0.9);
        opacity: 1;
    }
    .btn:active {
        transform: translateY(2px);
        opacity: 0.8;
    }
    .btn:hover {
        opacity: 0.9;
    }
    .btn.function {
        background-color: #2f5570;
        font-size: 16px;
    }
    .btn.operator {
        background-color: #d98c5f;
        font-size: 16px;
    }
    .btn.equals {
        background-color: #e6845e;
        font-weight: 700;
        grid-column: span 2;
    }
    .btn.clear_history{
        background-color: red;
        font-size: 12px;
        color: #0f212b;
        border-radius: 30px;
        font-weight: 400;
        border-color: red;
    }
    .btn.rewrite {
        background-color: #e6845e;
        font-size: 12px;
        font-weight: 400;
        color: #0f212b;
    }
    .btn.del {
        background-color: #e6845e;
        font-size: 16px;
        color: #0f212b;
        font-weight: 400;
    }
    .btn.del {
        &::before {
            content: '';
        }
    }
</style>