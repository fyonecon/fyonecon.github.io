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
    let rewrite_dialog_is_open = $state(false);
    let clear_history_dialog_is_open = $state(false);
    let history = $state([]);
    const calculator_history_min_height = 70; // 70
    let calculator_history_height = $state(calculator_history_min_height);
    const calculator_min_height = 600; // 630
    let calculator_height = $state(calculator_min_height);

    // 播放按键点击mp3声音
    // AudioContext法（主）
    let audioContext = $state(null);
    let audioBuffer = $state(null);
    // Audio法（备）
    let audio = $state(null);

    // 从localStorage加载历史记录，最多N条
    const MAX_HISTORY = 666; // [100, 999]
    const STORAGE_KEY = config.app.app_class + 'calculator_history';

    // 保留小数点位数
    const result_fixed_len = 15;

    // 高精度常数
    const PI = '3.14159265358979323846264338327950288419716939937510';  // 50位
    const E = '2.71828182845904523536028747135266249775724709369995';   // 50位
    const PHI = '1.61803398874989484820458683436563811772030917980576'; // 50位

    // 计算器内部状态变量
    let currentExpr = $state('');
    let lastResult = $state('0');
    let justCalculated = $state(false);
    let lastError = $state('');
    let cursorPos = $state(0); // 光标位置（索引，从0开始，指向光标左侧的位置，即光标位于该索引之后）

    // DOM元素引用
    let historyContainer: HTMLElement | null = $state(null);
    let historyList: HTMLElement | null = $state(null);
    let exprEl: HTMLElement | null = $state(null);
    let resultEl: HTMLElement | null = $state(null);
    let errorEl: HTMLElement | null = $state(null);

    // 本页面函数：Svelte的HTML组件onXXX=中正确调用：={()=>def.xxx()}
    const def = {
        close_dialog: function(){
            rewrite_dialog_is_open = false;
            clear_history_dialog_is_open = false;
        },
        open_clear_history_dialog: function(){
            clear_history_dialog_is_open = true;
        },
        open_rewrite_dialog: function(){
            rewrite_dialog_is_open = true;
        },
        btn_clear_history: function(){
            let that = this;
            //
            def.close_dialog();
            def.clear_history();
        },
        btn_rewrite: function(){
            let that = this;
            //
            def.close_dialog();
            def.rewrite_exp();
        },
        scroll_to_bottom: function(behavior = 'smooth', ele=null){ // 自动滚动到底部
            if (ele){
                // 元素滚动高度 = 整个内容高度 - 容器本身client高度
                // scrollHeight 是内容总高度(包括溢出部分)，clientHeight 是可见区域高度
                const targetScrollTop = ele.scrollHeight - ele.clientHeight;
                ele.scrollTo({
                    top: targetScrollTop,
                    behavior: behavior      // 'smooth' 或 'auto'
                });
            }else{
                console.warn("id_ele=null");
            }
        },
        auto_calc_calculator_height: function(){ // 动态计算计算器的高度
            let section_main_space_height = 5; // px
            let bar_bottom = 5; // px，这还是横条区域的高度
            let avail_height = window.innerHeight;
            //
            if (avail_height > calculator_min_height+bar_bottom){
                //
                calculator_height = avail_height - section_main_space_height - bar_bottom;
                //
                calculator_history_height = (avail_height - calculator_min_height - bar_bottom) + calculator_history_min_height - section_main_space_height - bar_bottom;
            }else{
                //
                calculator_height = calculator_min_height-section_main_space_height - bar_bottom;
                //
                calculator_history_height = calculator_history_min_height - section_main_space_height- bar_bottom;
            }
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
        // 计算器辅助函数
        loadHistory: function() {
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
        },
        saveHistory: function() {
            try {
                // 只保存最新的x条
                const toSave = history.slice(0, MAX_HISTORY);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
            } catch (e) {
                console.warn('保存历史记录失败:', e);
            }
        },
        updateDisplay: function() {
            if (!exprEl) return;

            // 在 cursorPos 位置插入光标符号 '|' (使用<span>包裹以便样式化)
            const beforeCursor = currentExpr.substring(0, cursorPos);
            const afterCursor = currentExpr.substring(cursorPos);

            // 使用innerHTML 插入光标占位符（一个不可选的竖线字符，带闪烁效果）
            exprEl.innerHTML = beforeCursor + '<span class="cursor-blink">|</span>' + afterCursor;

            // 如果表达式为空，显示0，但光标仍然存在
            if (currentExpr === '') {
                exprEl.innerHTML = '<span class="cursor-blink">|</span>';
            }

            if (resultEl) resultEl.innerText = lastResult;
            if (errorEl) errorEl.innerText = lastError;
        },
        clearError: function() {
            // 不清空表达式，只重置结果和错误
            // 为了保持一致性，如果表达式为空，则重置结果
            if (currentExpr === '') {
                lastResult = '0';
            }
            lastError = '';
            if (errorEl) errorEl.innerText = '';
            def.updateDisplay();
        },
        renderHistory: function() {
            if (!historyList) return;

            if (history.length === 0) {
                historyList.innerHTML = '<li class="empty-history" style="text-align: center; font-size: 16px; line-height: 60px;"> ✨ <span style="opacity: 0.6;">'+func.get_translate("Calculator")+'</span> ✨ </li>';
                return;
            }

            const frag = document.createDocumentFragment();
            // 显示最新的记录（数组前面是最新的）
            let _history = history.slice(0, MAX_HISTORY).reverse(); // 最新的历史+倒叙
            //
            _history.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = 'history-item click font-text font-blue break';
                li.setAttribute('data-expr', item.expr);
                li.setAttribute('data-value', item.value);
                //
                // let _index = (history.length-index);
                let _index = index+1;
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
                li.innerHTML = "<span style='color: rgba(160,160,160, 1); padding-right: 5px;'>#"+index_txt+"</span>";
                // 表达式
                const exprSpan = document.createElement('span');
                exprSpan.className = 'history-expr';
                exprSpan.innerHTML = item.expr;
                // 值
                const valSpan = document.createElement('span');
                valSpan.className = 'history-value';
                valSpan.innerHTML = "<span style='color: rgba(160,160,160, 1); padding-left: 5px; padding-right: 5px;'>=</span>" + item.value;
                //
                li.appendChild(exprSpan);
                li.appendChild(valSpan);
                //
                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    //
                    def.play_btn_click_mp3();
                    //
                    const expr = li.getAttribute('data-expr');
                    const val = li.getAttribute('data-value');
                    if (expr && val) {
                        currentExpr = expr;
                        lastResult = val;
                        justCalculated = true;
                        // 光标移至最右端
                        cursorPos = currentExpr.length;
                        def.clearError();
                        def.updateDisplay();
                    }
                });
                //
                frag.appendChild(li);
            });
            //
            historyList.innerHTML = '';
            historyList.appendChild(frag);
            //
            setTimeout(function (){
                def.scroll_to_bottom("smooth", historyContainer);
            }, 100);
        },
        addHistory: function(expr, value) {
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
            def.saveHistory();

            // 重新渲染
            def.renderHistory();
        },
        // 检查括号是否匹配
        checkParentheses: function(expr) {
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
        },
        // 将阶乘函数添加到Math对象
        factorialN: function(n) { // [0, n)
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
        },
        // 获取当前时间字符串：年月日时分秒（例如 20260312171001）
        getCurrentDateTimeString: function() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const minute = String(now.getMinutes()).padStart(2, '0');
            const second = String(now.getSeconds()).padStart(2, '0');
            return `${year}${month}${day}${hour}${minute}${second}`;
        },
        // 预处理计算表达式 - 使用高精度常数（可配置精度）
        preprocessExpression: function(expr) {
            if (!expr || expr.trim() === '') return '';

            // 运算符还原
            let processed = expr
                // 替换运算符
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-')
                .replace(/\^/g, '**');

            // 先处理函数名称，避免函数名中的'e'被误替换
            processed = processed
                .replace(/\b(sin|cos|tan|asin|acos|atan|log|ln|sqrt|exp)\b\s*\(/g, function(match) {
                    return 'FUNC_' + match.replace('(', '_LP_');
                });

            // 处理 φ 常数
            processed = processed.replace(/φ/g, PHI);

            // 处理 e
            processed = processed.replace(/(?<![a-zA-Z])eπ/g, E + '*' + PI);
            processed = processed.replace(/(?<![a-zA-Z])e\(/g, E + '*(');
            processed = processed.replace(/(\d*)π/g, function(match, num) {
                if (num === '') return PI;
                return num + '*' + PI;
            });
            processed = processed.replace(/(\d*)(?:\.?\d*)?e(\d*\.?\d*)/g, function(match, numBefore, numAfter) {
                if (match.includes('FUNC_')) return match;
                if (numBefore === '' && numAfter === '') return E;
                if (numBefore === '') return E + '*' + parseFloat(numAfter);
                if (numAfter === '') return parseFloat(numBefore) + '*' + E;
                return parseFloat(numBefore) + '*' + E + '*' + parseFloat(numAfter);
            });
            processed = processed.replace(/(?<![a-zA-Z])e\.(\d+)/g, E + '*0.$1');
            processed = processed.replace(/(\d+)e\.(\d+)/g, '$1*' + E + '*0.$2');

            // 恢复函数名
            processed = processed.replace(/FUNC_(\w+)_LP_/g, '$1(');

            // 其他计算
            processed = processed
                .replace(/(\d)\(/g, '$1*(')
                .replace(/\)(\d)/g, ')*$1')
                .replace(/\)\(/g, ')*(')
                .replace(/(\d+(\.\d*)?|\.\d+)%/g, '$1*0.01')
                .replace(/(\d+|\))\s*!/g, function(match) {
                    const num = match.replace('!', '').trim();
                    return `Math.factorial(${num})`;
                })
                .replace(/\b(sin|cos|tan|asin|acos|atan|sqrt)\s*\(/g, 'Math.$1(')
                .replace(/\blog\b\s*\(/g, 'Math.log10(')
                .replace(/\bln\b\s*\(/g, 'Math.log(');

            return processed;
        },
        // 安全的表达式求值
        safeEvaluate: function(expr) {
            if (!expr || expr.trim() === '') {
                return { value: '0', error: null };
            }

            if (!def.checkParentheses(expr)) {
                return { value: null, error: 'Not Match "()".' };
            }

            try {
                const processedExpr = def.preprocessExpression(expr);

                if (processedExpr.includes('Function') ||
                    processedExpr.includes('eval') ||
                    processedExpr.includes('setTimeout') ||
                    processedExpr.includes('setInterval')) {
                    return { value: null, error: 'Unsafe Input.' };
                }

                const func = new Function('Math', 'return (' + processedExpr + ')');
                let result = func(Math);

                if (typeof result !== 'number') {
                    return { value: null, error: 'Math Error.' };
                }
                if (isNaN(result)) {
                    return { value: null, error: 'Math out of range.' };
                }
                if (result === Infinity){
                    return { value: '∞', error: null };
                }

                result = parseFloat(result.toFixed(result_fixed_len));
                if (Number.isInteger(result)) {
                    result = Math.round(result);
                }
                return { value: result.toString(), error: null };
            } catch (e) {
                if (e.message.includes('Unexpected token')) {
                    return { value: null, error: 'Input Error.' };
                } else if (e.message.includes('is not defined')) {
                    const match = e.message.match(/(\w+) is not defined/);
                    const varName = match ? match[1] : 'unknown';
                    return { value: null, error: `Undefined: ${varName}` };
                } else if (e.message.includes('Division by zero')) {
                    return { value: null, error: '"/0" Error.' };
                } else {
                    return { value: null, error: 'Calc Error.' };
                }
            }
        },
        // 插入文本到光标位置
        insertAtCursor: function(text) {
            const before = currentExpr.substring(0, cursorPos);
            const after = currentExpr.substring(cursorPos);
            currentExpr = before + text + after;
            // 光标移动到插入文本之后
            cursorPos += text.length;
        },
        // 删除光标左侧的一个字符
        deleteLeft: function() {
            if (cursorPos > 0) {
                const before = currentExpr.substring(0, cursorPos - 1);
                const after = currentExpr.substring(cursorPos);
                currentExpr = before + after;
                cursorPos--;
            }
        },
        // 光标左移
        moveCursorLeft: function() {
            if (cursorPos > 0) {
                cursorPos--;
                def.updateDisplay();
            }
        },
        // 光标右移
        moveCursorRight: function() {
            if (cursorPos < currentExpr.length) {
                cursorPos++;
                def.updateDisplay();
            }
        },
        // 清除历史记录
        clear_history: function(){
            history = [];
            //
            def.clearError();
            def.saveHistory();
            def.renderHistory();
        },
        // 清除表达式
        rewrite_exp: function(){
            currentExpr = '';
            lastResult = '0';
            justCalculated = false;
            lastError = '';
            cursorPos = 0;
            //
            def.clearError();
        },
        handleAction: function(action, btnText) {
            const rawChar = btnText || action;

            def.play_btn_click_mp3();

            setTimeout(function (){
                def.scroll_to_bottom("smooth", exprEl);
            }, 100);

            def.clearError();

            if (justCalculated) {
                if (!'+-*/÷×^()'.includes(action) &&
                    action !== 'DEL' &&
                    action !== 'R' &&
                    action !== 'clear_history' &&
                    action !== ')' &&
                    action !== '(' &&
                    action !== '=' &&
                    action !== 'CURSOR_LEFT' &&
                    action !== 'CURSOR_RIGHT') {
                    currentExpr = '';
                    cursorPos = 0;
                }
                justCalculated = false;
            }

            // 光标左移
            if (action === 'CURSOR_LEFT') {
                def.moveCursorLeft();
                return;
            }

            // 光标右移
            if (action === 'CURSOR_RIGHT') {
                def.moveCursorRight();
                return;
            }

            // clear_history
            if (action === 'clear_history'){
                def.open_clear_history_dialog();
                return;
            }

            // 重写rewrite
            if (action === 'R'){
                def.open_rewrite_dialog();
                return;
            }

            if (action === 'DEL') {
                def.deleteLeft();
                if (currentExpr === '') {
                    lastResult = '0';
                }
                def.updateDisplay();
                return;
            }

            if (action === '=') {
                if (currentExpr === '') {
                    lastResult = '0';
                    def.updateDisplay();
                    return;
                }

                const result = def.safeEvaluate(currentExpr);
                if (result.error) {
                    lastError = result.error;
                    lastResult = lastError;
                } else if (result.value !== null) {
                    def.addHistory(currentExpr, result.value);
                    lastResult = result.value;
                    justCalculated = true;
                }

                def.updateDisplay();
                return;
            }

            // 构造要插入的字符串
            let insertStr = rawChar;

            if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt'].includes(action)) {
                insertStr = action + '(';
            } else if (action === 'pi') {
                insertStr = 'π';
            } else if (action === 'e') {
                insertStr = 'e';
            } else if (action === 'phi') {
                insertStr = 'φ';
            } else if (action === 'rand') {
                // 生成0-1之间的随机数，保留15位小数
                const randValue = Math.random().toFixed(15);
                insertStr = randValue;
            } else if (action === 'date') {
                // 获取当前时间字符串
                insertStr = def.getCurrentDateTimeString();
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

            // 在光标位置插入
            def.insertAtCursor(insertStr);

            if (currentExpr.trim() !== '') {
                // 可选项：实时计算（注释掉以保持一致性）
            } else {
                lastResult = '0';
            }

            def.updateDisplay();
        },
        init_calculator: function(){
            let that = this;
            //
            if (browser){
                // 获取DOM元素引用
                historyContainer = document.getElementById('historyContainer');
                historyList = document.getElementById('historyList');
                exprEl = document.getElementById('expression');
                resultEl = document.getElementById('result');
                errorEl = document.getElementById('errorMessage');

                // 重置状态变量
                def.rewrite_exp();

                // 将阶乘函数添加到Math对象
                Math.factorial = def.factorialN;

                // 从localStorage加载历史
                def.loadHistory().then((data)=>{
                    def.renderHistory();
                    // 初始光标位于最右端
                    cursorPos = currentExpr.length;
                    def.updateDisplay();
                });

                // 绑定按钮事件
                document.querySelectorAll('.btns').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        //
                        const action = btn.getAttribute('data-action');
                        const btnText = btn.innerText;
                        def.handleAction(action, btnText);
                    });
                });

                // 键盘支持
                document.addEventListener('keydown', (e) => {
                    const key = e.key;
                    const target = e.target;

                    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                        return;
                    }

                    // 左右方向键处理：移动光标
                    if (key === 'ArrowLeft') {
                        e.preventDefault();
                        def.play_btn_click_mp3();
                        def.moveCursorLeft();
                        return;
                    }
                    if (key === 'ArrowRight') {
                        e.preventDefault();
                        def.play_btn_click_mp3();
                        def.moveCursorRight();
                        return;
                    }

                    if (key.match(/[0-9]|\.|\+|\-|\*|\/|\(|\)|\^|=/)) {
                        e.preventDefault();
                    }

                    if (key >= '0' && key <= '9') {
                        def.handleAction(key, key);
                    } else if (key === '.' || key === '。') {
                        def.handleAction('.', '.');
                    } else if (key === '+') {
                        def.handleAction('+', '+');
                    } else if (key === '-') {
                        def.handleAction('-', '−');
                    } else if (key === '*' || key === 'X') {
                        def.handleAction('*', '×');
                    } else if (key === '/') {
                        // def.handleAction('/', '÷');
                        def.handleAction('/', '/');
                    } else if (key === '(' || key === '（') {
                        def.handleAction('(', '(');
                    } else if (key === ')' || key === '）') {
                        def.handleAction(')', ')');
                    } else if (key === '^') {
                        def.handleAction('pow', '^');
                    } else if (key === '=' || key === 'Enter') {
                        e.preventDefault();
                        def.handleAction('=', '=');
                    } else if (key === 'Escape') {
                        e.preventDefault();
                        def.handleAction('R', 'Rewrite');
                    } else if (key === 'Backspace' || key === 'Delete') {
                        e.preventDefault();
                        def.handleAction('DEL', 'Del');
                    } else if (key === 'P') {
                        def.handleAction('pi', 'π');
                    } else if (key === 'E') {
                        def.handleAction('e', 'e');
                    } else if (key === 'S') {
                        def.handleAction('sin', 'sin');
                    } else if (key === 'C') {
                        def.handleAction('cos', 'cos');
                    } else if (key === 'T') {
                        def.handleAction('tan', 'tan');
                    } else if (key === 'N' || key === '!' || key === '！') {
                        def.handleAction('n!', 'n!');
                    } else if (key === '%') {
                        def.handleAction('%', '%');
                    } else if (key === 'F') {
                        def.handleAction('phi', 'φ');
                    } else if (key === 'D') {
                        def.handleAction('date', 'date');
                    }
                    // else if (key === ',' || key === '，') {
                    //     def.handleAction('rand', 'rand');
                    // }
                });
            }else{
                console.warn("Sever===");
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
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audio = new Audio(btn_click_base64_mp3);
            audio.volume = 0.8;
            audio.load(); // 预加载音频并保持准备状态
            audio.preload = 'auto'; // 添加预加载和缓存优化
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
    <div class="calculator-div" style="height: {calculator_height}px;">
        <div class="display-area bg-neutral-100 dark:bg-neutral-800">
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

        <div class="buttons-div bg-neutral-100 dark:bg-neutral-800">
            <!--1-->
            <button class="btns edit clear_history" title="Clear all history" data-action="clear_history" id="clearHistoryBtn">{func.get_translate("clear")}</button>
            <button class="btns edit rewrite" data-action="R" title="Rewrite">{func.get_translate("rewrite")}</button>
            <button class="btns edit cursor-move" data-action="CURSOR_LEFT" title="Move Left">←</button>
            <button class="btns edit cursor-move" data-action="CURSOR_RIGHT" title="Move Right">→</button>
            <button class="btns edit del" data-action="DEL" title="Del">
                <svg style="display: inline-block;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M19 3a3 3 0 0 1 2.995 2.824L22 6v12a3 3 0 0 1-2.824 2.995L19 21H8.108a3 3 0 0 1-2.436-1.25l-.108-.16l-4.08-6.53a2 2 0 0 1-.087-1.967l.086-.153l4.081-6.53a3 3 0 0 1 2.351-1.404L8.108 3zm0 2H8.108a1 1 0 0 0-.773.366l-.075.104L3.18 12l4.08 6.53a1 1 0 0 0 .72.462l.128.008H19a1 1 0 0 0 .993-.883L20 18V6a1 1 0 0 0-.883-.993zm-8.121 3.464l2.12 2.122l2.122-2.122a1 1 0 1 1 1.414 1.415L14.415 12l2.12 2.121a1 1 0 0 1-1.414 1.415L13 13.414l-2.121 2.122a1 1 0 1 1-1.415-1.415L11.586 12L9.464 9.879a1 1 0 0 1 1.415-1.415"/></g></svg>
            </button>
            <!--1-->
            <button class="btns function" data-action="pi">π</button>
            <button class="btns function" data-action="e">e</button>
            <button class="btns function" data-action="phi">φ</button> <!--黄金分割 常数-->
            <button class="btns function" data-action="rand">Rand</button> <!--随机数 常数-->
            <button class="btns function" data-action="date">Date</button> <!--年月日时分秒 常数-->

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
            <!--4-->
            <button class="btns number" data-action="7">7</button>
            <button class="btns number" data-action="8">8</button>
            <button class="btns number" data-action="9">9</button>
            <button class="btns operator" data-action="(">(</button>
            <button class="btns operator" data-action=")">)</button>
            <!--5-->
            <button class="btns number" data-action="4">4</button>
            <button class="btns number" data-action="5">5</button>
            <button class="btns number" data-action="6">6</button>
            <button class="btns operator" data-action="*">×</button>
            <button class="btns operator" data-action="/">/</button>
            <!--6-->
            <button class="btns number" data-action="1">1</button>
            <button class="btns number" data-action="2">2</button>
            <button class="btns number" data-action="3">3</button>
            <button class="btns operator" data-action="+">+</button>
            <button class="btns operator" data-action="-">−</button>
            <!--7-->
            <button class="btns number" data-action="%">%</button>
            <button class="btns number zero" data-action="0">0</button>
            <button class="btns number" data-action=".">.</button>
            <button class="btns operator equals" data-action="=" title="=">=<span style="font-weight: 400;font-size: 14px;margin-left: 5px;">({func.get_translate("save")})</span></button>
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
                        <button title="Update" type="button" class="btn btn-base preset-filled-primary-500 font-text" onclick={()=>def.btn_clear_history()}>{func.get_translate("clear")}</button>
                    </footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    </Dialog>

    <Dialog closeOnInteractOutside={false} closeOnEscape={false} open={rewrite_dialog_is_open} onOpenChange={()=>{}}>
        <Portal>
            <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/80  select-none" />
            <Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center font-text select-none">
                <Dialog.Content class="card bg-neutral-100 dark:bg-neutral-900 w-full max-w-xs p-4 space-y-4 shadow-xl {animation}  px-[10px] py-[10px] border-radius">
                    <header class="flex justify-between items-center pywebview-drag-region can-drag">
                        <Dialog.Title class="font-text">⚠️</Dialog.Title>
                    </header>
                    <Dialog.Description class="font-text select-text">
                        {@html func.get_translate('calculator_rewrite')}
                    </Dialog.Description>
                    <footer class="flex justify-center gap-10 select-none  px-[10px] py-[10px]">
                        <button title="Cancel" class="btn btn-base preset-tonal font-text" onclick={()=>def.close_dialog()}>{func.get_translate("btn_cancel")}</button>
                        <button title="Update" type="button" class="btn btn-base preset-filled-primary-500 font-text" onclick={()=>def.btn_rewrite()}>{func.get_translate("rewrite")}</button>
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
    }
    * { /* 隐藏默认的触摸高亮 */
        -webkit-tap-highlight-color: transparent;
    }

    .calculator-div {
        font-family: 'Segoe UI', Roboto, system-ui, sans-serif;
        max-width: 520px;
        min-width: 280px;
        width: 100%;
        height: 100%;
        min-height: 630px;
        /**/
        margin-left: auto;
        margin-right: auto;
        padding: 5px 5px;
        user-select: none;
    }

    .display-area {
        display: block;
        border-radius: 15px;
        padding: 0 5px;
        border: 1px solid rgba(180,180,180, 1);
    }
    .history-section {
        padding: 5px 0;
        border-bottom: 1px solid rgba(180,180,180, 1);
    }
    .history-items-container {
        height: 70px; /* 大约2条记录的高度 */
        overflow-y: auto;
        transition: max-height 0.1s ease;
        scrollbar-width: thin;
        scrollbar-color: #5f9ea0 #1d2a32;
    }
    .history-items-container::-webkit-scrollbar {
        width: 5px;
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
        padding-bottom: 5px;
        font-weight: 400;
        text-align: left;
        line-height: 1.3;
        font-size: 16px;
    }

    .expression { /*表达式*/
        font-size: 18px;
        line-height: 1.3;
        font-weight: 300;
        text-align: right;
        word-wrap: break-word;
        word-break: break-all;
        border-bottom: 1px dashed rgba(180,180,180, 0.6);
        padding: 5px 0;
        /**/
        height: 80px;
        overflow-y: auto;
        /* 保证光标span可见 */
        white-space: pre-wrap;
        /**/
        scroll-snap-type: y mandatory;           /* 启用垂直方向强制吸附 */
        scroll-behavior: smooth;                  /* 平滑滚动（可选） */
        scroll-snap-align: end;                    /* 元素的底部与滚动容器底部对齐 */
        scroll-margin-bottom: 5px;                  /* 微调，留一点边距 */
    }
    .result { /*结果*/
        font-size: 18px;
        line-height: 1.3;
        font-weight: 600;
        text-align: right;
        word-wrap: break-word;
        word-break: break-all;
        padding: 5px 0;
        height: 40px;
        overflow-y: auto;
    }
    .error-message { /*错误信息*/
        color: #ffa07a;
        font-size: 16px;
        text-align: right;
        min-height: 20px;
    }

    .buttons-div {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 5px 5px;
        box-shadow: none;
        /**/
        border-radius: 15px;
        margin-top: 7px;
        padding: 5px 5px 8px 5px;
        border: 1px solid rgba(180,180,180, 1);
    }

    .btns {
        padding: 13px 2px;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        opacity: 1;
        height: 42px;
        /**/
        background: transparent;
        -webkit-tap-highlight-color: transparent;
    }
    .btns:active {
        transform: scale(1.08);
        transition: transform 0.1s linear;
    }
    .btns:hover {
        opacity: 0.9;
    }

    .btns.edit{
        background-color: #C95A4D; /*编辑*/
    }
    .btns.function {
        background-color: #6A9E7D; /*函数*/
    }
    .btns.number{
        background-color: #6FB7D4; /*数字*/
    }
    .btns.operator {
        background-color: #D9B650; /*等于*/
    }

    .btns.equals {
        grid-column: span 2;
    }

    .btns.edit{
        transform: scaleY(1.2);
        display: inline-block;
        padding-top: 0;
        padding-bottom: 0;
        height: 35px;
        margin-top: 5px;
        margin-bottom: 5px;
        border-radius: 15px;
        color: #0f212b;
    }
    .btns.edit:active{
        transform: translateY(4px);
        transition: transform 0.1s ease;
    }

    .btns.clear_history{
        line-height: 16px;
        font-size: 12px;
        border-color: red;
        font-weight: 400;
    }

    .btns.rewrite {
        line-height: 16px;
        font-size: 12px;
        font-weight: 400;
        /**/
    }
    .btns.del {
        line-height: 16px;
        font-size: 18px;
        font-weight: 400;
    }
    .btns.del { /*must*/
        &::before {
            content: '';
        }
    }
    .btns.cursor-move {
        line-height: 16px;
        font-size: 16px;
    }

</style>