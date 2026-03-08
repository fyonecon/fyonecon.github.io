<script lang="ts">
    import func from "../../common/func.svelte.js";
    import {afterNavigate} from "$app/navigation";
    import {onMount} from "svelte";
    import {browser_ok, runtime_ok} from "../../common/middleware.svelte";
    import {browser} from "$app/environment";
    import config from "../../config";
    import btn_click_base64_mp3 from "../../common/btn_click_base64_mp3";
    import {Dialog, Portal} from "@skeletonlabs/skeleton-svelte";


    // 本页面参数
    const animation = 'transition transition-discrete opacity-0 translate-y-[100px] starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-y-[100px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0';
    let route = $state(func.get_route());
    let calculator_clear_history_timer = $state(0);
    let calculator_clear_history_state_timer = $state(0);
    let clear_history_dialog_is_open = $state(false);
    let history = $state([]);
    let clear_history_state = $state(0); // 0未弹窗，1已弹窗
    const calculator_history_min_height = 70; // 70
    let calculator_history_height = $state(calculator_history_min_height);
    const calculator_min_height = 630; // 630
    let calculator_height = $state(calculator_min_height);

    // 播放按键点击mp3声音
    // AudioContext法（主）
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let audioBuffer = $state(null);
    // Audio法（备）
    const audio = new Audio(btn_click_base64_mp3);
    audio.volume = 0.8;
    audio.load(); // 预加载音频并保持准备状态
    audio.preload = 'auto'; // 添加预加载和缓存优化


    // 本页面函数：Svelte的HTML组件onXXX=中正确调用：={()=>def.xxx()}
    const def = {
        close_dialog: function(){
            clear_history_dialog_is_open = false;
            clear_history_state = 0;
            clearInterval(calculator_clear_history_state_timer);
        },
        open_dialog: function(){
            clear_history_dialog_is_open = true;
            clear_history_state = 0;
            clearInterval(calculator_clear_history_state_timer);
        },
        clear_history: function(){
            let that = this;
            //
            clear_history_state = 1;
            // UI和函数分开写，这里只处理UI
            clear_history_dialog_is_open = false;
            func.loading_show("", 1800);

        },
        init_audio_buffer: function(){ // 预加载音频并保持准备状态
            // 将Base64转换为ArrayBuffer进行更高效的播放
            async function loadAudioBuffer() {
                try {
                    // 假设btn_click_base64_mp3是Base64字符串
                    const base64Data = btn_click_base64_mp3.split(',')[1] || btn_click_base64_mp3;
                    const binaryString = atob(base64Data);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
                } catch (e) {
                    console.warn('Web Audio API 不支持，回退到普通Audio', e);
                }
            }
            // 如果支持Web Audio API，使用更高效的播放方式
            if (window.AudioContext || window.webkitAudioContext) {
                loadAudioBuffer();
            }
        },
        play_btn_click_mp3: function(){
            // 使用Web Audio API进行更高效的播放（如果可用）
            if (audioBuffer && audioContext && audioContext.state !== 'closed') {
                try {
                    // 恢复音频上下文（如果在Safari中需要）
                    if (audioContext.state === 'suspended') {
                        audioContext.resume();
                    }

                    const source = audioContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(audioContext.destination);
                    source.start(0);
                    return;
                } catch (e) { // 降级到普通Audio
                    // 中断上一个未完成的任务，保证当前仅播放一个mp3
                    audio.paused;
                    audio.currentTime = 0;
                    // 播放当前的
                    audio.play();
                    //
                    audio.addEventListener('ended', () => {
                        audio.load();  // 预加载音频
                    });
                }
            }else{
                console.warn('音频播放失，audioContext参数错误');
            }

            // 降级方案：使用优化后的普通Audio
            // 使用requestAnimationFrame避免阻塞UI
            requestAnimationFrame(() => {
                try {
                    // 克隆音频节点以实现重叠播放
                    const quickAudio = new Audio(btn_click_base64_mp3);
                    quickAudio.volume = 0.6; // 稍微降低音量避免爆音
                    quickAudio.play().catch(e => {
                        // 忽略自动播放策略错误
                        if (e.name !== 'NotAllowedError') {
                            console.warn('音频播放失败1', e);
                        }
                    });
                    // 播放后立即释放资源
                    quickAudio.addEventListener('ended', () => {
                        quickAudio.remove();
                    }, { once: true });
                } catch (e) {
                    // 静默失败
                    console.warn('音频播放失败2', e);
                }
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

                // 从localStorage加载历史记录，最多N条
                const MAX_HISTORY = 500; // [100, 999]
                const STORAGE_KEY = config.app.app_class + 'calculator_history';

                // 保留小数点位数
                const result_fixed_len = 15;

                //
                const exprEl = document.getElementById('expression');
                const resultEl = document.getElementById('result');
                const errorEl = document.getElementById('errorMessage');
                const historyList = document.getElementById('historyList');
                const clearHistoryBtn = document.getElementById('clearHistoryBtn');

                // 从localStorage加载历史
                function loadHistory() {
                    return new Promise(resolve => {
                        try {
                            const saved = localStorage.getItem(STORAGE_KEY);
                            if (saved) {
                                history = JSON.parse(saved);
                                // 确保不超过最大限制
                                if (history.length > MAX_HISTORY) {
                                    history = history.slice(0, MAX_HISTORY);
                                }
                                //
                                resolve(history);
                            } else {
                                history = [];
                                resolve(history);
                            }
                        } catch (e) {
                            console.warn('加载历史记录失败:', e);
                            history = [];
                            resolve(history);
                        }
                    });
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

                // 显示历史
                function renderHistory() {
                    if (history.length === 0) {
                        historyList.innerHTML = '<li class="empty-history" style="text-align: center; font-size: 16px; line-height: 70px;opacity: 0.6;"> ✨ '+func.get_translate("Calculator")+' ✨ </li>';
                        return;
                    }

                    const frag = document.createDocumentFragment();
                    // 显示最新的记录（数组前面是最新的）
                    history.slice(0, MAX_HISTORY).forEach((item, index) => {
                        const li = document.createElement('li');
                        li.className = 'history-item click font-blue break';
                        li.setAttribute('data-expr', item.expr);
                        li.setAttribute('data-value', item.value);
                        //
                        let _index = (history.length-index);
                        let index_txt = "000";
                        if (_index<10){
                            index_txt = "00"+_index;
                        }
                        if (_index>=10 && _index<100){
                            index_txt = "0"+_index;
                        }
                        if (_index>=100 && _index<999){
                            index_txt = ""+_index;
                        }
                        //
                        li.innerHTML = "<span style='opacity: 0.5;color: white; padding-right: 10px;'>#"+index_txt+"</span>";
                        // 表达式
                        const exprSpan = document.createElement('span');
                        exprSpan.className = 'history-expr';
                        exprSpan.innerHTML = item.expr;
                        // 值
                        const valSpan = document.createElement('span');
                        valSpan.className = 'history-value';
                        valSpan.innerHTML = "<span style='opacity: 0.5;color: white; padding-left: 5px; padding-right: 5px;'>=</span>" + item.value;
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

                // 清除全部历史
                function clear_all_history(){
                    clearError();
                    //
                    history = [];
                    //
                    saveHistory();
                    renderHistory();
                }

                // 清除历史
                clearHistoryBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // 显示确认弹窗
                    clearTimeout(calculator_clear_history_timer);
                    clearInterval(calculator_clear_history_state_timer);
                    //
                    calculator_clear_history_timer = setTimeout(function (){
                        clear_history_dialog_is_open = true;
                        // do
                        function watch_clear_history_state(){
                            if (clear_history_state===1){ // 监听到正确值，关闭UI、清除数据。
                                // UI和函数分开写，这里只处理数据
                                clear_all_history()
                                that.close_dialog();
                            }else{ // 持续监听
                                // console.log("0=", [calculator_clear_history_state_timer, clear_history_state]);
                            }
                        }
                        // 监听clear_history_state值是否为1
                        watch_clear_history_state();
                        calculator_clear_history_state_timer = setInterval(function (){
                            watch_clear_history_state();
                        }, 800);
                    }, 100);
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

                // 预处理计算表达式 - 使用高精度常数（可配置精度）
                function preprocessExpression(expr) {
                    if (!expr || expr.trim() === '') return '';

                    // 高精度常数（仅将e作为“数值e”，不作为“科学计数法e<10^>”）
                    const PI = '3.14159265358979323846264338327950288419716939937510';  // 50位
                    const E = '2.71828182845904523536028747135266249775724709369995';   // 50位

                    // 运算符还原
                    let processed = expr
                        // 替换运算符
                        .replace(/×/g, '*')
                        .replace(/÷/g, '/')
                        .replace(/−/g, '-')
                        .replace(/\^/g, '**');

                    // 先处理函数名称，避免函数名中的'e'被误替换
                    // 临时替换函数名中的e（如 'log' 中的 'g' 不影响，但如果有函数包含'e'如 'exp'）
                    processed = processed
                        .replace(/\b(sin|cos|tan|asin|acos|atan|log|ln|sqrt|exp)\b\s*\(/g, function(match) {
                            // 使用特殊标记临时保护
                            return 'FUNC_' + match.replace('(', '_LP_');
                        });

                    // 1. 处理 e 后面直接跟 π 的情况（使用单词边界避免匹配到函数名）
                    processed = processed.replace(/(?<![a-zA-Z])eπ/g, E + '*' + PI);

                    // 2. 处理 e 后面直接跟 ( 的情况
                    processed = processed.replace(/(?<![a-zA-Z])e\(/g, E + '*(');

                    // 3. 处理 π（包括前面有数字的情况）
                    processed = processed.replace(/(\d*)π/g, function(match, num) {
                        if (num === '') return PI;
                        return num + '*' + PI;
                    });

                    // 4. 处理 e 常数（包括前面和后面有数字或小数点的情况）
                    //    e 仅作为常数，不作为科学计数法
                    processed = processed.replace(/(\d*)(?:\.?\d*)?e(\d*\.?\d*)/g, function(match, numBefore, numAfter) {
                        // 避免处理函数名
                        if (match.includes('FUNC_')) return match;

                        if (numBefore === '' && numAfter === '') return E;                    // 单独的 e
                        if (numBefore === '') return E + '*' + parseFloat(numAfter);          // e后面跟数字，如 e9 → e*9
                        if (numAfter === '') return parseFloat(numBefore) + '*' + E;          // 数字后面跟e，如 2e → 2*e
                        return parseFloat(numBefore) + '*' + E + '*' + parseFloat(numAfter);  // 数字e数字，如 2e3 → 2*e*3
                    });

                    // 5. 处理 e 后面跟小数点的情况（如 e.5）
                    processed = processed.replace(/(?<![a-zA-Z])e\.(\d+)/g, E + '*0.$1');

                    // 6. 处理数字后面跟 e. 的情况（如 2e.5）
                    processed = processed.replace(/(\d+)e\.(\d+)/g, '$1*' + E + '*0.$2');

                    // 恢复函数名
                    processed = processed.replace(/FUNC_(\w+)_LP_/g, '$1(');

                    // 其他计算
                    processed = processed
                        // 处理省略乘号
                        .replace(/(\d)\(/g, '$1*(')
                        .replace(/\)(\d)/g, ')*$1')
                        .replace(/\)\(/g, ')*(')

                        // 处理百分比
                        .replace(/(\d+(\.\d*)?|\.\d+)%/g, '$1*0.01')

                        // 处理阶乘（Math.factorial 已定义）
                        .replace(/(\d+|\))\s*!/g, function(match) {
                            const num = match.replace('!', '').trim();
                            return `Math.factorial(${num})`;
                        })

                        // 处理函数
                        .replace(/\b(sin|cos|tan|asin|acos|atan|log|ln|sqrt)\s*\(/g, 'Math.$1(')
                        .replace(/\blog\b\s*\(/g, 'Math.log10(')
                        .replace(/\bln\b\s*\(/g, 'Math.log(');

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

                    that.play_btn_click_mp3();

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
                document.querySelectorAll('.btns').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
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
                    } else if (key === '*' || key === 'X') {
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
                    } else if (key === 'N' || key === '!') {
                        handleAction('n!', 'n!');
                    } else if (key === '%') {
                        handleAction('%', '%');
                    }
                });

                // 初始化
                loadHistory().then((data)=>{
                    renderHistory();
                    updateDisplay();
                });
            }else{
                console.log("Sever===");
            }
        },
        auto_calc_calculator_height: function(){ // 动态计算计算器的高度
            let section_main_space_height = 5; // px
            let bar_bottom = 20; // px，这还是横条区域的高度
            let avail_height = window.innerHeight;
            //
            if (avail_height > calculator_min_height+bar_bottom){
                calculator_height = avail_height - section_main_space_height;
                calculator_history_height = (avail_height - calculator_min_height - bar_bottom) + calculator_history_min_height - section_main_space_height;
            }else{
                calculator_height = calculator_min_height+bar_bottom - section_main_space_height;
                calculator_history_height = calculator_history_min_height - section_main_space_height;
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
        def.init_audio_buffer();
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
            //
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) { // onHide
                    page_show();
                } else { // onShow
                    page_hide();
                }
            });
            //
            def.auto_calc_calculator_height();
            window.onresize = function (){
                def.auto_calc_calculator_height();
            };
            //
        }
    });


</script>

<div class="page-div calc-box select-none">
    <div class="calculator" style="height: {calculator_height}px;">
        <div class="display-area">
            <!-- 历史记录 -->
            <div class="history-section">
                <div class="history-items-container" id="historyContainer" style="height: {calculator_history_height}px;">
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
<!--        <button class="btns function" data-action="reciprocal">1/x</button>-->
            <button class="btns function" data-action="pi">π</button>
            <button class="btns function" data-action="e">e</button>
            <button class="btns clear_history" title="Clear all history" data-action="clear_history" id="clearHistoryBtn">Clear</button>
            <button class="btns rewrite" data-action="R" title="Rewrite">Rewrite</button>
            <button class="btns del" data-action="DEL" title="Del">
                <svg style="display: inline-block;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M19 3a3 3 0 0 1 2.995 2.824L22 6v12a3 3 0 0 1-2.824 2.995L19 21H8.108a3 3 0 0 1-2.436-1.25l-.108-.16l-4.08-6.53a2 2 0 0 1-.087-1.967l.086-.153l4.081-6.53a3 3 0 0 1 2.351-1.404L8.108 3zm0 2H8.108a1 1 0 0 0-.773.366l-.075.104L3.18 12l4.08 6.53a1 1 0 0 0 .72.462l.128.008H19a1 1 0 0 0 .993-.883L20 18V6a1 1 0 0 0-.883-.993zm-8.121 3.464l2.12 2.122l2.122-2.122a1 1 0 1 1 1.414 1.415L14.415 12l2.12 2.121a1 1 0 0 1-1.414 1.415L13 13.414l-2.121 2.122a1 1 0 1 1-1.415-1.415L11.586 12L9.464 9.879a1 1 0 0 1 1.415-1.415"/></g></svg>
            </button>
            <!--2-->
            <button class="btns function" data-action="sin">sin</button>
            <button class="btns function" data-action="cos">cos</button>
            <button class="btns function" data-action="tan">tan</button>
            <button class="btns function" data-action="log">log</button>
            <button class="btns function" data-action="ln">ln</button>
            <!--3-->
            <button class="btns function" data-action="asin">asin</button>
            <button class="btns function" data-action="acos">acos</button>
            <button class="btns function" data-action="atan">atan</button>
            <button class="btns function" data-action="n!">n!</button>
            <button class="btns function" data-action="pow">x^y</button>
<!--        <button class="btns function" data-action="sqrt">√</button>-->
            <!--4-->
            <button class="btns" data-action="7">7</button>
            <button class="btns" data-action="8">8</button>
            <button class="btns" data-action="9">9</button>
            <button class="btns operator" data-action="(">(</button>
            <button class="btns operator" data-action=")">)</button>
            <!--5-->
            <button class="btns" data-action="4">4</button>
            <button class="btns" data-action="5">5</button>
            <button class="btns" data-action="6">6</button>
            <button class="btns operator" data-action="*">×</button>
            <button class="btns operator" data-action="/">/</button>
            <!--6-->
            <button class="btns" data-action="1">1</button>
            <button class="btns" data-action="2">2</button>
            <button class="btns" data-action="3">3</button>
            <button class="btns operator" data-action="+">+</button>
            <button class="btns operator" data-action="-">−</button>
            <!--7-->
            <button class="btns" data-action="%">%</button>
            <button class="btns zero" data-action="0">0</button>
            <button class="btns" data-action=".">.</button>
            <button class="btns equals" data-action="=" title="=">=<span style="font-weight: 400;font-size: 14px;margin-left: 5px;">(Save)</span></button>
        </div>
    </div>
</div>

<!-- 删除已设置的本地文件夹 -->
<div class="part-div">
    <Dialog closeOnInteractOutside={false} closeOnEscape={false} open={clear_history_dialog_is_open} onOpenChange={()=>{}}>
        <Portal>
            <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/80  select-none" />
            <Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center font-text select-none">
                <Dialog.Content class="card bg-neutral-100 dark:bg-neutral-900 w-full max-w-xs p-4 space-y-4 shadow-xl {animation}  px-[10px] py-[10px] border-radius">
                    <header class="flex justify-between items-center pywebview-drag-region can-drag">
                        <Dialog.Title class="font-text">⚠️</Dialog.Title>
                    </header>
                    <Dialog.Description class="font-text select-text">
                        {@html func.get_translate('calculator_clear_history')}
                    </Dialog.Description>
                    <footer class="flex justify-center gap-10 select-none  px-[10px] py-[10px]">
                        <button title="Cancel" class="btn btn-base preset-tonal font-text" onclick={()=>def.close_dialog()}>{func.get_translate("btn_cancel")}</button>
                        <button title="Update" type="button" class="btn btn-base preset-filled-primary-500 font-text" onclick={()=>def.clear_history()}>{func.get_translate("clear")}</button>
                    </footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    </Dialog>
</div>

<style>
    .calc-box{
        padding: 0 0;
        margin: 0 auto;
        /*background-color: var(--color-surface-950);*/
        /*height: calc(100vh - 5px);*/
    }

    /* 隐藏默认的触摸高亮 */
    * {
        -webkit-tap-highlight-color: transparent;
    }

    .calculator {
        font-family: 'Segoe UI', Roboto, system-ui, sans-serif;
        max-width: 520px;
        min-width: 280px;
        width: 100%;
        height: 100%;
        min-height: 630px;
        /**/
        margin-left: auto;
        margin-right: auto;
        padding: 10px 10px;
        user-select: none;
        background-color: var(--color-surface-950);
        color: white;
        border-radius: 25px;
        border: 1px solid rgba(180,180,180, 0.9);
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
        margin-top: 15px;
        margin-bottom: 10px;
    }
    .btns {
        background-color: #314a5c;
        padding: 13px 2px;
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
    .btns:active {
        transform: scale(1.08);
        transition: transform 0.1s linear;
    }
    .btns:hover {
        opacity: 0.9;
    }
    .btns.function {
        background-color: #2f5570;
        font-size: 16px;
    }
    .btns.operator {
        background-color: #d98c5f;
        font-size: 16px;
    }
    .btns.equals {
        background-color: #e6845e;
        font-weight: 700;
        grid-column: span 2;
    }

    .btns.clear_history{
        line-height: 16px;
        background-color: red;
        font-size: 12px;
        color: #0f212b;
        border-color: red;
        font-weight: 400;
        /**/
        transform: scaleY(1.2);
        display: inline-block;
        padding-top: 0;
        padding-bottom: 0;
        height: 36px;
        margin-top: 4px;
        border-radius: 53px;
    }
    .btns.clear_history:active{
        transform: translateY(4px);
        transition: transform 0.1s ease;
    }
    .btns.rewrite {
        line-height: 16px;
        background-color: #e6845e;
        font-size: 12px;
        color: #0f212b;
        font-weight: 400;
        /**/
        transform: scaleY(1.2);
        display: inline-block;
        padding-top: 0;
        padding-bottom: 0;
        height: 36px;
        margin-top: 4px;
        border-radius: 53px;
    }
    .btns.rewrite:active{
        transform: translateY(4px);
        transition: transform 0.1s ease;
    }
    .btns.del {
        line-height: 16px;
        background-color: #e6845e;
        font-size: 16px;
        color: #0f212b;
        font-weight: 400;
        /**/
        transform: scaleY(1.2);
        display: inline-block;
        padding-top: 0;
        padding-bottom: 0;
        height: 36px;
        margin-top: 4px;
        border-radius: 53px;
    }
    .btns.del:active{
        transform: translateY(4px);
        transition: transform 0.1s ease;
    }
    .btns.del {
        &::before {
            content: '';
        }
    }

</style>