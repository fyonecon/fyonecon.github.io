<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import {afterNavigate} from "$app/navigation";
    import {onMount} from "svelte";
    import {browser_ok, runtime_ok} from "../../common/middleware.svelte";
    import {browser} from "$app/environment";


    // 本页面参数
    let route = $state(func.get_route());


    // 本页面函数：Svelte的HTML组件onXXX=中正确调用：={()=>def.xxx()}
    const def = {
        init_calculator: function(){
            if (browser){
                let currentExpr = '';
                let lastResult = '0';
                let justCalculated = false;
                let lastError = '';

                // 从localStorage加载历史记录，最多100条
                let history = [];
                const STORAGE_KEY = 'calculator_history';
                const MAX_HISTORY = 50;

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
                        // 只保存最新的100条
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
                        historyList.innerHTML = '<li class="empty-history" style="text-align: center;"> ✨ '+func.get_translate("calculator_history_null")+' </li>';
                        return;
                    }

                    const frag = document.createDocumentFragment();
                    // 显示最新的记录（数组前面是最新的）
                    history.slice(0, MAX_HISTORY).forEach((item, index) => {
                        const li = document.createElement('li');
                        li.className = 'history-item';
                        li.setAttribute('data-expr', item.expr);
                        li.setAttribute('data-value', item.value);
                        //
                        li.innerHTML = "<span style='opacity: 0.4;'>#"+(history.length-index)+"</span> ";
                        // 表达式
                        const exprSpan = document.createElement('span');
                        exprSpan.className = 'history-expr';
                        exprSpan.innerText = item.expr;
                        // 值
                        const valSpan = document.createElement('span');
                        valSpan.className = 'history-value';
                        valSpan.innerText = " = " + item.value;

                        li.appendChild(exprSpan);
                        li.appendChild(valSpan);
                        //
                        li.addEventListener('click', (e) => {
                            e.stopPropagation();
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

                // 预处理表达式
                function preprocessExpression(expr) {
                    if (!expr || expr.trim() === '') return '';

                    let processed = expr.replace(/×/g, '*')
                        .replace(/÷/g, '/')
                        .replace(/−/g, '-')
                        .replace(/\^/g, '**');

                    processed = processed.replace(/π/g, 'Math.PI');
                    processed = processed.replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, 'Math.E');
                    processed = processed.replace(/(\d+(\.\d*)?|\.\d+)%/g, '$1*0.01');

                    const funcMap = {
                        'sin': 'Math.sin',
                        'cos': 'Math.cos',
                        'tan': 'Math.tan',
                        'asin': 'Math.asin',
                        'acos': 'Math.acos',
                        'atan': 'Math.atan',
                        'log': 'Math.log10',
                        'ln': 'Math.log',
                        'sqrt': 'Math.sqrt'
                    };

                    for (let [key, value] of Object.entries(funcMap)) {
                        const regex = new RegExp(key + '\\s*\\(', 'g');
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
                        return { value: null, error: '括号不匹配' };
                    }

                    try {
                        const processedExpr = preprocessExpression(expr);

                        if (processedExpr.includes('Function') ||
                            processedExpr.includes('eval') ||
                            processedExpr.includes('setTimeout') ||
                            processedExpr.includes('setInterval')) {
                            return { value: null, error: '不安全的表达式' };
                        }

                        const func = new Function('Math', 'return (' + processedExpr + ')');
                        let result = func(Math);

                        if (typeof result !== 'number' || !isFinite(result)) {
                            return { value: null, error: '数学错误' };
                        }

                        result = parseFloat(result.toFixed(12));

                        if (Number.isInteger(result)) {
                            result = Math.round(result);
                        }

                        return { value: result.toString(), error: null };
                    } catch (e) {
                        console.log('计算错误:', e.message);
                        if (e.message.includes('Unexpected token')) {
                            return { value: null, error: '表达式语法错误' };
                        } else if (e.message.includes('is not defined')) {
                            return { value: null, error: '未知函数' };
                        } else if (e.message.includes('Division by zero')) {
                            return { value: null, error: '除以零' };
                        } else {
                            return { value: null, error: '计算错误' };
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
                            action !== ')' &&
                            action !== '=') {
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
                                const result = safeEvaluate(currentExpr);
                                if (result.error) {
                                    lastError = result.error;
                                } else if (result.value !== null) {
                                    lastResult = result.value;
                                }
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
                            lastResult = '错误';
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
                    } else if (action === '(') {
                        insertStr = '(';
                    } else if (action === ')') {
                        insertStr = ')';
                    }

                    currentExpr += insertStr;

                    if (currentExpr.trim() !== '') {
                        const result = safeEvaluate(currentExpr);
                        if (result.error) {
                            // 不立即显示错误
                        } else if (result.value !== null) {
                            lastResult = result.value;
                        }
                    } else {
                        lastResult = '0';
                    }

                    updateDisplay();
                }

                // 绑定按钮事件
                document.querySelectorAll('.btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
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
                    } else if (key === 'Backspace') {
                        e.preventDefault();
                        handleAction('DEL', 'Del');
                    } else if (key === 'p' || key === 'P') {
                        handleAction('pi', 'π');
                    } else if (key === 'e' || key === 'E') {
                        handleAction('e', 'e');
                    } else if (key === 's' || key === 'S') {
                        handleAction('sin', 'sin');
                    } else if (key === 'c' || key === 'C') {
                        handleAction('cos', 'cos');
                    } else if (key === 't' || key === 'T') {
                        handleAction('tan', 'tan');
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
                <div class="expression" id="expression">0</div>
                <div class="result" id="result">0</div>
                <div class="error-message hide" id="errorMessage"></div>
            </div>
        </div>

        <div class="buttons">
            <!--1-->
            <!--        <button class="btn function" data-action="reciprocal">1/x</button>-->
            <button class="btn function" data-action="sqrt">√</button>
            <button class="btn function" data-action="pow">x^y</button>
            <button class="btn clear_history" data-action="clear_history" id="clearHistoryBtn">Clear</button>
            <button class="btn rewrite" data-action="R">Rewrite</button>
            <button class="btn del" data-action="DEL">Del</button>
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
            <button class="btn function" data-action="pi">π</button>
            <button class="btn function" data-action="e">e</button>
            <!--4-->
            <button class="btn" data-action="7">7</button>
            <button class="btn" data-action="8">8</button>
            <button class="btn" data-action="9">9</button>
            <button class="btn function" data-action="(">(</button>
            <button class="btn function" data-action=")">)</button>
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
            <button class="btn equals" data-action="=">=</button>
        </div>
    </div>
</div>

<style>
    .calc-box{
        padding: 0 0;
        margin: 0;
    }

    .calculator {
        font-family: 'Segoe UI', Roboto, system-ui, sans-serif;
        max-width: 520px;
        min-width: 300px;
        width: 100%;
        height: 100%;
        /**/
        position: fixed;
        z-index: 1;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto auto;
        /**/
        background: #22313f;
        /*box-shadow: 0 25px 50px -6px rgba(0,0,0,0.6), inset 1px 1px 2px rgba(255,255,255,0.1);*/
        padding: 10px 10px;
        transition: all 0.2s;
        user-select: none;
    }

    .display-area {
        background: #1e2b36;
        border-radius: 15px;
        padding: 0 10px;
        /*box-shadow: inset 0 2px 5px rgba(0,0,0,0.5), 0 1px 2px rgba(255,255,255,0.05);*/
        border: 1px solid rgba(180,180,180, 1);
    }

    .history-section {
        padding: 10px 0;
        border-bottom: 1px dashed rgba(180,180,180, 0.8);
    }

    .history-items-container {
        height: 80px; /* 大约2条记录的高度 */
        overflow-y: auto;
        transition: max-height 0.3s ease;
        scrollbar-width: thin;
        scrollbar-color: #5f9ea0 #1d2a32;
    }

    .history-items-container::-webkit-scrollbar {
        width: 6px;
    }

    .history-items-container::-webkit-scrollbar-track {
        background: #1d2a32;
        border-radius: 15px;
    }

    .history-items-container::-webkit-scrollbar-thumb {
        background: #5f9ea0;
        border-radius: 15px;
    }

    .history-items-container::-webkit-scrollbar-thumb:hover {
        background: #7fb8ba;
    }

    .history-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding-right: 5px;
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
    /*    color: white;*/
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
        color: #9bb7d4;
        font-size: 18px;
        text-align: right;
        word-wrap: break-word;
        word-break: break-all;
        font-weight: 300;
        letter-spacing: 1px;
        border-bottom: 1px dashed rgba(180,180,180, 0.8);
        font-family: 'Courier New', monospace;
        padding: 10px 0;
        /**/
        height: 80px;
        overflow-y: auto;
    }
    .result {
        color: #f0f9ff;
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
        background: transparent;
        -webkit-tap-highlight-color: transparent;
        padding: 15px 0 10px 0;
    }
    .btn {
        background-color: #314a5c;
        padding: 13px 5px;
        border-radius: 15px;
        font-size: 16px;
        font-weight: 500;
        /*box-shadow: 0 5px 0 #17242e, 0 6px 12px black;*/
        cursor: pointer;
        transition: 0.07s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        border: 1px solid #4e6f84;
        opacity: 1;
    }
    .btn:active {
        /*transform: translateY(2px);*/
        /*box-shadow: 0 5px 0 #17242e, 0 6px 12px black;*/
        opacity: 0.8;
    }
    .btn:hover {
        opacity: 0.9;
    }
    .btn.function {
        background-color: #2f5570;
        font-size: 16px;
        color: white;
        border-color: #6196b5;
    }
    .btn.operator {
        background-color: #d98c5f;
        font-size: 16px;
        color: white;
        border-color: #f3b491;
        /*box-shadow: 0 5px 0 #8f542e;*/
    }
    .btn.equals {
        background-color: #e6845e;
        color: white;
        font-weight: 700;
        border-color: #fbc19c;
        /*box-shadow: 0 5px 0 #9b5b38;*/
        grid-column: span 2;
    }
    .btn.clear_history{
        background-color: red;
        font-size: 12px;
        color: #0f212b;
        border-color: #aecfd9;
        border-radius: 25px;
    }
    .btn.rewrite {
        background-color: #e6845e;
        font-size: 12px;
        border-color: #ddb3a8;
        color: #0f212b;
    }
    .btn.del {
        background-color: #e6845e;
        border-color: #ddb3a8;
        font-size: 14px;
        color: #0f212b;
    }
    .btn.del {
        &::before {
            content: '';
        }
    }
    .btn.zero {
        grid-column: span 1;
    }
    .btn:focus-visible {
        outline: 2px solid #ffbb88;
    }
</style>